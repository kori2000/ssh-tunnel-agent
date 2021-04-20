const dotenv = require('dotenv')
const express = require('express')
const bodyParser = require('body-parser')
const ngrok = require('ngrok')
const ngrok_tcp = require('ngrok')
const app = express()

// Load ENV data
dotenv.config()

const PORT = process.env.SERVER_PORT || 5000
const APPN = process.env.SERVER_APPN || '/api'

let ssh_url = ''

// Server started
app.listen(PORT, () => {
    console.log(`API is listening on PORT : [${PORT}]`)
})

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    console.log("#", req.protocol + '://' + req.get('host') + req.originalUrl)
    next()
})

app.use(bodyParser.json())

// REST API : http://subdomain.ngrok.io:5000/api
ngrok.connect({
    proto : 'http',
    addr : PORT,
    authtoken: process.env.NGROK_TOKEN,
    region: process.env.NGROK_REGION,
    subdomain: process.env.NGROK_SUBDOMAIN,
    onLogEvent: data => {},
    onStatusChange: status => {}
})
.then( url => {
    console.log("API URL :", url)
})
.catch( err => {
    console.error(err)
    return new Error('ngrok Failed')
})

// SSH TCP
ngrok_tcp.connect({
    proto : 'tcp',
    addr : process.env.NGROK_PORT,
    authtoken: process.env.NGROK_TOKEN,
    region: process.env.NGROK_REGION
})
.then( url => {
    ssh_url = url
    console.log("SSH URL :", ssh_url)
})
.catch( err => {
    console.error(err)
    return new Error('ngrok Failed')
})


/*
 ****************************************
 *  Information for Health Monitor Tool
 *****************************************
*/

// Deliver SSH URL over API
app.get(APPN + '/ssh', (req, res) => {
    res.status(200)
    res.setHeader('Content-Type', 'text/html')
    return res.send(`[SSH URL] ${ssh_url}`)
})

app.get(APPN + '/', (req, res) => {
    res.status(200)
    res.setHeader('Content-Type', 'text/html')
    return res.send('[GET] API is up and running...')
})