import express from "express"
export const employeesRouter = express.Router()

employeesRouter.get('/test', async (req, res) => {
    console.log('employees router test 123')
    res.status(200).send({title: 'employees router test 123'})
})
