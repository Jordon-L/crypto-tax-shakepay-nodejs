

function calculateTax(file, wallet, shakepayWallet, year){

    return new Promise((resolve, reject) => {

        const taxData = processTax()
        resolve(taxData)
    })
}

function processTax(){

}
module.exports = {
    calculateTax
}