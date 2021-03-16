const express = require('express')
const cors = require('cors')
require('dotenv').config()

const connectDB = require('./db/connectDB')

connectDB()

const app = express()

app.use(express.json())

app.use(cors())

app.use('/api/notes', require('./api/routes/notes'))
app.use('/api/categories', require('./api/routes/categories'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))