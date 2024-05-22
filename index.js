const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')

// Preparamos as informações de acesso ao banco de dados
const dbUrl = 'mongodb+srv://admin:fM8kXu2bZqk@cluster0.qn9vegi.mongodb.net'
const dbName = 'mongodb-intro-e-implementacao'

// Declaração da função main()
async function main() {
  // Realizamos a conexão com o banco de dados
  const client = new MongoClient(dbUrl)
  console.log('Conectando ao banco de dados...')
  await client.connect()
  console.log('Banco de dados conectado com sucesso!')

  const db = client.db(dbName)
  const collection = db.collection('personagem')
  const app = express()

  app.get('/', function (req, res) {
    res.send('Hello World!')
  })

  const lista = ['Java', 'Kotlin', 'Android']
  // Implementando Endpoint Read All (irá funcionar com GET)/ neste ponto pensar em qual será a entidade ex.personagem

  // Função para exibir em um único endpoint de Read All toda a lista 
  app.get('/personagem', async function (req, res) {
    // Acessamos a lista de itens na collection mongodb
    const itens = await collection.find().toArray()
    // Função do 'filter.boolean' é para que os espaços quando deletar, não aparecer em vizualização como 'null' 
    res.send(itens)
  })

  // Implementando Endpoint Read By Id [Get](obter informação) /personagem/:id(os dois pontos id funcionam para dizer que é uma especificação direcionada )
  app.get('/personagem/:id', async function (req, res) {
    // função de requisição de parâmetro de rota id
    const id = req.params.id

    // Função para acessar o item na collection usando ID 
    const item = await collection.findOne({ _id: new ObjectId(id) })

    // Função para checar se o item obtido é existente, exibindo uma mensagem caso não esteja
    if (!item) {
      return res.status(404).send('Item não encontrado. ')
    }

    // função para enviar um item como resposta
    res.send(item)
  })

  // Função para sinalizar para o express que está sendo utilizado o Json no body
  app.use(express.json())

  // Implementando Endpoint Creat [POST](criar informação) /personagem
  app.post('/personagem', async function (req, res) {

    // Função para acessar o Body da requisição através do req.body
    const novoItem = req.body

    // Função para checar se o 'nome' está no body, e não foi modificado
    if (!novoItem || !novoItem.nome) {
      return res.status(400).send('Corpo da requisição deve conter a propriedade `nome`.')
    }
    // Função para checar se o novoItem está na lista ou não, e para que não duplique 
    // if (lista.includes(novoItem)) {
    //   return res.status(409).send('Este item já existe na lista.')
    // }

    // Adicionar na collection
    await collection.insertOne(novoItem)
    // Função para exibir uma mensagem de sucesso
    res.status(201).send(novoItem)
  })

  // Implementando Endpoint Update [PUT](atualizar informação completa) /personagem/:id
  app.put('/personagem/:id', async function (req, res) {

    // Acessando o ID dos parâmetros de rota
    const id = req.params.id

    // Função para checar se o item do ID - 1 está na lista, exibindo uma mensagem caso não esteja
    // if (!lista[id - 1]) {
    //   return res.status(404).send('Item não encontrado. ')
    // }

    // Função para acessar o Body da requisiçao
    const novoItem = req.body

   
    // Função para checar se o 'nome' está no body e não foi modificado.
    if ( !novoItem || !novoItem.nome) {
      return res.status(400).send('Corpo da requisição deve conter a propriedade `nome`.')
    }
    // Função para checar se o novoItem está na lista ou não, e para que não duplique 
    // if (lista.includes(novoItem)) {
    //   return res.status(409).send('Este item já existe na lista.')
    // }

    // Função para atualizar na collection novoItem pelo ID 
      await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: novoItem }
    )
    // Função para exibir a mensagem de sucesso
    res.send(novoItem)
  })

  // Implementação do Endpoint Delete [DELETE] /personagem/:id
  app.delete('/personagem/:id', async function (req, res) {

    // Funçãp para acessar o parâmetro de rota
    const id = req.params.id

    // Função para checar se o item do ID - 1 está na lista, exibindo uma mensagem caso não esteja
    // if (!lista[id - 1]) {
    //   return res.status(404).send('Item não encontrado. ')
    // }

    // remover o item da collection usando o ID 
    await collection.deleteOne({ _id: new ObjectId(id) })
    //Enviamos uma mensagem de sucesso
    res.send('Item removido con sucesso: ' + id)
  })


  app.listen(3000)
}

// Executamos a função main()
main() 