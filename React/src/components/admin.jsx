import axiosClient from "../axios-client.js";
import { useStateContext } from "../contexts/contextProvider.jsx"
import { Navigate, Link, Outlet } from 'react-router-dom';
import {useEffect} from "react";

export default function Admin(){

    const {user, token, setUser, setToken} = useStateContext();

        if(!token) {
            return <Navigate to= "/login"/>
        }
        const onLogout = (ev) => {
            ev.preventDefault()

            axiosClient.post('/logout')
            .then(() => {
              setUser({})
              setToken(null)
            })
        }

        useEffect(()=>{
            console.log('Token:', token); // Log the token

            axiosClient.get('/user')
                .then(({data})=>{
                    setUser(data);
                    console.log(data);
                })
        }, [])
    return (
        <div id="defaultLayout">
            <aside>
                <Link to="/admin/dashboard">Dashboard</Link>
                <Link to="/admin/users">Users</Link>
                <Link to="/admin/products">Products</Link>
                <Link to="/proposals">Proposals</Link>

            </aside>
            <div className="content">
                <header>
                    <div>
                        <Link to="/admin/product/new" className="btn-add">
                            Add Product
                        </Link>
                    </div>
                    <div>
                        {user.name}
                        <a href="#" onClick={onLogout} className="btn-logout">Logout</a>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>

            </div>
        
        </div>
    )
}