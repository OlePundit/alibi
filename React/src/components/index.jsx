import { Link,Navigate, Outlet } from 'react-router-dom';
import { useStateContext } from "../contexts/contextProvider.jsx";
import { useEffect } from "react";
import axiosClient from "../axios-client.js";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

export default function Index() {
    const { user, token, setUser, setToken } = useStateContext();
    

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
                setUser(data);
            })
            .catch(error => {
                console.error('Get user error:', error);
            });
    }, []);

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
                            {user.user_type==='brand' ? (
                                <a className="nav-link active" aria-current="page" href={`/brands/dashboard/${user.id}`}>Dashboard</a>
                            ): <a className="nav-link active" aria-current="page" href={`/creators/dashboard/${user.id}`}>Dashboard</a> }
                            
                        </div>
                        ): null}

                        {/* 
                            <div className="navbar-nav">
                                <a className="nav-link active" aria-current="page" href="/explore">Explore</a>
                            </div>
                        */}

                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item" style={{ display: 'flex', alignItems: 'center' }}>
                                <Link to="/inbox">
                                    <EnvelopeIcon className="icon w-5 h-5" />

                                </Link>

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
                <Outlet />
            </main>
        </div>
    );
}