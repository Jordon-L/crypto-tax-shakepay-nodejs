const Tax = require('../models/taxModel')

const { getPostData } = require('../utils')

// @desc Create tax info from inputted data (csv file, wallet address, shakepay address, year)
// @route POST /api/tax
async function createTaxInfo(req, res){
    try {
        const body = await getPostData(req)

        const {file, wallet, shakepayWallet, year} = JSON.parse(body)

        const csvInfo = {
            file,
            wallet,
            shakepayWallet,
            year
        }
            const newTaxInfo = await Tax.calculateTax(csvInfo)

            res.writeHead(201,{'Content-Type': 'application/json'})
            res.end(JSON.stringify(newTaxInfo))

    }
    catch(error){
        console.log(error)
    }
}

module.exports = {
    createTaxInfo
}