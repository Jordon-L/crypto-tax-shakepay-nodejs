const Tax = require('../models/taxModel')
const qs = require('querystring');

const { getPostData } = require('../utils')

// @desc Create tax info from inputted data (csv file, wallet address, shakepay address, year)
// @route POST /api/tax
async function createTaxInfo(req, res){
    try {
        const body = await getPostData(req)
        //parse the data that was sent by axios from client side (react)
        try{
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
            const newTaxInfo = await Tax.processTax(file, wallet, shakepay, year)
            res.writeHead(201,{'Content-Type': 'application/json'})
            res.end(JSON.stringify({error: "true"}))
        }
        catch(error){
            res.writeHead(404,{'Content-Type': 'application/json'})
            res.end(JSON.stringify({error: "true"}))
            console.log(error)
        }

            //res.end(JSON.stringify(newTaxInfo))

    }
    catch(error){
        console.log(error)
    }
}

module.exports = {
    createTaxInfo
}