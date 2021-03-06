import {hash, compare} from 'bcrypt'
import jwt from 'jsonwebtoken'
import {employeeModel} from "../models/employee.js";
import {config} from '../config.js'

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
        res.status(200).send()
    }
    catch (error) {
        res.status(400).json({error})
    }
}

const employeeSignUp = async (req, res) => {
    try {
        const {name, email, password} = req.body
        if (!name || !email || !password)
            return res.status(400).json({error: 'Please enter a valid name, email and password'})
        const existingEmployee = await employeeModel.findOne({email})
        if (existingEmployee)
            return res.status(400).json({error: 'This email is already associated with another employee account'})
        const hashedPassword = await hash(password, config.SALT)
        const credentials = {name, email, password: hashedPassword}
        await employeeModel.create(credentials)
        res.setHeader('Authorization', `Bearer ${generateToken( {email})}`)
        return res.status(200).json({success: true, authorization: `Bearer ${generateToken( {email})}`})
    } catch (error) {
        return res.status(400).json({error})
    }
}

const employeeLogin = async (req, res) => {
    try {
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(400).json({error: 'Please enter a valid email and password'})
        }
        const employee = await employeeModel.findOne({email}).lean()
        if (!employee)
            return res.status(400).json({error: 'Employee not found'})
        const comparisonResult = await compare(password, employee.password)
        if (comparisonResult) {
            res.setHeader('Authorization', `Bearer ${generateToken(employee)}`)
            return res.status(200).json({success: true, authorization: `Bearer ${generateToken(employee)}`})
        }
        return res.status(400).json({error: 'Bad credentials'})
    } catch (error) {
        return res.status(400).json({error: 'Something went wrong'})
    }
}

const generateToken = (employee) => {
    try {
        //TODO: find out how to add config.SALT as arg
        const signed = jwt.sign({data: employee.email}, config.JWT_SECRET_KEY, { expiresIn: config.JWT_EXPIRATION });
        return signed
    } catch (error) {
        console.log('Generate token error:', error)
        return
    }
}

const getEmployees = async (req, res) => {
    try {
        const employees = await employeeModel.find({})
        if (employees) return res.status(200).json({data: employees})
    } catch (error) {
        return res.status(400).json({error: 'Failed fetching all employees'})
    }
}

const insertEmployees = async (req, res, employees) => {
    try {
        await employeeModel.insertMany(employees)
        res.status(200).json({employees})
    } catch (error) {
        return res.status(400).json({error: 'Failed inserting employees'})
    }
}

const getEmployee = async (email) => {
    try {
        return await employeeModel.findOne({email})
    } catch (error) {
        console.log(`getEmployee failed - ${error}`)
        return
    }
}

export {insertSeedEmployees, clearCollection, employeeSignUp, employeeLogin, getEmployees, insertEmployees, getEmployee}