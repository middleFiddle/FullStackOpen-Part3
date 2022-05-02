const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('post_body', (request, response) => {
  return JSON.stringify(request.body)
})

app.use(express.json())
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :post_body',
  ),
)

let directory = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.set('json spaces', 2)

app.get('/api/directory', (request, response) => {
  response.json(directory)
})

app.get('/info', (request, response) => {
  const totalContacts = directory.length
  const date = new Date()
  response.send(
    `<p>Phonebook has info for ${totalContacts} contacts</p> <p>${date}</p>`,
  )
})

app.get('/api/directory/:id', (request, response) => {
  const id = Number(request.params.id)
  const contact = directory.find((contact) => contact.id === id)

  if (contact) {
    response.json(contact)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/directory/:id', (request, response) => {
  const id = Number(request.params.id)
  directory = directory.filter((contact) => contact.id !== id)
  response.status(204).end()
})

const createId = () => {
  return Math.floor(Math.random() * 1000)
}

app.post('/api/directory', (request, response) => {
  const body = request.body
  const name = directory.find((c) => c.name === body.name)

  if (name) {
    return response.status(400).json({
      error: 'New contacts must have unique names',
    })
  }

  if (!body.name) {
    return response.status(400).json({
      error: 'Name missing',
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'Number missing',
    })
  }

  const contact = {
    id: createId(),
    name: body.name,
    number: body.number,
  }
  directory = directory.concat(contact)
  response.json(contact)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
