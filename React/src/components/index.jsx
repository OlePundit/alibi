import { Link,Navigate, Outlet } from 'react-router-dom';
import { useStateContext } from "../contexts/contextProvider.jsx";
import { useEffect,useState } from "react";
import axiosClient from "../axios-client.js";
import { ShoppingCartIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Cart from './cart.jsx';
import { useCart } from '../contexts/cartContext.jsx';

export default function Index() {
    const { user, token, setUser, setToken } = useStateContext();
    const [isCartOpen, setIsCartOpen] = useState(false); // State to manage cart visibility
    const { cart } = useCart(); // Access the cart from the cart context
    const [isAdmin, setIsAdmin] = useState(false);

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const onLogout = (ev) => {
        ev.preventDefault();

        axiosClient.post('/logout')
            .then(() => {
                setUser({});
                setToken(null);
            })
            .catch(error => {
                console.error('Logout error:', error);
            });
    };

    useEffect(() => {
        axiosClient.get('/user')
            .then(({ data }) => {
                setUser(data.data);
                if (data.data.roles && (data.data.roles.includes('admin') || data.data.roles.includes('super-admin'))) {
                    setIsAdmin(true);
                }
                console.log(data.data)
            })
            .catch(error => {
                console.error('Get user error:', error);
            });
    }, []);

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    return (
        <div id="app">
            
            <nav className="navbar navbar-expand-md navbar-light bg-light shadow-sm">
                <div className="container">
                    <a className="navbar-brand" href="#">
                        <img src="/storage/uploads/soko.png" alt="" width="50" height="36" className="d-inline-block align-text-top" />
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {token ? (
                        <div className="navbar-nav">
                            {isAdmin ? (
                                <a className="nav-link active" aria-current="page" href={`/admin/dashboard`}>Dashboard</a>
                            ): '' }
                            
                        </div>
                        ): null}

                        {/* 
                            <div className="navbar-nav">
                                <a className="nav-link active" aria-current="page" href="/explore">Explore</a>
                            </div>
                        */}
                        <ul className="navbar-nav mx-auto">
                            <form className="search-form col-md-6 col-lg-6 col-xl-6 mt-3 mb-3">
                                <div className="input-group">
                                    <span className="input-group-text"><MagnifyingGlassIcon className="icon-s" /></span>
                                    <input type="text" className="form-control" placeholder="Search..." />
                                </div>
                            </form>
                        </ul>

                        <ul className="navbar-nav ms-auto">

                            <li className="nav-item" style={{ display: 'flex', alignItems: 'center' }}>
                                <button onClick={toggleCart} style={{ color:'#000',border: 'none',background:'none' }}>
                                    <ShoppingCartIcon className="icon-f w-5 h-5" />
                                    {totalItems > 0 && (
                                        <span className="cart-badge">{totalItems}</span>
                                    )}
                                </button>

                            </li>

                            {!token ? (
                                <li className="nav-item" >
                                    <a className="nav-link text-dark" href="/login">Login</a>
                                </li>
                            ) : (
                                <li className="nav-item dropdown">
                                    <a id="navbarDropdown" className="nav-link dropdown-toggle text-dark" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                        {user.name}
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">

                                        <a href="#" onClick={onLogout} className="btn-logout">Logout</a>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
            <main>

            {isCartOpen && <Cart isOpen={isCartOpen} closeCart={toggleCart} />}

                <Outlet />
                
            </main>
        </div>
    );
}