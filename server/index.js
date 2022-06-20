import express from 'express'
import mongoose from 'mongoose'
import {config} from './config.js'
import cors from 'cors'
import bodyParser from 'body-parser'
import {employeeRouter} from './routes/employee.js'
import {emailRouter} from './routes/email.js'
import {initMailer} from "./controllers/email.js";

const app = express()
const port = process.env.PORT || config.PORT
const connectionUrl = `mongodb+srv://${config.DB_USER}:${config.DB_PASSWORD}@cluster0.rjybf.mongodb.net/?retryWrites=true&w=majority`;

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/employee', employeeRouter)
app.use('/email', emailRouter)

//app.use('/', ()=> console.log('HOME'))

const init = async () => {
    await initServer()
    await initDb()
    await initMailer()
}

const initServer = async () => {
    try {
        await app.listen(port)
        console.log(`Server is running on port ${port}`)
    } catch (error) {
        // todo: add retry mechanism
        console.log(`Server failed to run on port ${port} - ${error}`)
    }
}

const initDb = async () => {
    try {
        await mongoose.connect(connectionUrl, {useNewUrlParser: true})
        console.log('Successfully connected to DB')
    } catch (error) {
        // todo: add retry mechanism
        console.log(`Failed connecting to DB - ${error}`)
    }
}

init().then(() => console.log('Ready.............'))

