const Decimal = require('decimal.js');
const ethScan = require('../models/ethScan')
let totals = {}
// @desc setup totals variables
function setup(globalVars){
    totals = globalVars
}

async function processTax(file, year, globalVars){
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
        console.log(err)
    }
    let addresses = globalVars.walletAddresses.split(',')
    const regex = new RegExp(/^0x[a-fA-F0-9]{40}$/);
    try{
        for(let i = 0; i < addresses.length; i++){
            let result = regex.test(addresses[i])
            if (result) {
                df = await mergeEtherScan(df, addresses[i])

            }
        }
    }
    catch(err){
        console.log(err)
    }
    
    
    
    //process the filtered csv data
    try{
        //df = filterByYear(df, year)
        let taxTables = calculateTax(df)
        let capitalGainsTax = taxTables['capitalGainsTax']
        let incomeGainsTax = taxTables['incomeGainsTax']
        let filteredCapital = filterByYear(capitalGainsTax, 2021)
        let filteredIncome = filterByYear(incomeGainsTax, 2021)
    }
    catch(err){
        console.log(err)
    }
    return new Promise((resolve, reject) => {

        const taxData = 0
        resolve(taxData)
    })
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

function formatDataFrame(df){
    df.forEach(element => {
        element['Date'] = new Date(element['Date'] + ":00")      
        if(element['Amount Credited'] != ''){
            element['Amount Credited'] = new Decimal(element['Amount Credited'])
        }
        if(element['Amount Debited'] != ''){
            element['Amount Debited'] = new Decimal(element['Amount Debited'])
        }
        if(element['Spot Rate'] != ''){
            element['Spot Rate'] = new Decimal(element['Spot Rate'])
        }       
        if(element['Buy / Sell Rate'] != ''){
            element['Buy / Sell Rate'] = new Decimal(element['Buy / Sell Rate'])
        }       
    })
    return df
}

function sortByDate(a, b){
    return a['Date'].getTime() - b['Date'].getTime();
}

function filterByYear(df, year){
    //const regex = new RegExp(/^\d+$/);
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
        return df.filter(entry => (entry['Date'].getTime() > startOfYear) &&
            (entry['Date'].getTime() <= endOfYear) )
    }
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
    return Decimal(0)
}

// @desc Set amount of a currency in the user's possession
function setCurrencyTotals(currency, amount){
    amount = Decimal(amount)
    if(amount.lessThan(0)){
        amount = Decimal(0)
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
    amount = Decimal(amount)
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
        event = 'Income Gain'
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

// @desc increase amount of fiat the user's possession
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

// @desc Calculate the capital gain and loss when a transaction exchanges a currency for a different currency
// and increase amount of crypto the user's possession when a purchase happens
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
// @desc Calculate capital gain or loss when transferring crypto outside of shakepay
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
    let event = 'Income Gain'
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
// for ether scan data

function walletReceive(row){
    let event = ''
    let credit = row['Amount Credited']
    let creditCurrency = row['Credit Currency']
    let averagePrice = getAvgCost(creditCurrency)
    let total = getCurrencyTotals(creditCurrency)
    let sendTransactions = totals.send
    let shakepayWallet = totals.shakepayWallet
    // check transaction was by user
    if(row['Source / Destination'].toLowerCase() === shakepayWallet.toLowerCase){
        event = 'Internal transfer' 
        total = Decimal.add(total, credit)
        totals.totalETH = total
    } // transaction was not by user
    else{
        event = 'Income Gain'
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
    let event = 'Income Gain'
    let incomeGain = totals.incomeGain
    let credit = row['Amount Credited']
    let creditCurrency = row['Credit Currency']
    if(creditCurrency === 'CAD'){
        totals.incomeGain = Decimal.add(incomeGain,credit)
    }
    return event
}

// @desc function to round numbers to 4 decimal places
function roundTo4Decimal(num){
    return num.toDecimalPlaces(4, Decimal.ROUND_UP)
}
function calculateCapitalGainsTax(row){
    let event = row['Event']
    
    let debitCurrency = row['Debit Currency']
    let number = row['Amount Debited']
    let name = 'Error'
    let year = 'placeholder'
    let sold = Decimal(0)
    let fees = Decimal(0)
    // if credit is empty, means user transferred crypto to an account that is not theirs
    if (row['Amount Credited'] === '') {
        sold = Decimal.mul(row['Spot Rate'], row['Amount Debited'])
    }
    else {
        // user sold crypto for fiat
        sold = row['Amount Credited']
    }
    let price = Decimal.mul(getAvgCost(debitCurrency), row['Amount Debited'])
    if (getCurrencyTotals(debitCurrency).equals(0)) {
        setAvgCost(debitCurrency, 0)
    }
    if (debitCurrency === 'ETH') {
        name = 'Ethereum'
        let accumulatedFees = 0 // need calculate

    }
    else if (debitCurrency === 'BTC') {
        name = 'Bitcoin'
    }
    let gain = Decimal.sub(Decimal.sub(sold, price), fees)
    return {
        'Date': row['Date'],
        'Number': roundTo4Decimal(number),
        'Name': name,
        'Year of acquisition': year,
        'Sold For': roundTo4Decimal(sold),
        'Cost': roundTo4Decimal(price),
        'Fees': roundTo4Decimal(fees),
        'Gain': roundTo4Decimal(gain),
    }
}
function calculateIncomeTax(row){
    let credit = row['Amount Credited']
    let creditCurrency = row['Credit Currency']
    if(creditCurrency === 'CAD'){
        return {
            'Date': row['Date'],
            'Name': 'Canadian Dollars',
            'Number': roundTo4Decimal(credit),
            'Cost': 0,
            'Income': roundTo4Decimal(credit),
        }
    }
    let price = row['Spot Rate']
    
    let income = Decimal.mul(price, credit)
    let name = 'placeholder'
    if (creditCurrency === 'ETH') {
        name = 'Ethereum'
    }
    else if (creditCurrency === 'BTC') {
        name = 'Bitcoin'
    }
    return {
        'Date': row['Date'],
        'Name': name,
        'Number': roundTo4Decimal(credit),
        'Cost': roundTo4Decimal(price),
        'Income': roundTo4Decimal(income),
    }
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
    let capitalGainsTax = []
    let incomeGainsTax = []
    table.forEach(row => {
        let event = TRANSACTION_PARSE[row['Transaction Type']](row)
        row['Event'] = event
        

            //add entry to capital gains tax table
        if(event === 'Capital Gain' || event === 'Capital Loss'){
            capitalGainsTax.push(calculateCapitalGainsTax(row))
        }

        if(event === 'Income Gain'){
            incomeGainsTax.push(calculateIncomeTax(row))
        }
    })
    return {capitalGainsTax, incomeGainsTax}
}

// @desc takes etherscan data obtain from given address and merges them with shakepay data
async function mergeEtherScan(shakepayData, address){
    try{
        let etherScanData = await ethScan.getEthTransactions_ShakepayFormat(address, 'ethereum', 'CAD')
        console.log(etherScanData)
        let mergedData = shakepayData.concat(etherScanData)
        return mergedData
    }
    catch(err){
        throw err
    }
    
}

module.exports = {
    processTax
}