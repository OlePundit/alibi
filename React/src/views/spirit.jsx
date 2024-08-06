import { useState,useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axiosClient from "../axios-client.js";
import { Link, Outlet } from 'react-router-dom';
import { useCart } from '../contexts/cartContext.jsx';
import { ShoppingCartIcon, EyeIcon, BoltIcon, LockClosedIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";


export default function Wine(){
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Move currentPage state outside PaginationComponent
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState({}); // State to store user images

    useEffect(() => {
        getProducts(); // Call getJobs when the component mounts

    }, [currentPage]); 

    const getProducts = () => {
        setLoading(true);
        axiosClient.get(`/products?includeUsers=true&page=${currentPage}`)
            .then(({ data }) => {
                setLoading(false);
                setProducts(prevProducts => [...prevProducts, ...data.data]); // Append new products
                const productIds = data.data.map(product => product.id);
                fetchImages(productIds); // Fetch images for new products only
            })
            .catch((error) => {
                setLoading(false);
                console.error("Error fetching products:", error);
            });
    };
    const fetchImages = async (productIds) => {
        try {
            const newImages = {};
            setLoading(true);
            for (const productId of productIds) {
                const response = await axiosClient.get(`/products/${productId}/image`, { responseType: 'blob' });
                const imageUrl = URL.createObjectURL(response.data);
                newImages[productId] = imageUrl;
            }
            setImages(prevImages => ({ ...prevImages, ...newImages }));
            localStorage.setItem('Image', JSON.stringify({ ...images, ...newImages })); // Merge and save images to local storage
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
        }
    };
    const productDetailLink = (productId)=> {
        const Link = `/product/detail/${productId}`;
        const whatsappMessage = `I am interested in this product: ${window.location.origin}${Link}`;
        return encodeURIComponent(whatsappMessage);


    }
    const handleAddToCart = (product) => {
        addToCart(product);
    };
    const calculateDiscountPercentage = (price, discount) => {
        return Math.round((discount / price) * 100);
    };
    const calculateDiscount = (price, discount) => {
        return price - discount;
    };
    return (
        <div className="products container py-5">
            <div className="row justify-content-center job-contents d-flex">
                <div className="heading-container">
                    <h2 className="heading">Spirit</h2>
                    <div className="heading-line"></div>
                </div>   

                {products.filter(p => p.category === 'spirit').map (p => (        
                        <div key={p.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                        <img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                        {p.discount && (
                            <div class="text">-{calculateDiscountPercentage(p.price, p.discount)}%</div>
                        )}
                        <div class="card-body">
                            <div class="desc-wrap mb-3">
                                <h6>Alc {p.alcohol}%</h6>

                                <p class="font-weight-bold">{p.name} <span>{p.volume}</span></p>   
                            
                                {
                                    p.discount ? (
                                        <div class="d-flex discount-wrap">
                                            <p class="strike-through">{p.price}<span> UGX </span></p> 
                                            <p>{calculateDiscount(p.price, p.discount)}<span> UGX </span></p> 
                                        </div>


                                    ) : (
                                        <p class="no-discount">{p.price}<span> UGX </span></p> 

                        
                                )}
                            </div>
                            <div class="action-btns">
                                <button className="action" onClick={()=>handleAddToCart(p)}>
                                <ShoppingCartIcon className="icon-f" />

                                </button>

                                <Link to={`https://wa.me/?text=${productDetailLink(p.id)}`} className="action">

                                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                                        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                                    </svg>
                                </Link>
                                <Link to={`/product/detail/${p.id}`} className="action">
                                    <EyeIcon className="icon-f w-5 h-5" />

                                </Link>

                            </div>
                        </div> 
                    </div>

                ))}


            </div>
            <div className="row mt-3 mb-3 d-flex button-wrap justify-content-center">
                <button className="btn-add col-3 mx-2" onClick={handleLoadMore} disabled={loading}>Load More</button>
            </div>
        </div>
    )
}