const Decimal = require('decimal.js');
let apiKey = process.env.etherscanAPI;
var api = require('etherscan-api').init(`${apiKey}`);
const CoinGecko = require('coingecko-api');
const axios = require('axios');
const CoinGeckoClient = new CoinGecko();

// @desc get normal transactions for a wallet address from etherscan 
async function getEthTransactions(walletAddress){
    const sleep = (milliseconds=1000) => new Promise(resolve => setTimeout(resolve, milliseconds))
    const getTransactions = () => {
        try { 
            return axios.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`)
        } catch (error) {
            throw new Error('Etherscan error');
        }
    }
    // remove any data we do not need
    try{
        await sleep(1000)
        let res = await getTransactions();
        let transactions = res.data.result
        transactions.forEach(element => {
            element['timeStamp'] =  new Date(Number(element['timeStamp'])*1000)
            delete element['blockNumber']
            delete element['hash']
            delete element['nonce']
            delete element['blockHash']
            delete element['isError']
            delete element['txreceipt_status']
            delete element['input']
            delete element['contractAddress']
            delete element['cumulativeGasUsed']
            delete element['gasUsed']
            delete element['confirmations']
        })
        
        return transactions
    }
    catch(err){
        throw err
    }
}

// @desc get the all etheruem daily prices from coingecko
async function getCoinGeckoPrices(){
    params = {}
    params['days'] = 'max'
    params['vs_currency'] = 'cad'
    let data = await CoinGeckoClient.coins.fetchMarketChart('ethereum', params)
    dailyPrice = {}
    data.data.prices.forEach(element =>{
        let time = element[0]
        let price = element[1]
        let date = new Date(time)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let dateOfTransaction = new Date(month  + '-' + day + '-' + year)
        dailyPrice[dateOfTransaction] = price
    })
    return dailyPrice
}

function getCoinGeckoDailyPrices(date, dailyPrices){
    price = dailyPrices[date]
    return Decimal(price)
}
async function getEthTransactions_ShakepayFormat(walletAddress, currency, fiat){
    const regex = new RegExp(/^0x[a-fA-F0-9]{40}$/);
    
    let result = regex.test(walletAddress)
    if(!result){
        throw new Error('address is not an ethereum address');
    }
    try{
        let df = await getEthTransactions(walletAddress)
        let dailyPrices = await getCoinGeckoPrices(currency, fiat)
        let dfShakepay = []
        let total = 0
        df.forEach(row => {
            let transactionTime = new Date(row['timeStamp'])
            let year = transactionTime.getFullYear()
            let month = transactionTime.getMonth() + 1
            let day = transactionTime.getDate()
            let dateOfTransaction = new Date(month  + '-' + day + '-' + year)
            let price = getCoinGeckoDailyPrices(dateOfTransaction, dailyPrices)
            let value = Decimal.div(row['value'], Decimal('1000000000000000000'))
            let fees = Decimal.div(row['gasPrice'], Decimal('1000000000000000000'))
            if(row['from'].toLowerCase()  === walletAddress.toLowerCase()){
                let entry = {
                    'Transaction Type' : 'Send',
                    'Date' : transactionTime,
                    'Amount Debited': value,
                    'Debit Currency': 'ETH',
                    'Amount Credited' : '',
                    'Credit Currency': '',
                    'Direction' : 'debit',
                    'Spot Rate' : price,
                    'Source / Destination' : row['to'],
                    'Taken From' : 'Etherscan',
                    'Event': '' ,
                    'fees': fees,
                }
                dfShakepay = dfShakepay.concat(entry)
            }
            else{
                let entry = {
                    'Transaction Type' : 'Receive',
                    'Date' : transactionTime,
                    'Amount Debited': '',
                    'Debit Currency': '',
                    'Amount Credited': value,
                    'Credit Currency': 'ETH',
                    'Direction' : 'credit',
                    'Spot Rate' : price,
                    'Source / Destination' : row['from'],
                    'Taken From' : 'Etherscan',
                    'Event': '' ,
                }
                dfShakepay = dfShakepay.concat(entry)    
            }
        })
        
        return dfShakepay 
    }
    catch(err){
        console.log(err)
    }

}
module.exports = {
    getEthTransactions_ShakepayFormat
}