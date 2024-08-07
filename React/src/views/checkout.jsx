import { useCart } from "../contexts/cartContext"
import { useStateContext } from "../contexts/contextProvider.jsx"
import { Navigate,useNavigate, Link, Outlet } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axiosClient from "../axios-client.js";

export default function Checkout(){
    const { cart, clearCart } = useCart();
    const {user, token, setUser, setToken} = useStateContext();
    const navigate = useNavigate();
    const [imageSrc, setImageSrc] = useState({}); // Use an object to store image URLs for each item
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState({
        phone: "",
        name: "",
        phone: "",
        location: "",
        landmark: "",
        cash:"",
        airtel:"",
        momo:"",
        credit:"",
        instructions:"",
        status:'pending',
        product_id:[]

      });
    if(!token) {
        return <Navigate to= "/login"/>
    }
    const calculateSubtotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };
    useEffect(() => {
        cart.forEach(item => {
            showImage(item);
        });
    }, [cart]);
    const subtotal = calculateSubtotal();

    const removeUploadsPrefix = (fileName) => {
        return fileName.replace(/^uploads\//, '');
    };

    const showImage = async (item) => {
        try {
            setLoading(true);
            if (item && item.image) {
                const image = removeUploadsPrefix(item.image);
                const response = await axiosClient.get(`/images/${image}`, {
                    responseType: 'blob',
                });
                const imageUrl = URL.createObjectURL(response.data);
                setImageSrc(prevState => ({ ...prevState, [item.id]: imageUrl }));
                if (response.status !== 200) {
                    throw new Error(`Failed to display image: ${response.status} ${response.statusText}`);
                }
            }
        } catch (error) {
            console.error('Error displaying file:', error);
            setErrors('Failed to display image');
        } finally {
            setLoading(false);
        }
    }
    const onSubmit = (ev) => {
        ev.preventDefault();
        const formData = new FormData();

        formData.append('name', order.name);
        formData.append('user_id', order.user_id);
        formData.append('phone', order.phone);
        formData.append('location', order.location);
        formData.append('landmark', order.landmark);
        formData.append('cash', order.cash);
        formData.append('airtel', order.airtel);
        formData.append('momo', order.momo);
        formData.append('credit', order.credit);
        formData.append('instructions', order.instructions);
        formData.append('status', 'pending');

        // Append all product IDs
        const productIds = cart.map(item => item.id);
        formData.append('product_id', JSON.stringify(productIds));
    

         axiosClient
            .post('/orders', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            })


            .then(() => {
                console.log(formData);
                clearCart(); // Clear the cart after successful checkout
                navigate('/products');

                setNotification('Product was successfully created')
    


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
            <h2>Checkout</h2>
            <div className="row card">
                <h3>Order details</h3>

                <ul>
                    {cart.map(item => (
                        <li key={item.id} className="d-flex">
                            <div className="d-flex">
                                <img src={imageSrc[item.id] || ''} alt={item.name} width="50" height="50" />
                                <div>
                                    <h4>{item.name}</h4>
                                    <p>{item.quantity} x UGX {item.price}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <h3>Order Summary</h3>
                <p>Subtotal: <strong>UGX {subtotal.toFixed(2)}</strong></p>
                <p>Delivery cost: <strong>UGX 0</strong></p>
            </div>
            <div className="row card">
                <h3>Delivery details</h3>
                <form onSubmit={onSubmit}>
           
                    <div className="row mb-5">
                        <div className="col-lg-4 mb-3">
                            <h5>Name</h5>
                            <input type="text" value={user.name} onChange={(ev) => setOrder({ ...order, name: ev.target.value })}className="form-control" placeholder="Enter your name" required></input>
                        </div>
                        <div className="col-lg-4 mb-3">
                            <h5>Email</h5>

                            <input type="email" value={user.email} onChange={(ev) => setOrder({ ...order, email: ev.target.value })}className="form-control" placeholder="Enter your email" required></input>
                        </div>
                        <div className="col-lg-4 mb-3">
                            <h5>Phone</h5>

                            <input type="tel" onChange={(ev) => setOrder({ ...order, phone: ev.target.value })}className="form-control" placeholder="Enter your phone number" required></input>
                        </div>
                    </div>
                    <div className="row mb-5">
                        <div className="col-lg-6 mb-3">
                            <h5>Deliver locaton</h5>

                            <input type="text" onChange={(ev) => setOrder({ ...order, location: ev.target.value })}className="form-control" placeholder="Enter your delivery location" required></input>
                        </div>
                        <div className="col-lg-6 mb-3">
                            <h5>Road | Building | Landmark</h5>

                            <input type="text" onChange={(ev) => setOrder({ ...order, landmark: ev.target.value })}className="form-control" placeholder="Road | Building | Landmark" required></input>
                        </div>        
                    </div>
                    <div className="row mb-5">

            
                        <h5>Payment method</h5>
                        <div className="row align-items-center">
                            <div className="d-flex col-lg-2 col-md-4 col-sm-4 radio-wrap"><input type="radio" onChange={(ev) => setOrder({ ...order, cash: ev.target.value })} required></input><label>Cash</label></div>
                            <div className="d-flex col-lg-2 col-md-4 col-sm-4 radio-wrap"><input type="radio" onChange={(ev) => setOrder({ ...order, airtel: ev.target.value })} required></input><label>Airtel Money</label></div>
                            <div className="d-flex col-lg-2 col-md-4 col-sm-4 radio-wrap"><input type="radio" onChange={(ev) => setOrder({ ...order, momo: ev.target.value })} required></input><label>MOMO Pay</label></div>
                            <div className="d-flex col-lg-2 col-md-4 col-sm-4 radio-wrap"><input type="radio" onChange={(ev) => setOrder({ ...order, credit: ev.target.value })} required></input><label>Credit card</label></div>

                        </div>
                        
                
                    </div>  
                    <div className="row mb-3 phone-row">
                        <div className="col-lg-12 phone-col">
                            <h5>Instructions</h5>
                            <textarea onChange={(ev) => setOrder({ ...order, instructions: ev.target.value })}className="form-control" placeholder="special instructions"></textarea>

                        </div>

                    </div>
                    <button className="btn-add">Complete order</button>
                </form>



            </div>

            {/* Add more checkout details or forms here */}        
        </div>
    )
}