import express from "express"
import {clearCollection, employeeLogin, getEmployees, insertSeedEmployees} from "../controllers/employees.js";
export const employeesRouter = express.Router()

employeesRouter.get('/test', async (req, res) => {
    console.log('employees router test 123')
    res.status(200).send({title: 'employees router test 123'})
})

employeesRouter.get('/create-seed', insertSeedEmployees)

employeesRouter.get('/clear-employees', clearCollection)

employeesRouter.post('/login', employeeLogin)

employeesRouter.get('/', getEmployees)
