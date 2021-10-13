const http = require('http')
const {createTaxInfo} = require('./controllers/taxController')
const fs = require('fs')
const path = require("path")

const server = http.createServer((req, res) => {
    if(req.url === '/api/tax' && req.method == 'POST') {
       try {
           createTaxInfo(req, res)
        }
        catch(err){
            console.log(err)
        }

    }
    else if(req.url === '/' && req.method === 'GET'){
        let html = fs.readFile('./react/build/index.html', 'UTF-8', function(err, html){
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.end(html)
        })

    }
    else if(req.url.match(/\/static\/css\/.+/) && req.method === 'GET' ){
        
        let dir = './react/build' +req.url
        let css = fs.readFile(dir, 'UTF-8', function(err, css){
            res.writeHead(200, {'Content-Type': 'text/css'})
            res.end(css)
        })  
    }
    else if(req.url.match(/\/static\/js\/.+/) && req.method === 'GET'){
        let dir = './react/build' +req.url
        let js = fs.readFile(dir, 'UTF-8', function(err, js){
            res.writeHead(200, {'Content-Type': 'text/javascript'})
            res.end(js)
        })  
    }
    else{
        res.writeHead(404, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({message: 'Route Not Found'}))

    }


})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Server running on ${PORT}`))

