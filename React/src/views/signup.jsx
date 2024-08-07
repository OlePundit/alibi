import { useNavigate, Navigate, Link, Outlet } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import axiosClient from '../axios-client.js';
import {useStateContext} from "../contexts/contextProvider.jsx";


export default function Signup(){
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();
    const[errors, setErrors] = useState(null);
    const {setUser, setToken} = useStateContext(); 
    const navigate = useNavigate(); // Import useNavigate from react-router-dom

    const onSubmit = (ev) => {
        ev.preventDefault(); 
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value,
        }
        axiosClient.post('/signup',payload)
            .then(({data})=>{
                setUser(data.user)
                setToken(data.token)
                navigate('/'); // Use useNavigate to navigate to '/'
            })
            .catch(err => {
                const response =err.response;
                if(response && response.status === 422){
                    console.log(response.data.errors);
                    setErrors(response.data.errors)
                }
            })
    }
    return (
        <div>
            <div className="login-signup-form animated fadeInDown">
                <div className="form">
                    <form onSubmit={onSubmit}>
                        <h1 className="title">Signup for free</h1>
                        {
                            errors && <div className="alert">
                                {
                                    Object.keys(errors).map(key=>(
                                        <p key={key}>{errors[key][0]}</p>
                                    ))
                                }
                            </div>
                        }
                        <input className="form-control mb-3" ref={nameRef} type="text" placeholder="Full Name"/>                        
                        <input className="form-control mb-3" ref={emailRef} type="email" placeholder="Email Address"/>
                        <input className="form-control mb-3" ref={passwordRef} type="password" placeholder="Password"/>
                        <input className="form-control mb-3" ref={passwordConfirmationRef} type="password" placeholder="Password confirmation"/>

                        <button className="btn-add mb-3">Signup</button>
                        <p>
                            Already Registered? <Link to="/login">Sign in</Link>
                        </p>
                    </form>
                </div>
            
            </div>
        
        </div>
    )
}