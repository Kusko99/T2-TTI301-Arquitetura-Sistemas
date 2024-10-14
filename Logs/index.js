const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())

const logs = {}
let id = 1

function getFormattedDateTime() {
    const now = new Date()

    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear()

    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}`
}

app.get('/logs', (req, res) => {
    res.send(logs)
})

app.post('/eventos', (req, res) => {
    try{
        const evento = req.body
        log_evento = `${id},${evento.type},${getFormattedDateTime()}`
        logs[id] = log_evento
        id++
    }
    catch(err){}
    res.status(200).send({msg: 'ok'})
})

app.listen(8000, () => {
    console.log('Logs de eventos. Porta 8000')
})