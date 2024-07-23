// Cart.js
import React from 'react';
import { useCart } from '../contexts/cartContext';
import { Link,Navigate, Outlet } from 'react-router-dom';

export default function Cart({ isOpen, closeCart }) {
    const { cart, removeFromCart, updateQuantity } = useCart(); // Use the cart context
    // Function to calculate the subtotal
    const calculateSubtotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };
    const calculateTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };


    const subtotal = calculateSubtotal();
    const totalItems = calculateTotalItems();

    return (
        <div className={`cart ${isOpen ? 'open' : ''}`}>
            <button className="close-btn" onClick={closeCart}>X</button>
            <div className="mt-5">
                <h2>My Cart<span>({totalItems})</span></h2>

            </div>
            <ul>
                {cart.map(item => (
                    <li key={item.id} className="d-flex">
                        <div className="d-flex item-wrap">
                            <img src={item.image} alt={item.name} width="50" height="50" />
                            <div>
                                <h4>{item.name}</h4>
                                <p>{item.quantity} x KSH {item.price}</p>

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
            <p className="sub-total">Subtotal: <strong>KSH {subtotal.toFixed(2)}</strong></p>
            <Link to="/checkout" onClick={closeCart}>
                <button>Checkout</button>

            </Link>
        </div>
    );
}
