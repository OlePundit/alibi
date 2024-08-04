import React, { useEffect, useState } from 'react';
import { useCart } from '../contexts/cartContext';
import { Link } from 'react-router-dom';
import axiosClient from '../axios-client';

export default function Cart({ isOpen, closeCart }) {
    const { cart, removeFromCart, updateQuantity } = useCart(); // Use the cart context
    const [imageSrc, setImageSrc] = useState({}); // Use an object to store image URLs for each item
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    // Function to calculate the subtotal
    const calculateSubtotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const calculateTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    useEffect(() => {
        cart.forEach(item => {
            showImage(item);
        });
    }, [cart]);

    const subtotal = calculateSubtotal();
    const totalItems = calculateTotalItems();

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

    return (
        <div className={`cart ${isOpen ? 'open' : ''}`}>
            <div className="close">
                <button className="btn-delete" onClick={closeCart}>Close</button>

            </div>
            <div className="cart-title mt-5">
                <h2>My Cart <span>({totalItems})</span></h2>
            </div>
            <ul>
                {cart.map(item => (
                    <li key={item.id} className="d-flex">
                        <div className="d-flex item-wrap">
                            <img src={imageSrc[item.id] || ''} alt={item.name} width="50" height="50" />
                            <div>
                                <h4>{item.name}</h4>
                                <p>{item.quantity} x UGX {item.price}</p>
                            </div>
                            <form>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                    min="1"
                                />
                            </form>
                        </div>
                        <button onClick={() => removeFromCart(item.id)}>Remove</button>
                    </li>
                ))}
            </ul>
            <h2>Order Summary</h2>
            <p className="sub-total">Subtotal: <strong>UGX {subtotal.toFixed(2)}</strong></p>
            <Link to="/checkout" onClick={closeCart}>
                <button className="btn-add">Checkout</button>
            </Link>
        </div>
    );
}
