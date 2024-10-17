const express = require ('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')

const observacoesPorLembreteId = {}

const funcoes = {
    ObservacaoClassificada: (observacao) => {
        const observacoes = 
            observacoesPorLembreteId[observacao.lembreteId]
        const obsParaAtualizar = observacoes.find(o => o.id === observacao.id)
        obsParaAtualizar.status = observacao.status
        axios.post('http://barramento-de-eventos-service:10000/eventos', {
            type: 'ObservacaoAtualizada',
            payload: {
                id: observacao.id,
                texto : observacao.texto,
                lembreteId : observacao.lembreteId,
                status: observacao.status
            }
        })
    }
}

const app = express()
app.use(bodyParser.json())

app.put('/lembretes/:id/observacoes', async (req,res) =>{
    const idObs = uuidv4()
    const { texto } = req.body
    if (!texto) {
        return res.status(400).send({ error: 'Texto é necessário' });
    }
    const observacoesDoLembrete =
        observacoesPorLembreteId[req.params.id] || []
    observacoesDoLembrete.push({ id: idObs, texto, status: 'aguardando' })
    observacoesPorLembreteId[req.params.id] =
        observacoesDoLembrete;
        await axios.post('http://barramento-de-eventos-service:10000/eventos', {
            type: 'ObservacaoCriada',
            payload: {
              id: idObs,
              texto,
              lembreteId: req.params.id,
              status: 'aguardando'
            }
          })
    res.status(201).send(observacoesDoLembrete)
})

app.get('/lembretes/:id/observacoes', (req,res) => {
    res.send(observacoesPorLembreteId[req.params.id] || [ ])
})

app.post("/eventos", (req,res) => {
    console.log(req.body)
    try{
        funcoes[req.body.type](req.body.payload)
    }
    catch (err) {}
    res.status(200).send({msg:"ok"})
})

app.listen(5000, (() => {
    console.log('Lembretes. Porta 5000')
}))