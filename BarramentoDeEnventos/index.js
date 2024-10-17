const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())

const eventos = []

const postEvent = async (url, evento) =>{
    try{
        await axios.post(url, evento)
    }catch (err){
        console.log(`Erro: ${err.message} to url: ${url}`)
    }
}

app.post('/eventos', (req, res) => {
    const evento = req.body 
    eventos.push(evento)
    //lembretes 
    postEvent('http://lembretes-clusterip-service:4000/eventos', evento)
    //observações
    postEvent('http://observacoes-clusterip-service:5000/eventos', evento)
    //consulta
    postEvent('http://consulta-clusterip-service:6000/eventos', evento)
    //classificação
    postEvent('http://classificacao-clusterip-service:7000/eventos', evento)
    //logs
    postEvent('http://logs-clusterip-service:8000/eventos', evento)
    res.status(200).json({mensagem: 'ok'})
})

app.get('/eventos', (req,res) => {
    res.send(eventos)
})

app.listen(10000, () => {
    console.log('Barramento de eventos. Porta 10000')
})