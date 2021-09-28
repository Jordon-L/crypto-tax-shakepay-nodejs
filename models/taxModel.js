const Decimal = require('decimal.js');
const ethScan = require('../models/ethScan')
let totals = {}
// @desc setup totals variables
function setup(globalVars){
    totals = globalVars
}

// @desc parse shakepay csv, splits on new line and commas.
function csvToJSON(csv){
    rows = csv.split("\n")
    column = rows[0].split(",")
    let table = []
    for(let i = 1; i < rows.length; i++){
        let row = rows[i].split(",")
        let jsonRow = {}
        for(let j = 0; j < row.length; j++){
            //remove the double quotations if there is
            if(row[j].includes("\"")){
                row[j] = row[j].slice(1,-1)
            }
            if(column[j].includes("\"")){
                column[j] = column[j].slice(1,-1)
                jsonRow[column[j]] = row[j]
            }
            else{
                jsonRow[column[j]]  = row[j]    
            }
            
        }
        table[i-1] = jsonRow
    }
    return table
}
function compareDate(entry1, entry2){
    // need to do add ':00' for proper format for Date function
    return new Date(entry1['Date']+':00').getTime() - new Date(entry2['Date']+':00').getTime();
}
function formatDataFrame(df){
    df = df.forEach(element => {
        element['Amount Credited'] = new Decimal(element['Amount Credited'])
        element['Amount Debited'] = new Decimal(element['Amount Debited'])
        element['Spot Rate'] = new Decimal(element['Spot Rate'])
        element['Buy / Sell Rate'] = new Decimal(element['Buy / Sell Rate'])
    })  
    return df.sort(compareDate)
}
function filterByYear(df, year){
    const regex = new RegExp(/^\d+$/);
    const parsed = parseInt(year, 10);
    if(isNaN(parsed)) {
         return 0; 
    }
    else{
        if(parsed < 1970){
            parsed = 1970
        }
        let startOfYear = new Date(parsed, 1, 1).getTime()
        let endOfYear = new Date(parsed, 12, 31).getTime()
        return df.filter(entry => (new Date(entry['Date']+':00').getTime() > startOfYear) &&
            (new Date(entry['Date']+':00').getTime() <= endOfYear) )
    }
}
function processTax(file, year, globalVars){
    setup(globalVars)
    let df = csvToJSON(file)
    if('Taken From' in df[0]){
        //error
        console.log(10)
    }
    try{
        df = formatDataFrame(df)
    }
    catch(err){
        //error
    }


    
    df = filterByYear(df, year)

    if(df == 0){
        //error
    }
    //process the filtered csv data
    try{
        calculateTax(df)
    }
    catch(err){
        console.log(err)
    }
    return new Promise((resolve, reject) => {

        const taxData = 0
        resolve(taxData)
    })
}
// @desc Get amount of a currency in the user's possession
function getCurrencyTotals(currency){
    if(currency === 'CAD'){
        return totals.totalCAD
    }
    else if(currency === 'BTC'){
        return totals.totalBTC
    }
    else if(currency === 'ETH'){
        return totals.totalETH
    }
    return 0
}

// @desc Set amount of a currency in the user's possession
function setCurrencyTotals(currency, amount){
    if(amount < 0){
        amount = 0
    }
    if(currency === 'CAD'){
        totals.totalCAD = amount
    }
    else if(currency === 'BTC'){
        totals.totalBTC = amount
    }
    else if(currency === 'ETH'){
        totals.totalBTC = amount
    }
}

// @desc Get the average cost of a currency in the user's possession
function getAvgCost(currency){
    if(currency === 'CAD'){
        return totals.avgCAD
    }
    else if(currency === 'BTC'){
        return totals.avgBTC
    }
    else if(currency === 'ETH'){
        return totals.avgETH
    }
    return 0
}

//
function setAvgCost(currency, amount){
    
    if(currency === 'CAD'){
        totals.avgCAD = amount
    }
    else if(currency === 'BTC'){
        totals.avgBTC = amount
    }
    else if(currency === 'ETH'){
        totals.avgETH = amount
    } 
}
// @desc Calculate the income gain from receiving a currency and adjust the average cost
function peerTransfer(row){
    let event = ''
    let incomeGain = totals.incomeGain
    if(row['Credit Currency'] === 'CAD'){
        event = 'Transfer Fiat'
     totals.CADReceived = Decimal.add(totals.CADReceived, row['Amount Credited'])
     totals.totalCAD = Decimal.add(totals.totalCAD, row['Amount Credited'])
        return event
    }
    else if(row['Debit Currency'] === 'CAD'){
        event = 'Transfer Fiat'
     totals.CADSent = Decimal.add(totals.CADReceived, row['Amount Debited'])
     totals.totalCAD = Decimal.sub(totals.totalCAD, row['Amount Debited'])
        return event
    }
    if(row['Direction'] === 'credit'){
        event = 'Income gain'
        let credit = row['Amount Credited']
        let creditCurrency = row['Credit Currency']
        let totalCreditCurrency = getCurrencyTotals(creditCurrency)
        if(row['Spot Rate'] === ''){
            //if spot rate is empty for some reason. continue runnning code           
        }
        else{
            incomeGain = Decimal.add(incomeGain, Decimal.mul(credit,row['Spot Rate']))
            let currentAvg = getAvgCost(creditCurrency)
            let numerator = Decimal.add(Decimal.mul(currentAvg, totalCreditCurrency), Decimal.mul(row["Spot Rate"], credit))
            let denominator =  Decimal.add(totalCreditCurrency, credit)
            let newAvg =  Decimal.div(numerator,denominator)
            setAvgCost(creditCurrency, newAvg)
            setCurrencyTotals(creditCurrency, Decimal.add(totalCreditCurrency,credit))           
        }
    }
    totals.incomeGain = incomeGain
    return event
}

function fiatFunding(row){
    let event = 'Internal transfer'
    if(row['Direction'] === 'credit'){
        let credit = row['Amount Credited']
        let currency = row['Credit Currency']
        if(currency === 'CAD'){
            let totalCurrency = getCurrencyTotals(currency)
            setCurrencyTotals(currency, Decimal.add(totalCurrency, credit))
        }
    }
    return event
}

function purchaseSale(row){
    let event = 'Purchase Crypto'
    let capitalGain = totals.capitalGain
    let capitalLoss = totals.capitalLoss
    //credit
    let credit = row['Amount Credited']
    let creditCurrency = row['Credit Currency']
    let totalCreditCurrency = getCurrencyTotals(creditCurrency)
    let buyPrice = row['Buy / Sell Rate']
    let currentAvg = getAvgCost(creditCurrency)
    let numerator = Decimal.add(Decimal.mul(currentAvg, totalCreditCurrency), Decimal.mul(buyPrice, credit))
    let denominator = Decimal.add(totalCreditCurrency, credit)
    let newAvg = Decimal.div(numerator, denominator)
    setAvgCost(creditCurrency, newAvg)
    setCurrencyTotals(creditCurrency, denominator)
    //debit
    let debit = row['Amount Debited']
    let debitCurrency = row['Debit Currency']
    let totalDebitCurrency = getCurrencyTotals(debitCurrency)
    let avgDebitPrice = getAvgCost(debitCurrency)
    setCurrencyTotals(debitCurrency, Decimal.sub(totalDebitCurrency, debit))
    // sale of crypto to fait (taxable event)
    if(creditCurrency === 'CAD'){
        let costToObtain = 0
        if(!avgDebitPrice.equals(0)){
            costToObtain = Decimal.mul(avgDebitPrice, debit)
        }
        let gain = Decimal.sub(credit, costToObtain)
        if(gain.lessThan(0)){
            event = 'Capital Loss'
            capitalLoss = Decimal.add(capitalLoss, gain)
            totals.capitalLoss = capitalLoss
        }
        else if(gain.greaterThanOrEqualTo(0)){
            event = 'Capital Gain'
            capitalGain = Decimal.add(capitalGain, gain)
            totals.capitalGain = capitalGain
        }
    }
    totals.capitalGain = capitalGain
    return event
}

function cryptoCashout(row){
    let event = ''
    let address = row['Source / Destination']
    let capitalGain = totals.capitalGain
    let capitalLoss = totals.capitalLoss
    let debit = row['Amount Debited']
    let debitCurrency = row['Debit Currency']
    let totalDebitCurrency = getCurrencyTotals(debitCurrency)
    let avgDebitPrice = getAvgCost(debitCurrency)
    setCurrencyTotals(debitCurrency, Decimal.sub(totalDebitCurrency, debit))
    let salePrice = row['Spot Rate']
    let costToObtain = 0
    let credit = Decimal.mul(salePrice, debit)
    if(!(totals.walletAddresses.includes(address))){
        if(!avgDebitPrice.equals(0)){
            costToObtain = Decimal.mul(avgDebitPrice, debit)
        }
        let gain = Decimal.sub(credit, costToObtain)
        if(gain.lessThan(0)){
            event = 'Capital Loss'
            capitalLoss = Decimal.add(capitalLoss, gain)
            totals.capialLoss = capitalLoss
        }
        else if(gain.greaterThanOrEqualTo(0)){
            event = 'Capital Gain'
            capitalGain = Decimal.add(capitalGain, gain)
            totals.capitalGain = capitalGain
        }
    }
    else{
        event = 'Internal transfer'
        totals.send.push(row)
    }
    return event
}

function referralReward(row){
    let event = 'Income gain'
    let incomeGain = totals.incomeGain
    let credit = row['Amount Credited']
    let creditCurrency = row['Credit Currency']
    if(creditCurrency === 'CAD'){
        totals.incomeGain = Decimal.add(incomeGain, credit)
    }
    return event
}

function cryptoFunding(row){
    let event = 'Internal transfer'
    let credit = row['Amount Credited']
    let creditCurrency = row['Credit Currency']
    let totalCreditCurrency = getCurrencyTotals(creditCurrency)
    setCurrencyTotals(creditCurrency, Decimal.add(totalCreditCurrency, credit))
    return event
}

function fiatCashout(row){
    let event = 'Internal transfer'
    let bankTransfer = totals.bankTransferOutCAD
    let debit = row['Amount Debited']
    let debitCurrency = row['Debit Currency']
    if(debit === 'CAD'){
        bankTransfer = Decimal.add(bankTransfer, debit)
    }
    totals.bankTransferOutCAD = bankTransfer
    return event
}

function walletReceive(row){
    let event = ''
    let credit = row['Amount Credited']
    let averagePrice = getAvgCost(creditCurrency)
    let total = getCurrencyTotals(creditCurrency)
    let sendTransactions = totals.send
    let newSendTransactions = totals.send
    // check transaction was by user
    if(sendTransactions.length > 0 ){
        event = 'Error'
        sendTransactions.forEach(sendRows =>{
            let debit = sendRow['Amount Debited']
            if(credit.compareTo(debit)){
                event = 'Internal transfer'
                const index = newSendTransactions.indexOf(sendRows)
                if(index > -1){
                    newSendTransactions.splice(index, 1)
                }
            }
        })
        totals.send = newSendTransactions
        total = Decimal.add(total, credit)
        totals.totalETH = total
    } // transaction was not by user
    else{
        event = 'Income gain'
        let price = row['Spot Rate']
        let income = Decimal.mul(price, credit)
        let numerator = Decimal.mul(averagePrice, total)
        numerator = Decimal.add(numerator, income)
        let denominator = Decimal.add(credit, total)
        averagePrice = Decimal.div(numerator, denominator)
        total = Decimal.add(total, credit)
        setCurrencyTotals(creditCurrency, total)
        setAvgCost(creditCurrency, averagePrice)
        totals.incomeGain = Decimal.add(totals.incomeGain, income)
    }
    return event
}

function walletSend(row){
    let event = 'Interal Transfer'
    let debit = row['Amount Debited']
    let fees = row['fees']
    let averagePrice = totals.avgETH
    let total = totals.totalETH
    total = Decimal.sub(Decimal.sub(total,debit), fees)
    totals.feesInCAD = Decimal.mul(totals.feesinCAD, row['Spot Rate'])
    setCurrencyTotals(row['Debit Currency'], totals)
    return event
}

function referralReward(row){
    let event = 'Income gain'
    let incomeGain = totals.incomeGain
    let credit = row['Amount Credited']
    let creditCurrency = row['Credit Currency']
    if(creditCurrency === 'CAD'){
        totals.incomeGain = Decimal.add(incomeGain,credit)
    }
    return event
}


function calculateTax(table){
    let TRANSACTION_PARSE = {
        "peer transfer": peerTransfer,
        "fiat funding": fiatFunding,
        "purchase/sale": purchaseSale,
        "crypto cashout": cryptoCashout,
        "referral reward": referralReward,
        "crypto funding": cryptoFunding,
        "fiat cashout": fiatCashout,
        "Receive": walletReceive,
        "Send": walletSend,
        "shakingsats": peerTransfer,
        "other": referralReward
    }

    table.forEach(element => {
        let event = TRANSACTION_PARSE[element['Transaction Type']](element)
        element['Event'] = event
        
    })
    
}

module.exports = {
    processTax
}