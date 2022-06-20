import React, {useState} from 'react'
import axios from "axios";

const EmailList = () => {
    const [emails, setEmails] = useState([])

    const getEmails = async () => {
        const url = 'http://localhost:8000/email/'
        const headers = { headers: {"Authorization" : window.sessionStorage.getItem('authToken')} }
        const res = await axios.get(url, headers)
        if (res?.status === 200 && res.data.emails) {
            setEmails(res.data.emails)
        } else {
            setEmails([])
        }
    }

    return (
        <div>
            <button onClick={getEmails}>Get emails</button>
            {emails && emails.map((email, idx) => (<li key={`phishing_email_${idx}`}>
                <div>Name: {email.name}</div>
                <div>Email: {email.email}</div>
                <div>Status: {email.status}</div>
            </li>))}
        </div>
    )
}

export default EmailList