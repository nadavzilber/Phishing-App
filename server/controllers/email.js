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
        console.log(`insertEmails failed - ${error}`)
        return res.status(400).json({error: 'Failed inserting emails'})
    }
}

const clearCollection = async (req, res) => {
    try {
        await emailModel.deleteMany({})
        console.log('Successfully cleared email collection')
        res.status(200).send()
    } catch (error) {
        console.log(`Failed to clear email collection - ${error}`)
        res.status(400).json({error})
    }
}

const sendPhishingEmail = async (req, res) => {
    try {
        //senderEmail = microsoft, ebay, fb, amazon support
        //subject = reset your password / your order is on its way / track your order / order was returned
        const {recipientEmail, senderName, senderEmail, subject, text, html} = req.body
        let info = await transporter.sendMail({
            from: `${senderName} ${senderEmail}`,
            to: recipientEmail,
            subject,
            text,
            html
        });
        console.log("Email sent: %s", info.messageId);
        console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
        await updateEmailList(recipientEmail)
        console.log('returning')
        return res.status(200).json({success: true})
    } catch (error) {
        console.log('send email error -',error)
        return res.status(400).json({error})
    }
}

const updateEmailList = async (emailAddress) => {
    try {
        console.log('updateEmailList email:', emailAddress)
        const employee = await getEmployee(emailAddress)
        if (!employee) {
            console.log('no emp:', employee)
            return //TODO: how should this be handled? is this an error?
        }
        const newEmail = {name: employee.name, email: emailAddress, status: NOT_CLICKED}
        const updatedEmail = await emailModel.findOneAndUpdate(newEmail)
        if (!updatedEmail){
            console.log('creating new mail obj in collection')
            await emailModel.create(newEmail)
        }
    } catch (error) {
        //TODO: retry mechanism
        console.log('Failed updating the phishing email list', error)
    }
}

const phishingLinkClicked = async (req, res) => {
    try {
        const email = req.query.email
        await emailModel.findOneAndUpdate({email}, {status: CLICKED})
        console.log('link clicked, status was changed. email:', email)
        return res.send()
    } catch (error) {
        console.log('link clicked, status did not change')
        return res.send()
    }
}

const getPhishingEmails = async (req, res) => {
    try {
        const emails = await emailModel.find({})
        return res.status(200).json({emails})
    } catch (error) {
        //TODO: return bad resp (400?)
        console.log('get emails error - ', error)
        return res.status(400).json({error})
    }
}

export {initMailer, insertSeedEmails, clearCollection, sendPhishingEmail, getPhishingEmails, phishingLinkClicked}