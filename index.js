const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('request', function (req, res) {
    return JSON.stringify(req.body)
})

const app = express()
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request'))
app.use(cors())
app.use(express.static('dist'))

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    console.log('in post handler')
    const person = request.body
    if (!person.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }
    if (!person.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }
    const dup = persons.find(p => p.name === person.name)
    if (dup) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const personId = getRandomInt(10000)
    person.id = String(personId)
    persons = persons.concat(person)
    response.json(person)
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people<br/>${new Date()}`)
})

const PORT = process.env.PORT || 3001
console.log('process.env.PORT', process.env.PORT)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
