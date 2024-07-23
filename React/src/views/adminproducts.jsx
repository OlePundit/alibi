import { useState,useEffect } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../contexts/contextProvider.jsx"
import moment from 'moment';
import { Link,Navigate, Outlet } from 'react-router-dom';

export default function AdminProducts(){
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Move currentPage state outside PaginationComponent

    useEffect(()=>{
        getProducts();
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
    const onDelete = (p) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            axiosClient.delete(`/products/${p.id}`)
                .then(() => {
                    getUsers();
                })
                .catch((error) => {
                    console.error("Error deleting product:", error);
                });
        }
    };
    const getProducts = () => {
        setLoading(true);
        axiosClient.get(`/products?page=${currentPage}`)
            .then(({ data }) => {
                setLoading(false);
                console.log(data);
                setProducts(data.data)
            })
            .catch((error) => {
                setLoading(false);
                console.error("Error fetching products:", error);
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
                <h1>Products</h1>
                
            </div>
            <div className="row mil-tab">
                <div className="col-xl-12 col-lg-12 col-md-12 col-11 card shadow products">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Volume</th>
                                <th>Availability</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Discount</th>
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
                                {products.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.name}</td>
                                    <td>{p.volume}</td>
                                    <td>{p.stock}</td>
                                    <td>{p.price}</td>
                                    <td>{p.category}</td>
                                    <td>{p.discount}</td>
                                    <td>{formatDate(p.created_at)}</td>
                                    <td>
                                    &nbsp;
                                    <button className="btn-delete" onClick={ev => onDelete(p)}>Delete</button>
                                    <Link className="btn-edit mx-2" to={`/admin/product/${p.id}`}>Edit</Link>
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