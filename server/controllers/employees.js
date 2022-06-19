import {compare} from 'bcrypt'
import jwt from 'jsonwebtoken'
import {employeeModel} from "../models/employees.js";

const insertSeedEmployees = async (req, res) => {
    const employees = [
        {name: 'Nadav', email: 'nadav@test.com', password: '111'},
        {name: 'Eran', email: 'eran@test.com', password: '222'},
        {name: 'David', email: 'david@test.com', password: '333'},
        {name: 'Michael', email: 'michael@test.com', password: '444'},
    ]
    await insertEmployees(req, res, employees)
}

const clearCollection = async (req, res) => {
    try {
        await employeeModel.deleteMany({})
        console.log('Successfully cleared employees collection')
        res.status(200)
    }
    catch (err) {
        console.log(`Failed to clear employees collection - ${err}`)
        res.status(400).json({error: err})
    }

}

const employeeLogin = async (req, res) => {
    try {
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(400).json({error: 'Please enter valid email and password'})
        }
        const employee = await employeeModel.findOne({email}).lean()
        // todo: verify right status code
        if (!employee) return res.status(400).json({error: 'Employee not found'})
        const comparisonResult = await compare(password, employee.password)
        if (comparisonResult) {
            //Sign JWT
            return res.status(200).json({
                data: jwt.sign({
                    id: user_id,
                    name: employee.name
                }, process.env.JWT)})
        }
        // TODO: check right status code for rejection
        return res.status(400).json({error: 'Bad credentials'})
    } catch (err) {
        return res.status(400).json({error: 'Something went wrong'})
    }
}

const getEmployees = async (req, res) => {
    try {
        const employees = await employeeModel.find({})
        if (employees) return res.status(200).json({data: employees})
    } catch (err) {
        return res.status(400).json({error: 'Failed fetching all employees'})
    }
}

const insertEmployees = async (req, res, employees) => {
    try {
        await employeeModel.insertMany(employees)
        console.log('Inserted employees to DB successfully!')
        res.status(200)
    } catch (err) {
        console.log(`insertEmployees failed - ${err}`)
        return res.status(400).json({error: 'Failed inserting employees'})
    }
}

const getEmployee = async (req, res, employee) => {
    try {
        return await employeeModel.findOne(employee)
        res.status(200)
    } catch (err) {
        console.log(`getEmployee failed - ${err}`)
        return res.status(400).json({error: 'Failed fetching employee'})
    }
}

export {insertSeedEmployees, clearCollection, employeeLogin, getEmployees, insertEmployees, getEmployee}