import express from "express"
import {
    clearCollection,
    employeeLogin,
    employeeSignUp,
    getEmployees,
    insertSeedEmployees
} from "../controllers/employee.js";
import {isAuthorized} from "../middleware/auth.js";
export const employeeRouter = express.Router()

employeeRouter.get('/seed', insertSeedEmployees)

employeeRouter.get('/clear', clearCollection)

employeeRouter.post('/login', employeeLogin)

employeeRouter.post('/signup', employeeSignUp)

employeeRouter.get('/', isAuthorized, getEmployees)
