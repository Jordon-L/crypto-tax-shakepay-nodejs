
// @desc parse shakepay csv, splits on new line and commas. Problem on csvs with new lines or commas within entries, but shakepay csv does not
function csvToJSON(csv){
    rows = csv.split("\n")
    column = rows[0].split(",")
    let table = {}
    for(let i = 1; i < rows.length; i++){
        let row = rows[i].split(",")
        let jsonRow = {}
        for(let j = 0; j < row.length; j++){
            jsonRow[column[j]] = row[j]
        }
        table[i-1] = jsonRow
    }
    return table
}



function processTax(file, wallet, shakepayWallet, year){

    let s = csvToJSON(file)

    return new Promise((resolve, reject) => {

        const taxData = 0
        resolve(taxData)
    })
}


module.exports = {
    processTax
}