import express from "express"
export const emailsRouter = express.Router()

emailsRouter.get('/test', async (req, res) => {
    console.log('emails router test 123')
    res.status(200).send({title: 'emails router test 123'})
})
