const Decimal = require('decimal.js');
let global = {}
// @desc setup global variables
function setup(globalVars){
    global = globalVars
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
    console.log(year)
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
function processTax(file, wallet, shakepayWallet, year, globalVars){
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

    //etherscan

    df = filterByYear(df, year)

    if(df == 0){
        //error
    }
    //process the filtered csv data
    try{
        calculateTax(df)
    }
    catch(err){

    }
    return new Promise((resolve, reject) => {

        const taxData = 0
        resolve(taxData)
    })
}

function peerTransfer(row){
    let event = '213'
    let incomeGain = global.incomeGain
    if(row['Credit Currency'] === 'CAD'){
        event = 'Transfer Fiat'
        global.CADReceived = Decimal.add(global.CADReceived, row["Amount Credited"])
        global.totalCAD = Decimal.add(global.totalCAD, row["Amount Credited"])
        return event
    }
    else if(row['Debit Currency'] === 'CAD'){
        event = 'Transfer Fiat'
        global.CADSent = Decimal.add(global.CADReceived, row["Amount Debited"])
        global.totalCAD = Decimal.sub(global.totalCAD, row["Amount Debited"])
    }
    if(row['Direction'] === 'credit'){
        event = 'Income gain'
        return event
    }
    return event
}

function fiatFunding(row){
    let event = '213'
    return event
}

function purchaseSale(row){
    let event = '213'
    return event
}

function cryptoCashout(row){
    let event = '213'
    return event
}

function referralReward(row){
    let event = '213'
    return event
}

function cryptoFunding(row){
    let event = '213'
    return event
}

function fiatCashout(row){
    let event = '213'
    return event
}

function walletReceive(row){
    let event = '213'
    return event
}

function walletSend(row){
    let event = '213'
    return event
}

function referralReward(row){
    let event = '213'
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
        
    });
    console.log(global.totalCAD)
}

module.exports = {
    processTax
}