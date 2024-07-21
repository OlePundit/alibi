import { Link } from 'react-router-dom';
import {useNavigate, useParams} from "react-router-dom";
import axiosClient from "../axios-client.js";
import {useEffect, useState} from "react";
import moment from 'moment';
import { ShoppingCartIcon} from "@heroicons/react/24/outline";
import { useCart } from '../contexts/cartContext.jsx';



export default function ProductDetail(){
    const {id} = useParams()
    const { addToCart } = useCart(); // Use the cart context

    const [products, setProducts] = useState([]);
    const [notification, setNotification] = useState('');
    const [imageSrc, setImageSrc] = useState(null);
    const [ product, setProduct] = useState({
        id:null,
        name:'',
        description:'',
        volume:'',
        stock:'',
        price:'',
        category:'',
        image:''
    });
    const [userImages, setUserImages] = useState({}); // State to store user images

    useEffect(() => {
        getProducts(); // Call getJobs when the component mounts
    }, []);


  

      
    const[errors, setErrors] = useState(null);
    const [loading, setLoading]=useState(false)
    const getProducts = () => {
        setLoading(true);
        axiosClient.get(`/products/${id}`)
            .then(({ data }) => {
                setLoading(false);
                setProduct(data.currentProduct);
                console.log(data.currentProduct);
                setProducts(data.similarProducts);
            })
            .catch((error) => {
                setLoading(false);
                console.error("Error fetching product:", error);
                setErrors("Failed to fetch product data");
            });
    };



    const formatDate = (dateString) => {
        const formattedDate = moment(dateString).format('MMMM D, YYYY');
        return formattedDate;
    };
    const handleShare = (platform) => {
        const url = window.location.href; // Get the current URL
        let shareUrl = '';
        const text = "Check out this job post on Sansa Self:"; // Custom text to include
        const emailSubject = "CHECK OUT THIS RECENT JOB POST ON SANSA SELF"; // Subject for the email
        const emailBody = `${text}\n\n${url}`; // Body for the email

        if (platform === 'linkedin') {
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        } else if (platform === 'twitter') {
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        } else if (platform === 'facebook') {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        } else if (platform === 'email') {
            shareUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        } else if (platform === 'whatsapp') {
            const whatsappMessage = `${text} ${url}`; // WhatsApp message with text and URL
            shareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
        }

        // Copy the URL to the clipboard
        navigator.clipboard.writeText(url).then(() => {
            console.log('URL copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy URL: ', err);
        });

        // Open the share URL in a new tab
        window.open(shareUrl, '_blank');
    };
    const copyToClipboard = (event) => {
        event.preventDefault(); // Prevent default navigation
        const url = window.location.href; // Get the current URL

        // Copy the URL to the clipboard
        navigator.clipboard.writeText(url).then(() => {
            console.log('URL copied to clipboard');
            setNotification('URL copied to clipboard'); // Set the notification message

            // Remove the notification after 3 seconds
            setTimeout(() => {
                setNotification('');
            }, 3000);
        }).catch(err => {
            console.error('Failed to copy URL: ', err);
        });
    };
    
    const handleAddToCart = () => {
        addToCart(product);
    };
    
    return (
        
        <div className="container my-2 product-detail"> 
            <div className="row mt-5">
                <div className="col-lg-4">
                    <img src={product.image}/>
                </div>
                <div className="col-lg-8">
                    <h1>{product.name}<span>{product.volume}</span></h1>
                    <h5><span>{product.category}</span></h5>

                    <p>Availability: <span>{product.stock}</span></p>
                    <h4>KSH {product.price}</h4>
                    <div className="row">
                        <Link to="" className="col-5 btn-add">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                            </svg>
                            Whatsapp checkout
                        </Link>
                        <button className="col-5 btn-edit" onClick={handleAddToCart}>
                            <ShoppingCartIcon className="icon-s w-5 h-5" />

                            Add to cart
                        </button>
                    </div>
                </div>
                
            </div>
            <div className="row mt-5 card">
                <h2>Product Description</h2>
                <p>{product.description}</p>
            </div>
            <div className="row d-flex products">
                <h2 className="mt-3">Similar Drinks</h2>
                {products.map(p => ( 

                <div className="product-wrap col-xl-2 col-lg-3 col-md-3 col">          
                    <Link to={`/product/detail/${p.id}`}><img src={p.image} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                        <div class="card-body">
                            <div class="d-flex mb-1 align-items-center">     
                                <div className="shopName">
                                    <div>
                                        <strong>
                                            <span class="text-dark">{p.user.shop_name}</span>
                                        </strong>   
                                    </div>
                                </div>
                            </div>
                            <p class="font-weight-bold">{p.name} <span>{p.volume}</span></p>
                            <p><strong>{p.price}<span> KSH </span></strong></p> 
                        </div> 
                    </Link>
                </div>

                ))}
        
            </div>

        </div>
    )
}