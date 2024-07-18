import { Navigate, Link, Outlet } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import {useStateContext} from "../contexts/contextProvider.jsx";
import axiosClient from '../axios-client.js';
import { useNavigate } from 'react-router-dom';


export default function Login(){
    const emailRef = useRef();
    const passwordRef = useRef();
    const[errors, setErrors] = useState(null);
    const {setUser, setToken} = useStateContext(); 
    const navigate = useNavigate(); // Import useNavigate from react-router-dom


    const onSubmit = (ev) => {
        ev.preventDefault(); 
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }
        setErrors()
        axiosClient.post('/login',payload)
        .then(({ data }) => {
            setUser(data.user);
            setToken(data.token);
            navigate('/'); // Use useNavigate to navigate to '/'

            console.log(setUser(data.user));
        })
        .catch(err => {
            const response =err.response;
            if(response && response.status === 422){
                if(response.data.errors){
                    setErrors(response.data.errors)
                }else{
                    setErrors({
                        email:[response.data.message]
                    })
                }
            }
        })
    }

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Login into your account</h1>
                    {
                        errors && <div className="alert">
                            {
                                Object.keys(errors).map(key=>(
                                    <p key={key}>{errors[key][0]}</p>
                                ))
                            }
                        </div>
                    }
                    <input ref={emailRef} type="email" placeholder="Email"/>
                    <input ref={passwordRef} type="password" placeholder="Password"/>
                    <button className="btn btn-block">Login</button>
                    <p>
                        Not Registered? <Link to="/signup">Create account</Link>
                    </p>
                </form>
            </div>
        
        </div>
    )
}