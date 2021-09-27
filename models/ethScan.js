const Decimal = require('decimal.js');
let apiKey = '0' // change
var api = require('etherscan-api').init(`${apiKey}`)
const CoinGecko = require('coingecko-api');
const axios = require('axios')
const CoinGeckoClient = new CoinGecko();


async function getEthTransactions(walletAddress){
    const getTransactions = () => {
        try {
            return axios.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=asc&apikey=R9SVCWI1TFKAZY5NG1GNU3AZAKE9NCCPJS`)
        } catch (error) {
          console.error(error)
        }
    }
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
    return price
}
async function getEthTransactions_ShakepayFormat(walletAddress, currency, fiat){
    let df = await getEthTransactions(walletAddress)
    let dailyPrice = await getCoinGeckoPrices(currency, fiat)
    let dfShakepay = {}
    console.log(dailyPrice)
    return df
}
module.exports = {
    getEthTransactions_ShakepayFormat
}