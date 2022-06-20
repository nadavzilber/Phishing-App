import React, {useState} from 'react'
import templates from '../phishing_template.json'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles.css'


const EmailForm = () => {
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [senderName, setSenderName] = useState('')
    const [senderEmail, setSenderEmail] = useState('')
    const [recipientName, setRecipientName] = useState('')
    const [recipientEmail, setRecipientEmail] = useState('')
    const [subject, setSubject] = useState('')
    const [text, setText] = useState('')
    const [html, setHtml] = useState('')

    const loadTemplate = () => {
        console.log('selected temp:', templates[selectedTemplate])
        const {senderName, senderEmail, recipientName, recipientEmail, subject, text, html} = templates[selectedTemplate]
        setSenderName(senderName)
        setSenderEmail(senderEmail)
        setRecipientName(recipientName)
        setRecipientEmail(recipientEmail)
        setSubject(subject)
        setText(text)
        setHtml(html)
    }

    const validateAndSend = (ev) => {
        console.log('validateAndSend')
        ev.preventDefault()
        if (senderName.trim() && senderEmail.trim() && recipientName.trim() && recipientEmail.trim() &&
            subject.trim() && text.trim() && html.trim()) {
            //todo: call send email api
            //Post req => localhost:8000/email/send
            //Body => {senderName: senderName, senderEmail: senderEmail, recipientName: recipientName, recipientEmail: recipientEmail,
            // subject, text, html}
            // if success- show toast,
            // if not - show toast
            sendPhishingEmail()
        }
    }

    const sendPhishingEmail = async () => {
        console.log('sendPhishingEmail')
        const url = 'http://localhost:8000/email/send'
        const body = {senderName, senderEmail, recipientName, recipientEmail: recipientEmail, subject, text, html}
        try {
            const res = await axios.post(url, body)
            console.log('res:',res)
            if (res?.status === 200 && res.data.success){
                console.log('success!')
                toast.success('Successfully sent phishing email', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (err) {
            console.log('err:',err)
            toast.warn('Failed to send phishing email', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            //showAlert({msg: 'Failed sending phishing email', success: false})
        }
    }

    const onSelectTemplate = (value) => {
        console.log('on select tmp:', value)
        if (value === 'select'){
            setSelectedTemplate(null)
        } else {
            setSelectedTemplate(value)
        }
    }

    return (
            <div className="container">
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover/>
                <h3>Phishing Form</h3>
                <select onChange={(ev) => onSelectTemplate(ev.target.value)} defaultValue={"select"}>
                    <option value="select">Select a template</option>
                    <option value="amazon">Amazon</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                </select>
                <button disabled={!selectedTemplate} onClick={loadTemplate}>Load</button>

                <form className="phishing-form">
                    <div className="form-section">
                        <label htmlFor="lname">Sender Name</label>
                        <input type="text" id="lname" name="lastname" placeholder="Sender name" value={senderName} onChange={(ev) => setSenderName(ev.target.value)}/>

                        <label htmlFor="fname">Sender Email</label>
                        <input type="text" id="fname" name="firstname" placeholder="Sender email" value={senderEmail} onChange={(ev) => setSenderName(ev.target.value)}/>
                    </div>
                    <div className="form-section">
                        <label htmlFor="fname">Recipient Email</label>
                        <input type="text" id="fname" name="firstname" placeholder="Recipient email" value={recipientEmail} onChange={(ev) => setRecipientEmail(ev.target.value)}/>

                        <label htmlFor="lname">Recipient Name</label>
                        <input type="text" id="lname" name="lastname" placeholder="Recipient name" value={recipientName} onChange={(ev) => setRecipientName(ev.target.value)}/>
                    </div>

                    <label htmlFor="lname">Subject</label>
                    <input type="text" id="lname" name="lastname" placeholder="Subject" value={subject} onChange={(ev) => setSubject(ev.target.value)}/>

                    <label htmlFor="subject">Text</label>
                    <textarea id="subject" name="subject" placeholder="Write something.." value={text} onChange={(ev) => setText(ev.target.value)}/>

                    <label htmlFor="subject">HTML</label>
                    <textarea id="subject" name="subject" placeholder="Write something.." value={html} onChange={(ev) => setHtml(ev.target.value)}/>

                    <button onClick={(ev) => validateAndSend(ev)}>Send email</button>
                </form>
            </div>)
}

export default EmailForm;