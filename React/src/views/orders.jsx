import { useState,useEffect } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../contexts/contextProvider.jsx"
import moment from 'moment';
import { Link,Navigate, Outlet } from 'react-router-dom';

export default function Orders(){
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Move currentPage state outside PaginationComponent

    useEffect(()=>{
        getOrders();
    },[currentPage])
    const totalPages = 10; // Assuming you have the total number of pages

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const onDelete = (o) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            axiosClient.delete(`/orders/${o.id}`)
                .then(() => {
                    getUsers();
                })
                .catch((error) => {
                    console.error("Error deleting order:", error);
                });
        }
    };
    const getOrders = () => {
        setLoading(true);
        axiosClient.get(`/orders?includeProducts=true&page=${currentPage}`)
            .then(({ data }) => {
                setLoading(false);
                console.log(data.data);
                setOrders(data.data)
            })
            .catch((error) => {
                setLoading(false);
                console.error("Error fetching orders:", error);
            });
    };
    const formatDate = (dateString) => {
        const createdDate = moment(dateString);
        const currentDate = moment();
        const diffDuration = moment.duration(currentDate.diff(createdDate));
    
        // Get the difference in days
        const daysDiff = diffDuration.asDays();
    
        // You can adjust this logic to display the difference in a format you prefer
        if (daysDiff < 1) {
            return 'Today';
        } else if (daysDiff < 2) {
            return 'Yesterday';
        } else {
            return `${Math.floor(daysDiff)} days ago`;
        }
    };
    return (
        <div className="admin-products">
            <div syle={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h1>Orders</h1>
                
            </div>
            <div className="row mil-tab">
                <div className="col-xl-12 col-lg-12 col-md-12 col-11 card shadow products">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Client Name</th>
                                <th>Phone</th>
                                <th>Location</th>
                                <th>Landmark</th>
                                <th>Payment Method</th>
                                <th>Instructions</th>
                                <th>Products</th>
                                <th>Status</th>
                                <th>created at</th>

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
                                {orders.map(o => (
                                <tr key={o.id}>
                                    <td>{o.id}</td>
                                    <td>{o.name}</td>
                                    <td>{o.phone}</td>
                                    <td>{o.location}</td>
                                    <td>{o.landmark}</td>
                                    <td>      
                                        {o.credit ? 'credit' : o.cash ? 'cash' : o.momo ? 'momo' : o.airtel ? 'airtel' : 'no payment method'}
                                    </td>
                                    <td>{o.instructions}</td>
                                    <td>
                                        
                                    <ul>
                                        {o.products && o.products.map(product => (
                                            <li key={product.id}>
                                                {product.name} {product.volume}
                                            </li>
                                        ))}
                                    </ul>    
                                    </td>
                                    <td>{o.status}</td>

                                    <td>{formatDate(o.created_at)}</td>
                                    <td>
                                    &nbsp;
                                    <button className="btn-delete" onClick={ev => onDelete(o)}>Delete</button>
                                    <Link className="btn-edit mx-2" to={`/admin/order/${o.id}`}>Update</Link>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        }
                    </table>
                </div>
            </div>
            <div className="row mt-3 mb-3 d-flex button-wrap justify-content-center">
                <button className="btn-edit col-3" onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
                <button className="btn-add col-3 mx-2" onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
            </div>

        
        </div>
    )
}