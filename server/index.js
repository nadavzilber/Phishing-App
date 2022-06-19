import express from 'express'
import mongoose from 'mongoose'
import {config} from './config.js'
import bodyParser from 'body-parser'
import {employeesRouter} from './routes/employees.js'
import {emailsRouter} from './routes/emails.js'

const app = express()
const port = process.env.PORT || config.PORT
const connectionUrl = `mongodb+srv://${config.DB_USER}:${config.DB_PASSWORD}@cluster0.rjybf.mongodb.net/?retryWrites=true&w=majority`;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/employees', employeesRouter)
app.use('/emails', emailsRouter)

app.use('/', ()=> console.log('HOME'))
const init = async () => {

    await initServer()
    await initDb()
}
const initServer = async () => {

    try {
        await app.listen(port)
        console.log(`Server is running on port ${port}`)
    } catch (err) {
        // todo: add retry mechanism
        console.log(`Server failed to run on port ${port} - ${err}`)
    }
}
const initDb = async () => {

    try {
        await mongoose.connect(connectionUrl, {useNewUrlParser: true})
        console.log('Successfully connected to DB')
        // todo: seed data
    } catch (err) {
        // todo: add retry mechanism
        console.log(`Failed connecting to DB - ${err}`)
    }
}
init().then(() => console.log('Ready...'))

