function getPostData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = ''

            req.on('data', (chunk) => {
                body += chunk.toString()
            })

            req.on('end', () => {
                resolve(body)
            })
        }
        catch (error) {
            reject(err)
        }
    })
}
function JSONToCSV(rows, columns){
    let csvContent = "data:text/csv;charset=utf-8,";
    
}
module.exports = {
    getPostData
}