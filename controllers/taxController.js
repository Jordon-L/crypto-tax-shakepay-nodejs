const Tax = require('../models/taxModel')
const qs = require('querystring');
const Decimal = require('decimal.js');

const { getPostData } = require('../utils')

// @desc Create tax info from inputted data (csv file, wallet address, shakepay address, year)
// @route POST /api/tax
async function createTaxInfo(req, res){
    try {
        const body = await getPostData(req)
        //parse the data that was sent by axios from client side (react)
        let sep = body.split(/------WebKitFormBoundary\w+/)
        //file
        let file = sep[1].trim()
        file = file.split(/Content-Disposition: form-data; name=\"\w+\"; filename="blob"/)[1].trim()
        file = file.split(/Content-Type: text\/csv/)[1].trim()
        //wallet
        let wallet = sep[2].trim()
        wallet = wallet.split(/Content-Disposition: form-data; name=\"\w+\"/)[1].trim()
        //shakepay
        let shakepay = sep[3].trim()
        shakepay = shakepay.split(/Content-Disposition: form-data; name=\"\w+\"/)[1].trim()
        //year
        let year = sep[4].trim()
        year = year.split(/Content-Disposition: form-data; name=\"\w+\"/)[1].trim()
        // pass in "global" variables for function
        let globalVars = {
            totalCAD: new Decimal(0),
            totalBTC: new Decimal(0),
            totalETH: new Decimal(0),
            avgCAD: new Decimal(0),
            avgBTC: new Decimal(0),
            avgETH: new Decimal(0),
            fees: new Decimal(0),
            walletAddresses: wallet,
            shakepayWallet: shakepay
        }
        let taxFunc = Tax
        const newTaxInfo = await taxFunc.processTax(file, year, globalVars)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(newTaxInfo))
    }
    catch(error){
        res.writeHead(400,{'Content-Type': 'application/json'})
        res.end(JSON.stringify({error: "true"}))
    }
}

module.exports = {
    createTaxInfo
}