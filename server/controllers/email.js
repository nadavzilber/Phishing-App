import {emailModel} from "../models/email.js";
import nodeMailer from 'nodemailer';
import {getEmployee} from "./employee.js";
const CLICKED = 'clicked'
const NOT_CLICKED = 'not clicked'

let mailerAccount, transporter

const initMailer = async () => {
    try {
        mailerAccount = await nodeMailer.createTestAccount();
        transporter = nodeMailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: mailerAccount.user,
                pass: mailerAccount.pass,
            },
        });
        console.log('Successfully initialized Node Mailer')
    } catch (error) {
        console.log(`Failed to initialize Node Mailer - ${error}`)
    }
}

const insertSeedEmails = async (req, res) => {
    const emails = [
        {name: 'Nadav', email: 'nadav@test.com', status: NOT_CLICKED},
        {name: 'Eran', email: 'eran@test.com', status: NOT_CLICKED},
        {name: 'David', email: 'david@test.com', status: CLICKED},
        {name: 'Michael', email: 'michael@test.com', status: CLICKED},
    ]
    try {
        await emailModel.insertMany(emails)
        console.log('Inserted emails to DB successfully!')
        return res.status(200).json({emails})
    } catch (error) {
        return res.status(400).json({error: 'Failed inserting emails'})
    }
}

const clearCollection = async (req, res) => {
    try {
        await emailModel.deleteMany({})
        res.status(200).send()
    } catch (error) {
        res.status(400).json({error})
    }
}

const sendPhishingEmail = async (req, res) => {
    try {
        const {recipientName, recipientEmail, senderName, senderEmail, subject, text, html} = req.body
        let info = await transporter.sendMail({
            from: `${senderName} ${senderEmail}`,
            to: recipientEmail,
            subject,
            text,
            html
        });
        const previewLink = nodeMailer.getTestMessageUrl(info)
        console.log("Preview URL:", previewLink);
        await updateEmailList(recipientEmail, recipientName)
        return res.status(200).json({success: true, preview: previewLink})
    } catch (error) {
        return res.status(400).json({error})
    }
}


const updateEmailList = async (emailAddress, employeeName) => {
    try {
        const employee = await getEmployee(emailAddress)
        //TODO: can we add emails to non-existent employees
        const newEmail = {name: employee?.name || employeeName, email: emailAddress, status: NOT_CLICKED}
        await emailModel.create(newEmail)
    } catch (error) {
        //TODO: retry mechanism
        console.log('Failed updating the phishing email list', error)
    }
}

const phishingLinkClicked = async (req, res) => {
    try {
        const email = req.query.email
        await emailModel.findOneAndUpdate({email}, {status: CLICKED})
        return res.send()
    } catch (error) {
        return res.send()
    }
}

const getPhishingEmails = async (req, res) => {
    try {
        const emails = await emailModel.find({})
        return res.status(200).json({emails})
    } catch (error) {
        return res.status(400).json({error})
    }
}

export {initMailer, insertSeedEmails, clearCollection, sendPhishingEmail, getPhishingEmails, phishingLinkClicked}