const express = require("express")
const app = express()
const axios = require('axios')
app.use(express.json())

const baseConsulta = {}

const funcoes = {
    LembreteCriado: (lembrete) =>{
        baseConsulta[lembrete.contador] = lembrete
    },
    ObservacaoCriada: (observacao) => {
        const observacoes =
        baseConsulta[observacao.lembreteId]["observacoes"] || []
        observacoes.push(observacao)
        baseConsulta[observacao.lembreteId]["observacoes"] = observacoes
    },
    ObservacaoAtualizada : (observacao) => {
        const observacoes = 
            baseConsulta[observacao.lembreteId]["observacoes"]
        const indice = observacoes.findIndex((o) => o.id === observacao.id)
        observacoes[indice] = observacao
    }
}

app.get('/lembretes', (req, res) => {
    res.json(baseConsulta)
  })

app.post('/eventos', (req, res) => {
try{
    const evento = req.body
    funcoes[evento.type](evento.payload)  
}
catch(err){}
res.json({msg: 'ok'})
})
  
  
  app.listen(6000, async() => {
    console.log("Consultas. Porta 6000")
    const resp = await axios.get('http://barramento-de-eventos-service:10000/eventos')
    resp.data.forEach((valor,indice, colecao) => {
        try{
            funcoes[valor.type](valor.payload)
        }catch(err) {}
    });
  })
