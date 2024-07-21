import {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client.js";

export default function UserUpdate(){
    const {id} = useParams()
    const navigate = useNavigate();

    const [user, setUser] = useState({
        id: null,
        name: "",
        shop_name: "",
        email: "",
        role: "",
        password: "",
        password_confirmation: ""
      });
      const [errors, setErrors] = useState(null);
      const [loading, setLoading] = useState(false);

        useEffect(()=>{
            setLoading(true)
            axiosClient.get(`/users/${id}`)
                .then(({data})=>{
                    setLoading(false)
                    setUser(data.data)
                    console.log(data.data)
                })
                .catch(()=>{
                    setLoading(false)
                })
        },[])


    
    
    
      const onSubmit = (ev) => {
        ev.preventDefault();
        const formData = new FormData();

        formData.append('name', user.name);
        formData.append('shop_name', user.shop_name);
        formData.append('email', user.email);
        formData.append('role', user.roles);

        if(user.password){
            formData.append('password', user.password);
            formData.append('password_confirmation', user.password_confirmation);

        }

  
        axiosClient
            .post(`/admin/users/${user.id}?_method=PUT`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            })
 
 
            .then(() => {
                console.log(formData);
                navigate('/admin/dashboard');
                setNotification('User was successfully updated')
           
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };
    return (
        <div>
            <h2> Update user: {user.name}</h2>
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
                onChange={(ev) => setUser({ ...user, name: ev.target.value })}
                value={user.name}
                placeholder="Enter user name"
                className="form-control mb-3"
                ></input>
                <input
                onChange={(ev) => setUser({ ...user, shop_name: ev.target.value })}
                value={user.shop_name}

                placeholder="Enter shop name"
                className="form-control mb-3"
                ></input>
                <input
                onChange={(ev) => setUser({ ...user, email: ev.target.value })}
                value={user.email}

                placeholder="Enter email"
                type="email"
                className="form-control mb-3"
                ></input>
                <input
                onChange={(ev) => setUser({ ...user, password: ev.target.value })}
                type="password"
                value={user.password}
                placeholder="Enter password (leave blank if you dont want to change password)"
                className="form-control mb-3"
                ></input>
                <input
                onChange={(ev) => setUser({ ...user, password_confirmation: ev.target.value })}
                type="password"
                placeholder="Enter password again (leave blank if you dont want to change password)"
                className="form-control mb-3"
                ></input>
                <select value={user.roles} onChange={(ev) => setUser({ ...user, role: ev.target.value })} className="mb-3 form-control">
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