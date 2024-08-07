import { Link } from 'react-router-dom';
import {useNavigate, useParams} from "react-router-dom";
import axiosClient from "../axios-client.js";
import {useEffect, useState} from "react";
import moment from 'moment';
import { ShoppingCartIcon, EyeIcon} from "@heroicons/react/24/outline";
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
    const [images, setImages] = useState({}); // State to store user images

    useEffect(() => {
        getProducts(); // Call getJobs when the component mounts
    }, []);

    useEffect(() => {
        showImage(); // Call showImage whenever job changes
    }, [product]);

  

      
    const[errors, setErrors] = useState(null);
    const [loading, setLoading]=useState(false);

    const getProducts = () => {
        setLoading(true);
        axiosClient.get(`/products/${id}`)
            .then(({ data }) => {
                setLoading(false);
                setProduct(data.currentProduct);
                console.log(data.currentProduct);
                setProducts(data.similarProducts);
                const productIds = data.similarProducts.map(product => product.id);
                const uniqueProductIds = [...new Set(productIds)]
                fetchImages(uniqueProductIds);
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
    const removeUploadsPrefix = (fileName) => {
        return fileName.replace(/^uploads\//, '');
    };
    const showImage = async () => {

        try{
            setLoading(true);
            if (product && product.image) {
                const image = removeUploadsPrefix(product.image);
                const response = await axiosClient.get(`/images/${image}`, {
                    responseType: 'blob',
                });
                const imageUrl = URL.createObjectURL(response.data);
                setImageSrc(imageUrl);
                if (response.status !== 200) {
                    throw new Error(`Failed to display image: ${response.status} ${response.statusText}`);
                }
            }
        }catch (error) {
            console.error('Error displaying file:', error);
            setErrors('Failed to displaying file');
        } finally {
            setLoading(false);
        }
    }
    const fetchImages = async (productIds) => {
        try {
            const images = {};
            setLoading(true);
            for (const productId of productIds){
                const response = await axiosClient.get(`/products/${productId}/image`, { responseType: 'blob' });
                console.log('product ID:',productId);
                console.log('Response Data:', response.data);
                const imageUrl = URL.createObjectURL(response.data);
                images[productId] = imageUrl;
            
            }
            setImages(images);
            localStorage.setItem('Image', JSON.stringify(images)); // Save images to local storage
            console.log('Images:', images);
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
    const handleAddToCart = () => {
        addToCart(product);
    };
    const calculateDiscountPercentage = (price, discount) => {
        return Math.round((discount / price) * 100);
    };
    const calculateDiscount = (price, discount) => {
        return price - discount;
    };
    return (
        
        <div className="container my-2 product-detail"> 
            <div className="row justify-content-center mt-5">
                <div className="col-lg-4 col-md-4 col-sm-5 col-10">
                    <img src={imageSrc}/>
                </div>
                <div className="col-lg-8 col-md-8 col-sm-7">
                    <p className="bread-crumbs">home / {product.category} / {product.name}</p>
                    <h1>{product.name}<span>{product.volume}</span></h1>
                    <h5><span>{product.category}</span></h5>
                    <h6>Alc {product.alcohol}%</h6>

                    <p>Availability: <span>{product.stock}</span></p>
                    <h4>KSH {product.price}</h4>
                    <div className="row">
                        <Link to={`https://wa.me/+256780385216?text=${productDetailLink(product.id)}`} className="col-md-5 col-sm-12 col-10 btn-add">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                            </svg>
                            Whatsapp checkout
                        </Link>
                        <button className="col-md-5 col-sm-12 col-10 btn-edit" onClick={handleAddToCart}>
                            <ShoppingCartIcon className="icon-s w-5 h-5" />

                            Add to cart
                        </button>
                    </div>
                    <div className="socials d-flex mt-4">
                        <div className="share-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg"  onClick={handleShare}
                                style={{ cursor: 'pointer' }} width="27px" height="27px" fill="currentColor" class="bi bi-linkedin" viewBox="0 0 16 16">
                                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                            </svg>
                        </div>
                        <div className="share-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }} onClick={() => handleShare('twitter')} width="27px" height="27px" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 16 16">
                                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                            </svg>
                        </div>
                        <div className="share-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }} onClick={() => handleShare('facebook')} width="27px" height="27px" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
                                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                            </svg>
                        </div>
                        <div className="share-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }} onClick={() => handleShare('email')} width="27px" height="27px" fill="currentColor" class="bi bi-envelope-fill" viewBox="0 0 16 16">
                                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
                            </svg>
                        </div>
                        <div className="share-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }} onClick={() => handleShare('whatsapp')} width="27px" height="27px" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                            </svg>
                        </div>

                        <div className="share-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }} onClick={copyToClipboard} width="27px" height="27px" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                            </svg>
                        </div>

                    </div>
                    <p className="express">24/7 Express Delivery</p>
                </div>
                
            </div>
            <div className="row justify-content-center mt-5">
                <div className="col-sm-12 col-10 mx-3 card">
                    <h2>Product Description</h2>
                    <p>{product.description}</p>
                </div>
            </div>
            <div className="row justify-content-center d-flex products">
                <h2 className="mt-3">Similar Drinks</h2>
                {products.map(p => (        
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

                            <Link to={`https://wa.me/+256780385216?text=${productDetailLink(p.id)}`} className="action">

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

        </div>
    )
}