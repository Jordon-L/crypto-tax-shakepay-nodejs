const Decimal = require('decimal.js');
const ethScan = require('../models/ethScan')
let totals = {}
// @desc setup totals variables
function setup(globalVars){
    totals = globalVars
}
// @desc calculate income tax and capital gains tax for cryptocurrency
async function processTax(file, year, globalVars){
    setup(globalVars)
    let df = csvToJSON(file)
    try{
        df = formatDataFrame(df)
    }
    catch(err){
        console.log(err)
    }
    df = df.map(function(e){
        e['Taken From'] = 'Shakepay'
        if(e['fees'] == undefined){
            e['fees'] = ''
        }
        return e
    })
    let addresses = totals.walletAddresses.split(',')
    addresses = addresses.map(address => address.toLowerCase())
    totals.walletAddresses = addresses

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
    
    
    let taxData
    let dataToBeSent
    //process the filtered csv data
    try{
        let taxTables = calculateTax(df)
        let capitalGainsTax = taxTables['capitalGainsTax']
        let incomeGainsTax = taxTables['incomeGainsTax']
        let unsoldHoldings = taxTables['unsoldHoldings']
        //capital gain
        let filteredCapital = filterByYear(capitalGainsTax, year)
        let numberBTC = new Decimal(0)
        let soldForBTC = new Decimal(0)
        let costBTC = new Decimal(0)
        let feesBTC = new Decimal(0)
        let gainBTC = new Decimal(0)
        let numberETH = new Decimal(0)
        let soldForETH = new Decimal(0)
        let costETH = new Decimal(0)
        let feesETH = new Decimal(0)
        let gainETH = new Decimal(0)
        let income = new Decimal(0)
        filteredCapital.forEach(entry => {
            if(entry['Name'] === 'Bitcoin'){
                numberBTC = Decimal.add(numberBTC, entry['Number'] )
                soldForBTC = Decimal.add(soldForBTC, entry['Sold For'] )
                costBTC = Decimal.add(costBTC, entry['Cost'])
                feesBTC = Decimal.add(feesBTC, entry['Fees'])
                gainBTC = Decimal.add(gainBTC, entry['Gain'])
            }
            else if(entry['Name'] === 'Ethereum'){
                numberETH = Decimal.add(numberETH, entry['Number'] )
                soldForETH = Decimal.add(soldForETH, entry['Sold For'] )
                costETH = Decimal.add(costETH, entry['Cost'])
                feesETH = Decimal.add(feesETH, entry['Fees'])
                gainETH = Decimal.add(gainETH, entry['Gain'])  
            }
        })
        //income gain
        let filteredIncome = filterByYear(incomeGainsTax, year)
        let incomeBTC = Decimal(0)
        let incomeETH = Decimal(0)
        filteredIncome.forEach(entry => {
            income = Decimal.add(income, entry['Income'])
            if(entry['Name'] === 'Bitcoin'){
                incomeBTC = Decimal.add(incomeBTC,entry['Income'])
            }
            if(entry['Name'] === 'Ethereum'){
                incomeETH = Decimal.add(incomeETH,entry['Income'])
            }
            
        })
        taxData = {        
            'incomeGain': income.toString(),
            'capitalGain': Decimal.add(gainETH,gainBTC).toString(),
            'totalNumberETH': numberETH.toString(),
            'totalSalePriceETH': soldForETH.toString(),
            'totalCostETH': costETH.toString(),
            'totalFeesETH': feesETH.toString(),
            'totalGainsETH': gainETH.toString(),
    
            'totalNumberBTC': numberBTC.toString(),
            'totalSalePriceBTC': soldForBTC.toString(),
            'totalCostBTC': costBTC.toString(),
            'totalFeesBTC': feesBTC.toString(),
            'totalGainsBTC': gainBTC.toString(),
        }

        let filteredTransactions = filterByYear(df, year)
        if(unsoldHoldings[year-1]){
            let previousYearHoldingsETH = {
                'Transaction Type': 'Previous year\'s remaining holdings',
                'Date': new Date(year-1,11,31), // months are from 0-11
                'Amount Debited': '',
                'Debit Currency': '',
                'Amount Credited': unsoldHoldings[year-1].Ethereum.total,
                'Credit Currency': 'ETH',
                'Buy / Sell Rate': unsoldHoldings[year-1].Ethereum.cost,
                'Direction' : 'credit',
                'Spot Rate' : '',
                'Source / Destination' : '',
                'Blockchain Transaction ID': '',
                'Event': 'Previous year\'s holdings',
                'Taken From' : '',
                'fees': ''
                
            }
            let previousYearHoldingsBTC = {
                'Transaction Type': 'Previous year\'s remaining holdings',
                'Date': new Date(year-1,11,31), // months are from 0-11
                'Amount Debited': '',
                'Debit Currency': '',
                'Amount Credited': unsoldHoldings[year-1].Bitcoin.total,
                'Credit Currency': 'BTC',
                'Buy / Sell Rate': unsoldHoldings[year-1].Bitcoin.cost,
                'Direction' : 'credit',
                'Spot Rate' : '',
                'Source / Destination' : '',
                'Blockchain Transaction ID': '',
                'Event': 'Previous year\'s holdings',
                'Taken From' : '',
                'fees': ''
            }
            filteredTransactions.unshift(previousYearHoldingsETH,previousYearHoldingsBTC)            
        }
        let columns = [
            {"title": 'Transaction Type', "field": 'Transaction Type'},
            {"title": 'Date', "field": 'Date'},
            {"title": 'Amount Debited', "field": 'Amount Debited'},
            {"title": 'Amount Credited', "field": 'Amount Credited'},
            {"title": 'Buy / Sell Rate', "field": 'Buy / Sell Rate'},
            {"title": 'Direction', "field": 'Direction'},
            {"title": 'Spot Rate', "field": 'Spot Rate'},
            {"title": 'Taken From', "field": 'Taken From'},
            {"title": 'Event', "field": 'Event'},
            {"title": 'Source / Destination', "field": 'Source / Destination'}
            ]
        
        dataToBeSent = {
            'columns': columns,
            'table': filteredTransactions,
            'info': taxData,
            'totals' : totals,
            'error': 'false'
        }
    }
    catch(err){
        console.log(err)
    }
    return new Promise((resolve, reject) => {
        
        if(taxData != null){
            resolve(dataToBeSent)
        }
        reject('No tax data')
    })
}


// @desc parse shakepay csv, splits on new line and commas.
function csvToJSON(csv){
    rows = csv.split('\n')
    column = rows[0].split(',')
    let table = []
    for(let i = 1; i < rows.length; i++){
        let row = rows[i].split(',')
        let jsonRow = {}
        for(let j = 0; j < row.length; j++){
            //remove the double quotations if there is
            if(row[j].includes('\"')){
                row[j] = row[j].slice(1,-1)
            }
            if(column[j].includes('\"')){
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
        element['Date'] = new Date(element['Date'] + ':00')
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
        let startOfYear = new Date(parsed, 0, 1).getTime() // Month starts at 0
        let endOfYear = new Date(parsed, 11, 31).getTime()
        return df.filter(entry => (entry['Date'].getTime() >= startOfYear &&
            entry['Date'].getTime() <= endOfYear) )
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
        totals.totalETH = amount
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

// @desc set the average cost of a currency
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

// @desc add to total fees
function addTotalFees(amount){
    totals.fees = Decimal.add(totals.fees, amount)
}

// @desc Calculate the income gain from receiving a currency and adjust the average cost
function peerTransfer(row){
    let event = ''
    if(row['Credit Currency'] === 'CAD'){
        event = 'Transfer Fiat'
        return event
    }
    else if(row['Debit Currency'] === 'CAD'){
        event = 'Transfer Fiat'
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
            let currentAvg = getAvgCost(creditCurrency)
            let numerator = Decimal.add(Decimal.mul(currentAvg, totalCreditCurrency), Decimal.mul(row['Spot Rate'], credit))
            let denominator =  Decimal.add(totalCreditCurrency, credit)
            let newAvg =  Decimal.div(numerator,denominator)
            setAvgCost(creditCurrency, newAvg)
            setCurrencyTotals(creditCurrency, denominator)           
        }
    }
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
    //credit
    let credit = row['Amount Credited']
    let creditCurrency = row['Credit Currency']
    let totalCreditCurrency = getCurrencyTotals(creditCurrency)
    let buyPrice = row['Buy / Sell Rate']
    if(creditCurrency == 'CAD'){
        buyPrice = 1;
    }
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
        }
        else if(gain.greaterThanOrEqualTo(0)){
            event = 'Capital Gain'
        }
    }
    return event
}

// @desc Calculate capital gain or loss when transferring crypto outside of shakepay
function cryptoCashout(row){
    let event = ''
    let address = row['Source / Destination']
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
        }
        else if(gain.greaterThanOrEqualTo(0)){
            event = 'Capital Gain'
        }
    }
    else{
        event = 'Internal transfer'
    }
    return event
}

function referralReward(row){
    let event = 'Income Gain'
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
    return event
}
// for ether scan data

function walletReceive(row){
    let event = ''
    let shakepayWallet = totals.shakepayWallet
    // check transaction was by user
    if(row['Source / Destination'].toLowerCase() === shakepayWallet.toLowerCase){
        event = 'Internal transfer' 
        let total = getCurrencyTotals(creditCurrency)
        total = Decimal.add(total, credit)
        setCurrencyTotals(creditCurrency, total)
    } // transaction was not by user
    else{
        event = 'Income Gain'
        let credit = row['Amount Credited']
        let creditCurrency = row['Credit Currency']
        let totalCreditCurrency = getCurrencyTotals(creditCurrency)
        let buyPrice = row['Spot Rate']
        let currentAvg = getAvgCost(creditCurrency)
        let numerator = Decimal.add(Decimal.mul(currentAvg, totalCreditCurrency), Decimal.mul(buyPrice, credit))
        let denominator = Decimal.add(totalCreditCurrency, credit)
        let newAvg = Decimal.div(numerator, denominator)
        setAvgCost(creditCurrency, newAvg)
        setCurrencyTotals(creditCurrency, denominator)
    }
    return event
}

function walletSend(row){
    let event = ''
    let address = row['Source / Destination']
    let debit = row['Amount Debited']
    let debitCurrency = row['Debit Currency']
    let totalDebitCurrency = getCurrencyTotals(debitCurrency)
    let avgDebitPrice = getAvgCost(debitCurrency)
    setCurrencyTotals(debitCurrency, Decimal.sub(totalDebitCurrency, Decimal.add(debit,row['fees'])))
    let salePrice = row['Spot Rate']
    let costToObtain = 0
    let credit = Decimal.mul(salePrice, debit)
    let shakepayWallet = totals.shakepayWallet
    let wallets = totals.walletAddresses
    addTotalFees(Decimal.mul(salePrice,row['fees']))
    if(shakepayWallet.toLowerCase() === address.toLowerCase() || wallets.includes(address)){
        event = 'Internal transfer'
    }
    else{
        if(!avgDebitPrice.equals(0)){
            costToObtain = Decimal.mul(avgDebitPrice, debit)
        }
        let gain = Decimal.sub(credit, costToObtain)
        if(gain.lessThan(0)){
            event = 'Capital Loss'
        }
        else if(gain.greaterThanOrEqualTo(0)){
            event = 'Capital Gain'
        } 
    }
    return event
}

// @desc function to round numbers to 10 decimal places
function roundTo10Decimal(num){
    return num.toDecimalPlaces(10, Decimal.ROUND_UP)
}
function calculateCapitalGainsTax(row){
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
    if (debitCurrency === 'ETH') {
        name = 'Ethereum'
    }
    else if (debitCurrency === 'BTC') {
        name = 'Bitcoin'
    }
    let gain = Decimal.sub(Decimal.sub(sold, price), fees)
    return {
        'Date': row['Date'],
        'Number': roundTo10Decimal(number),
        'Name': name,
        'Year of acquisition': year,
        'Sold For': roundTo10Decimal(sold),
        'Cost': roundTo10Decimal(price),
        'Fees': roundTo10Decimal(fees),
        'Gain': roundTo10Decimal(gain),
    }
}
function calculateIncomeTax(row){
    let credit = row['Amount Credited']
    let creditCurrency = row['Credit Currency']
    if(creditCurrency === 'CAD'){
        return {
            'Date': row['Date'],
            'Name': 'Canadian Dollars',
            'Number': roundTo10Decimal(credit),
            'Cost': 1,
            'Income': roundTo10Decimal(credit),
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
        'Number': roundTo10Decimal(credit),
        'Cost': roundTo10Decimal(price),
        'Income': roundTo10Decimal(income),
    }
}

function calculateTax(table){
    let TRANSACTION_PARSE = {
        'peer transfer': peerTransfer,
        'fiat funding': fiatFunding,
        'purchase/sale': purchaseSale,
        'crypto cashout': cryptoCashout,
        'referral reward': referralReward,
        'crypto funding': cryptoFunding,
        'fiat cashout': fiatCashout,
        'Receive': walletReceive,
        'Send': walletSend,
        'shakingsats': peerTransfer,
        'other': referralReward
    }
    let capitalGainsTax = []
    let capitalRow = []
    let capitalLossRow = []
    let incomeGainsTax = []
    let purchases = []
    let lastYear = table[0]['Date'].getFullYear() - 1
    let unsoldHoldings = {}
    //separate capital gain and income gain
    table.forEach(row => {
        if(row['Date'].getFullYear() > lastYear){
            unsoldHoldings[lastYear] = {
                'Ethereum': {
                    'total': totals.totalETH,
                    'cost': totals.avgETH
                },
                'Bitcoin': {
                    'total': totals.totalBTC,
                    'cost': totals.avgBTC
                }
            }
            lastYear = lastYear + 1
        }
        let event = TRANSACTION_PARSE[row['Transaction Type']](row)
        row['Event'] = event
        //parse entry to capital gains tax table
        if(event === 'Capital Gain' || event === 'Capital Loss'){
            capitalGainsTax.push(calculateCapitalGainsTax(row))
            capitalRow.push(row)
            if(event === 'Capital Loss'){
                capitalLossRow.push(row)
            }
        }

        else if(event === 'Income Gain'){
            incomeGainsTax.push(calculateIncomeTax(row))
        }
        else if(event === 'Purchase Crypto'){
            purchases.push(row)
        }
    })
    //check for superficial loss
    capitalLossRow.forEach(row => {
        let sellDate = row['Date']
        let before = new Date(sellDate)
        before.setDate(before.getDay() - 31)
        let after = new Date(sellDate)
        after.setDate(after.getDay() + 31)
        before.setUTCHours(23, 59, 59, 59)
        after.setUTCHours(0, 0, 0, 0)
        for(let i = 0; i < purchases.length; i++){
            let purchase = purchases[i]
            let buyDate = purchase['Date']
            if((buyDate > before || buyDate < after) && purchase['Credit Currency'] === row['Debit Currency']){
                row['Event'] = 'Superficial Loss'
                break
            }
        }
    })
    capitalGainsTax = capitalGainsTax.filter((row, index) => capitalRow[index]['Event'] !== 'Superficial Loss')
    return {capitalGainsTax, incomeGainsTax, purchases, unsoldHoldings}
}

// @desc takes etherscan data obtain from given address and merges them with shakepay data
async function mergeEtherScan(shakepayData, address){
    try{
        shakepayData = shakepayData.map(function(e) {
            if(e['fees'] == undefined){
                e['fees'] = ''
            }
            
            return e
        })

        let etherScanData = await ethScan.getEthTransactions_ShakepayFormat(address, 'ethereum', 'CAD')

        let mergedData = shakepayData.concat(etherScanData)
        mergedData = mergedData.sort(sortByDate)
        return mergedData
    }
    catch(err){
        throw err
    }
    
}

module.exports = {
    getCurrencyTotals,
    getAvgCost,
    setup,
    processTax,
    purchaseSale,
    cryptoCashout,
}