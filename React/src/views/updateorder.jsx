import { useCart } from "../contexts/cartContext"
import { useStateContext } from "../contexts/contextProvider.jsx"
import { Navigate,useNavigate,useParams, Link, Outlet } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axiosClient from "../axios-client.js";

export default function UpdateOrder(){
    const {user, token, setUser, setToken} = useStateContext();
    const {id} = useParams()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState({
        status:'',

      });
    if(!token) {
        return <Navigate to= "/login"/>
    }


    const onSubmit = (ev) => {
        ev.preventDefault();
        const formData = new FormData();

        formData.append('status', order.status);
    

         axiosClient
            .post(`/orders/${id}?_method=PUT`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            })


            .then(() => {
                console.log(formData);
                navigate('/admin/orders');

                setNotification('Order was successfully updated')
    


            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
        };
    return (
        <div className="container my-5 checkout">
            <div className="row card">
                <h3>Update order status</h3>
                <form onSubmit={onSubmit}>
                    <select value={order.status} onChange={ev => setOrder({...order, status: ev.target.value})} className="mb-3 form-control">
                        <option value="default">Update order status</option>
                        <option value="on transit">On transit</option>
                        <option value="delivered">Delivered</option>
                    </select>

                    <button className="btn-add">Update</button>
                </form>



            </div>

            {/* Add more checkout details or forms here */}        
        </div>
    )
}