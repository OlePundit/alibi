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
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/users">Users</Link>
                <Link to="/jobs">Jobs</Link>
                <Link to="/proposals">Proposals</Link>

            </aside>
            <div className="content">
                <header>
                    <div>
                        Header
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