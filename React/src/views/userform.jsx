import {useEffect,useRef, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client.js";

export default function UserForm(){
    const {id} = useParams()
    const navigate = useNavigate();
    const nameRef = useRef();
    const emailRef = useRef();
    const roleRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();
    const shopNameRef = useRef();
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const onSubmit = (ev) => {
        ev.preventDefault(); 
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            shop_name: shopNameRef.current.value,
            role: roleRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value,
        }
        axiosClient.post('/admin/users',payload)
            .then(({data})=>{
                navigate('/admin/dashboard')
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
            <h2>New User</h2>
            {loading && <div className="text-center">Loading...</div>}
            {errors && (
              <div className="alert">
                {Object.keys(errors).map((key) => (
                  <p key={key}>{errors[key][0]}</p>
                ))}
              </div>
            )}
            {!loading && (

            <form onSubmit={onSubmit} encType="multipart/form-data">
            
                <input
                ref={nameRef} 
                placeholder="Enter user name"
                className="form-control mb-3"
                ></input>
                <input
                ref={shopNameRef}
                placeholder="Enter shop name"
                className="form-control mb-3"
                ></input>
                <input
                onChange={(ev) => setUser({ ...user, email: ev.target.value })}
                ref={emailRef}
                placeholder="Enter email"
                type="email"
                className="form-control mb-3"
                ></input>
                <input
                ref={passwordRef}
                type="password"
                placeholder="Enter password"
                className="form-control mb-3"
                ></input>
                <input ref={passwordConfirmationRef} type="password" className="form-control mb-3" placeholder="Password confirmation"/>

                <select ref={roleRef} className="mb-3 form-control">
                    <option value="default">Choose role</option>
                    <option value="super-admin">Super admin</option>
                    <option value="admin">admin</option>
                </select>
                <button className="btn-add">Submit</button>
            </form>

            )}
        </div>
    )
}