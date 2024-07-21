import { useCart } from "../contexts/cartContext"
import { useStateContext } from "../contexts/contextProvider.jsx"
import { Navigate, Link, Outlet } from 'react-router-dom';

export default function Checkout(){
    const { cart } = useCart();
    const {user, token, setUser, setToken} = useStateContext();
    if(!token) {
        return <Navigate to= "/login"/>
    }
    const calculateSubtotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const subtotal = calculateSubtotal();
    return (
        <div className="container my-2 checkout">
            <h2>Checkout</h2>
            <div className="row card">
                <h3>Order details</h3>

                <ul>
                    {cart.map(item => (
                        <li key={item.id} className="d-flex">
                            <div className="d-flex">
                                <img src={item.image} alt={item.name} width="50" height="50" />
                                <div>
                                    <h4>{item.name}</h4>
                                    <p>{item.quantity} x KSH {item.price}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <h3>Order Summary</h3>
                <p>Subtotal: <strong>KSH {subtotal.toFixed(2)}</strong></p>
                <p>Delivery cost: <strong>KSH 0</strong></p>
            </div>
            <div className="row card">
                <h3>Delivery details</h3>
                <form>
                    <div className="row mb-5">
                        <div className="col-lg-4">
                            <h5>Name</h5>
                            <input type="text" value={user.name} className="form-control" placeholder="Enter your name" required></input>
                        </div>
                        <div className="col-lg-4">
                            <h5>Email</h5>

                            <input type="email" value={user.email} className="form-control" placeholder="Enter your email" required></input>
                        </div>
                        <div className="col-lg-4">
                            <h5>Phone</h5>

                            <input type="tel" className="form-control" placeholder="Enter your phone number" required></input>
                        </div>
                    </div>
                    <div className="row mb-5">
                        <div className="col-lg-4">
                            <h5>Deliver locaton</h5>

                            <input type="text" className="form-control" placeholder="Enter your delivery location" required></input>
                        </div>
                        <div className="col-lg-4">
                            <h5>Road | Building | Landmark</h5>

                            <input type="text" className="form-control" placeholder="Road | Building | Landmark" required></input>
                        </div>
                        <div className="col-lg-4">
                            <h5>Payment method</h5>
                            <div className="d-flex">
                                <div className="d-flex radio-wrap"><input type="radio" placeholder="Cash" required></input><label>Cash</label></div>
                                <div className="d-flex radio-wrap"><input type="radio" placeholder="Cash" required></input><label>M-pesa</label></div>
                                <div className="d-flex radio-wrap"><input type="radio" placeholder="Cash" required></input><label>Credit card</label></div>

                            </div>
                           
                        </div>           
                    </div>
                    <div className="row mb-3 phone-row">
                        <div className="col-lg-12 phone-col">
                            <h5>Instructions</h5>
                            <textarea className="form-control" placeholder="special instructions"></textarea>

                        </div>

                    </div>
                    <button>Complete order</button>
                </form>



            </div>

            {/* Add more checkout details or forms here */}        
        </div>
    )
}