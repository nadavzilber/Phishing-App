import React, {useState} from 'react'
import {toast, ToastContainer} from "react-toastify";
import axios from "axios";

const AuthForm = ({setIsAuth}) => {
    const [formType, setFormType] = useState('Login')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')

    const capitalize = (string) => {
        return string?.charAt(0).toUpperCase() + string?.slice(1);
    }

    const validateAndAuth = async (ev) => {
        try {
            ev.preventDefault()
            if ((!password.trim() && !email.trim()) || (formType === 'signup' && !name.trim())) {
                toast.warn(`Please fill out all required fields for ${formType}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return
            }
            const body = {password, email, name}
            const url = `http://localhost:8000/employee/${formType}`
            const res = await axios.post(url, body)
            if (res?.status === 200 && res.data.success){
                console.log('Successful',formType)
                window.sessionStorage.setItem('authToken', res.data['authorization'])
                toast.success(`Successful ${formType}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(()=> setIsAuth(true), 2000)
            } else {
                throw new Error(`Failed ${formType}`)
            }
        } catch (error) {
            console.log(formType,'error:',error)
            toast.warn(`Unsuccessful ${formType}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

     return (<div className="container">
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
         <h3>{capitalize(formType)} Form</h3>
         <select onChange={(ev) => setFormType(ev.target.value)} defaultValue={"login"}>
             <option value="login">Login</option>
             <option value="signup">Signup</option>
         </select>

         <form className="phishing-form">
             {formType === 'signup' &&
                 <>
                 <label htmlFor="name">Name</label>
                 <input type="text" id="name" name="name" placeholder="Name" value={name} onChange={(ev) => setName(ev.target.value)}/>
                </>}
                 <label htmlFor="email">Email</label>
                 <input type="email" id="email" name="email" placeholder="Email" value={email} onChange={(ev) => setEmail(ev.target.value)}/>
                 <label htmlFor="password">Password</label>
                 <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={(ev) => setPassword(ev.target.value)}/>

             <button onClick={(ev) => validateAndAuth(ev)}>{capitalize(formType)}</button>
         </form>
     </div>)
}

export default AuthForm
