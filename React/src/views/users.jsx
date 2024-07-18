import { useState,useEffect } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../contexts/contextProvider.jsx"
import moment from 'moment';

export default function Users(){
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        getUsers();
    },[])

    const onDelete = (u) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            axiosClient.delete(`/users/${u.id}`)
                .then(() => {
                    getUsers();
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                });
        }
    };
    
    const getUsers = () => {
        setLoading(true);
        axiosClient.get('/users')
            .then(({ data }) => {
                setLoading(false);
                console.log(data);
                setUsers(data.data)
            })
            .catch((error) => {
                setLoading(false);
                console.error("Error fetching users:", error);
            });
    };
    const formatDate = (dateString) => {
        const formattedDate = moment(dateString).format('MMMM D, YYYY');
        return formattedDate;
    };

    return (
        <div>
            <div syle={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h1>Users</h1>
                
            </div>
            <div className="card animated fadeInDown">
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>User type</th>
                    <th>Create Date</th>
                    <th>Actions</th>
                </tr>
                </thead>
                {loading &&
                    <tbody>
                    <tr>
                    <td colSpan="5" className="text-center">
                        Loading...
                    </td>
                    </tr>
                    </tbody>
                }
                {!loading &&
                    <tbody>
                    {users.map(u => (
                    <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.user_type}</td>
                        <td>{formatDate(u.created_at)}</td>
                        <td>
                        &nbsp;
                        <button className="btn-delete" onClick={ev => onDelete(u)}>Delete</button>
                        </td>
                    </tr>
                    ))}
                    </tbody>
                }
                </table>
            </div>
        
        </div>
    )
}