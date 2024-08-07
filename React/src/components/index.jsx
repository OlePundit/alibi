import { Link,Navigate, Outlet } from 'react-router-dom';
import { useStateContext } from "../contexts/contextProvider.jsx";
import { useEffect,useState } from "react";
import axiosClient from "../axios-client.js";
import { ShoppingCartIcon, MagnifyingGlassIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import Cart from './cart.jsx';
import { useCart } from '../contexts/cartContext.jsx';
import { EyeIcon, BoltIcon, LockClosedIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import logo from '../assets/logo.png';

export default function Index() {
    const { user, token, setUser, setToken } = useStateContext();
    const [isCartOpen, setIsCartOpen] = useState(false); // State to manage cart visibility
    const { cart } = useCart(); // Access the cart from the cart context
    const [isAdmin, setIsAdmin] = useState(false);
    const [products, setProducts] = useState([]);
    const [ product, setProduct] = useState({
        name:'',
    });
    const [images, setImages] = useState({}); // State to store user images
    const [searchPerformed, setSearchPerformed] = useState(false);
    const { addToCart } = useCart(); // Use the cart context

    const [loading, setLoading]=useState(false);

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
    const onSubmit = async (ev) => {
        ev.preventDefault();
        setLoading(true);
        try {
            const { data } = await axiosClient.get(`/products?name=${encodeURIComponent(product.name)}`);
            setProducts(data.data); // Update products directly with search results
            setSearchPerformed(true);
            const productIds = data.data.map(product => product.id);
            const uniqueProductIds = [...new Set(productIds)]
            fetchImages(uniqueProductIds);
            console.log(data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };
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
    const calculateDiscountPercentage = (price, discount) => {
        return ((discount / price) * 100);
    };
    const calculateDiscount = (price, discount) => {
        return price - discount;
    };
    const productDetailLink = (productId)=> {
        const Link = `/product/detail/${productId}`;
        const whatsappMessage = `I am interested in this product: ${window.location.origin}${Link}`;
        return encodeURIComponent(whatsappMessage);


    }
    const handleAddToCart = (product) => {
        addToCart(product);
    };
    return (
        <div id="app">
            
            <nav className="navbar navbar-expand-md navbar-light shadow-sm">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <img src={logo} alt="" width="50" height="36" className="d-inline-block align-text-top" />
                    </Link>
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
                            <form className="search-form col-md-6 col-lg-6 col-xl-6 mt-3 mb-3" onSubmit={onSubmit}>
                                <div className="input-group">
                                    <button className="input-group-text"><MagnifyingGlassIcon className="icon-s" /></button>
                                    <input type="text" onChange={ev => setProduct({...product, name: ev.target.value})} className="form-control" placeholder="Search..." />
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
            

            {searchPerformed ? (
                products && products.length > 0 ? (
                    <div className="products container mt-5 mb-5">
                        <div className="row justify-content-center job-contents d-flex">
                            <div className="heading-container">
                                <h2 className="heading">Search Results</h2>
                                <div className="heading-line"></div>
                            </div>  
                            {products.map(p => (        
                                <div key={p.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                    <img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}} alt={p.name} /> 
                                    {p.discount && (
                                        <div className="text">-{calculateDiscountPercentage(p.price, p.discount)}%</div>
                                    )}
                                    <div className="card-body">
                                        <p className="font-weight-bold">{p.name} <span>{p.volume}</span></p>   
                                    
                                        {
                                            p.discount ? (
                                                <div className="d-flex discount-wrap">
                                                    <p className="strike-through">{p.price}<span> KSH </span></p> 
                                                    <p>{calculateDiscount(p.price, p.discount)}<span> KSH </span></p> 
                                                </div>
                                            ) : (
                                                <p>{p.price}<span> KSH </span></p>
                                            )
                                        }
                                        <div className="action-btns">
                                            <button className="action" onClick={() => handleAddToCart(p)}>
                                                <ShoppingCartIcon className="icon-f" />
                                            </button>
                                            <Link to={`https://wa.me/?text=${productDetailLink(p.id)}`} className="action">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
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
                ) : (
                    <div className="py-5">
                        <div className="row justify-content-center">
                            <div className="col-md-8 disclaimer">
                                We aplogize but no search results were found. 
                                <hr></hr>
                                If you would like to checkout more products then please go to
                                <br></br>
                                <Link to="/products">Products</Link>
                            </div>


                        </div>
                    </div>
                )
            ) : (
                <Outlet />
            )}       


                
            </main>
            <div className="footer-section">
                <div className="footer-wrap">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><Link to="/contact">Contact us</Link></li>

                                <li><Link data-bs-toggle="modal" data-bs-target="#termsModal">
                                Terms & conditions</Link></li>
                                <li><Link data-bs-toggle="modal" data-bs-target="#deliveryModal">Delivery policy</Link></li>
                                <li><Link data-bs-toggle="modal" data-bs-target="#returnModal">Return policy</Link></li>
                                <li><Link data-bs-toggle="modal" data-bs-target="#privacyModal">Privacy policy</Link></li>

                            </ul>

                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <h4>Contact us</h4>
                            <ul>
                                <li><PhoneIcon className="icon-f w-5 h-5" /> 0712345678</li>
                                <li><EnvelopeIcon className="icon-f w-5 h-5" /> info@alibi-deliveries.com</li>
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                                        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                                    </svg>
                                    always online
                                </li>
                            </ul>


                        </div>


                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <h4></h4>

                            <h4>Social Media</h4>
                            <ul className="d-flex socials">
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
                                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                                    </svg>
                                </li>
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
                                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                                    </svg>
                                </li>
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 16 16">
                                        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                                    </svg>
                                </li>
                            </ul>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <h5>All rights reserved, Alibi Deliveries. Powered by <Link to="https://sansa.digital">Sansa Digital</Link></h5>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="termsModal" tabindex="-1" aria-labelledby="termsModalLabel" aria-hidden="true">
                    <div class="modal-dialog custom-width">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="termsModalLabel">Terms and conditions</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">


                            <h1>Terms and Conditions</h1>
                            <p><strong>Effective Date:</strong> 2024-2030</p>

                            <p>Welcome to The Alibi Deliveries! These Terms and Conditions govern your use of our website and services. By accessing or using The Alibi Deliveries website (thealibi-deliveries.com) and our services, you agree to comply with and be bound by the following terms. Please read these Terms and Conditions carefully.</p>

                            <h2>1. Acceptance of Terms</h2>
                            <p>By using the Site and/or placing an order, you agree to these Terms and Conditions. If you do not agree to these terms, please do not use our Site or services.</p>

                            <h2>2. Eligibility</h2>
                            <ul>
                                <li>Be at least 18 years old (or the legal drinking age in Uganda).</li>
                                <li>Provide accurate and complete information when placing an order.</li>
                                <li>Ensure that any alcohol purchased is for personal use and not for resale.</li>
                            </ul>

                            <h2>3. Product Information</h2>
                            <p>We strive to provide accurate and up-to-date information about our products. However, we do not guarantee the accuracy, completeness, or reliability of product descriptions, images, prices, or availability.</p>

                            <h2>4. Ordering and Payment</h2>
                            <ul>
                                <li><strong>Placing an Order:</strong> Orders can be placed through our Site. You are responsible for ensuring that your order details are correct.</li>
                                <li><strong>Payment:</strong> Payment must be made in full at the time of order. We accept various payment methods as indicated on our Site.</li>
                                <li><strong>Order Confirmation:</strong> Once you place an order, you will receive a confirmation email with the details of your order. This does not constitute a contract; we reserve the right to cancel any order.</li>
                            </ul>

                            <h2>5. Delivery</h2>
                            <ul>
                                <li><strong>Delivery Service:</strong> We offer delivery services within the areas specified on our Site. Delivery times may vary depending on location and availability.</li>
                                <li><strong>Delivery Fees:</strong> Delivery fees may apply and will be indicated at the time of checkout.</li>
                                <li><strong>Delivery Issues:</strong> If there are any issues with your delivery, please contact us immediately to resolve the matter.</li>
                            </ul>

                            <h2>6. Returns and Refunds</h2>
                            <ul>
                                <li><strong>No Returns:</strong> Due to the nature of alcoholic beverages, we do not accept returns or offer refunds once the order has been delivered.</li>
                                <li><strong>Damaged or Incorrect Items:</strong> If you receive a damaged or incorrect item, please contact us within 24 hours of delivery. We will investigate and, if appropriate, provide a replacement or refund.</li>
                            </ul>

                            <h2>7. User Responsibilities</h2>
                            <ul>
                                <li><strong>Account Information:</strong> You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</li>
                                <li><strong>Prohibited Conduct:</strong> You agree not to engage in any illegal, harmful, or unethical conduct when using our Site and services.</li>
                            </ul>

                            <h2>8. Intellectual Property</h2>
                            <p>All content on the Site, including text, images, logos, and trademarks, is the property of The Alibi Deliveries and is protected by copyright and intellectual property laws. You may not use or reproduce any content without our express written consent.</p>

                            <h2>9. Limitation of Liability</h2>
                            <p>To the fullest extent permitted by law, The Alibi Deliveries shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Site or services. Our liability for any claim arising out of or relating to these Terms and Conditions is limited to the amount paid for the specific order giving rise to the claim.</p>

                            <h2>10. Indemnification</h2>
                            <p>You agree to indemnify and hold harmless The Alibi Deliveries, its officers, directors, employees, and affiliates from any claims, liabilities, damages, losses, or expenses arising from your use of the Site or services or any breach of these Terms and Conditions.</p>

                            <h2>11. Modifications</h2>
                            <p>We reserve the right to modify these Terms and Conditions at any time. Any changes will be posted on this page, and your continued use of the Site constitutes your acceptance of the updated terms.</p>

                            <h2>12. Governing Law</h2>
                            <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of Uganda. Any disputes arising under or in connection with these Terms and Conditions shall be subject to the exclusive jurisdiction of the courts of Uganda.</p>

                            <h2>13. Contact Us</h2>
                            <p>If you have any questions or concerns about these Terms and Conditions, please contact us at:</p>
                            <ul>
                                <li><strong>Email:</strong> <Link to="mailto:info@thealibi-deliveries.com">info@thealibi-deliveries.com</Link></li>
                                <li><strong>Phone:</strong> +254795692707</li>
                                <li><strong>Address:</strong> Kampala</li>
                            </ul>

                            <p>Thank you for choosing The Alibi Deliveries!</p>


                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-delete" data-bs-dismiss="modal">Close</button>
                        </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" id="deliveryModal" tabindex="-1" aria-labelledby="deliveryModalLabel" aria-hidden="true">
                    <div class="modal-dialog custom-width">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="deliveryModalLabel">Delivery Policy</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                        <h1>Delivery Policy</h1>

                        <p>Welcome to The Alibi Deliveries. We are committed to ensuring that your delivery experience is as smooth and efficient as possible. Please review our delivery policy below:</p>

                        <h2>1. Delivery Areas</h2>
                        <p>We deliver to specified areas within Uganda. Please check our delivery areas on the website to ensure that we can deliver to your location.</p>

                        <h2>2. Delivery Times</h2>
                        <p>Our standard delivery times are between 9:00 AM and 9:00 PM, Monday to Sunday. Delivery times may vary based on your location and the time of day you place your order.</p>

                        <h2>3. Delivery Charges</h2>
                        <p>Delivery charges are calculated based on the delivery location and will be displayed at checkout. Any applicable delivery fees will be added to your order total.</p>

                        <h2>4. Order Processing</h2>
                        <p>Orders are typically processed within 1-2 hours of being placed. During peak times or high demand periods, processing may take longer.</p>

                        <h2>5. Delivery Issues</h2>
                        <p>If you experience any issues with your delivery, such as:</p>
                        <ul>
                            <li>Delays</li>
                            <li>Incorrect items</li>
                        </ul>
                        <p>Please contact us immediately at info@thealibi-deliveries.com. We will do our best to resolve the issue promptly.</p>

                        <h2>6. Age Verification</h2>
                        <p>As we sell alcoholic beverages, our delivery personnel will verify the age of the recipient upon delivery. You must be at least 18 years old to receive your order. If the recipient cannot provide valid identification, the delivery will not be completed, and no refund will be issued.</p>

                        <h2>7. Delivery Confirmation</h2>
                        <p>Once your order has been delivered, you will receive a confirmation via email or SMS. Please keep this confirmation for your records.</p>

                        <h2>8. Contact Us</h2>
                        <p>If you have any questions or concerns about our delivery policy, please contact us at:</p>
                        <ul>
                            <li><strong>Email:</strong> <Link to="mailto:info@thealibi-deliveries.com">info@thealibi-deliveries.com</Link></li>
                            <li><strong>Phone:</strong> +254795692707</li>
                            <li><strong>Address:</strong> Kampala</li>
                        </ul>

                        <p>Thank you for choosing The Alibi Deliveries. We look forward to serving you!</p>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-delete" data-bs-dismiss="modal">Close</button>
                        </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" id="returnModal" tabindex="-1" aria-labelledby="returnModalLabel" aria-hidden="true">
                    <div class="modal-dialog custom-width">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="returnModalLabel">Return Policy</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                        <h1>Return Policy</h1>

                        <p>Welcome to The Alibi Deliveries. We are dedicated to providing the best customer service experience. Please review our return policy below:</p>

                        <h2>1. No Returns on Alcoholic Beverages</h2>
                        <p>Due to the nature of our products, we do not accept returns or offer refunds on alcoholic beverages once they have been delivered.</p>

                        <h2>2. Damaged or Incorrect Items</h2>
                        <p>If you receive a damaged or incorrect item, please contact us within 24 hours of delivery. We will investigate the issue and, if appropriate, provide a replacement or refund.</p>

                        <h2>3. Eligibility for Returns</h2>
                        <p>To be eligible for a return or refund, please ensure that:</p>
                        <ul>
                            <li>The item is unused and in the same condition that you received it.</li>
                            <li>The item is in its original packaging.</li>
                            <li>You have the receipt or proof of purchase.</li>
                        </ul>

                        <h2>4. Return Process</h2>
                        <p>To initiate a return, please follow these steps:</p>
                        <ul>
                            <li>Contact us at info@thealibi-deliveries.com within 24 hours of delivery.</li>
                            <li>Provide your order number, receipt, and a description of the issue.</li>
                            <li>Our customer service team will review your request and guide you through the next steps.</li>
                        </ul>

                        <h2>5. Non-returnable Items</h2>
                        <p>The following items cannot be returned:</p>
                        <ul>
                            <li>Gift cards</li>
                            <li>Perishable goods</li>
                            <li>Opened or used items</li>
                        </ul>

                        <h2>6. Refunds</h2>
                        <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within a certain amount of days.</p>

                        <h2>7. Late or Missing Refunds</h2>
                        <p>If you haven’t received a refund yet, please check your bank account again. Then contact your credit card company; it may take some time before your refund is officially posted. If you’ve done all of this and you still have not received your refund, please contact us at [Insert Contact Information].</p>

                        <h2>8. Contact Us</h2>
                        <p>If you have any questions or concerns about our return policy, please contact us at:</p>
                        <ul>
                            <li><strong>Email:</strong> <Link to="mailto:info@thealibi-deliveries.com">info@thealibi-deliveries.com</Link></li>
                            <li><strong>Phone:</strong> +254795692707</li>
                            <li><strong>Address:</strong> Kampala</li>
                        </ul>

                        <p>Thank you for choosing The Alibi Deliveries. We appreciate your business and look forward to serving you!</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-delete" data-bs-dismiss="modal">Close</button>
                        </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" id="privacyModal" tabindex="-1" aria-labelledby="privacyModalLabel" aria-hidden="true">
                    <div class="modal-dialog custom-width">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="privacyModalLabel">Privacy Policy</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                        <h1>Privacy Policy</h1>

                        <p>Welcome to The Alibi Deliveries. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. Please read this privacy policy to understand how we collect, use, and protect your information.</p>

                        <h2>1. Information We Collect</h2>
                        <p>We may collect the following types of information:</p>
                        <ul>
                            <li><strong>Personal Information:</strong> Name, email address, phone number, delivery address, payment information.</li>
                            <li><strong>Order Information:</strong> Details of your orders, including products purchased, delivery instructions, and order history.</li>
                            <li><strong>Usage Information:</strong> Information about your use of our website, such as IP address, browser type, pages visited, and time spent on the site.</li>
                        </ul>

                        <h2>2. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul>
                            <li>Process and fulfill your orders.</li>
                            <li>Communicate with you about your orders and provide customer support.</li>
                            <li>Improve our website, products, and services.</li>
                            <li>Send you promotional offers, newsletters, and other marketing communications (you can opt out at any time).</li>
                            <li>Analyze usage patterns and trends to improve user experience.</li>
                        </ul>

                        <h2>3. How We Protect Your Information</h2>
                        <p>We implement a variety of security measures to protect your personal information, including:</p>
                        <ul>
                            <li>Using secure servers and encryption to protect sensitive data.</li>
                            <li>Restricting access to personal information to authorized personnel only.</li>
                            <li>Regularly reviewing our security practices and procedures to enhance data protection.</li>
                        </ul>

                        <h2>4. Sharing Your Information</h2>
                        <p>We do not sell, trade, or otherwise transfer your personal information to outside parties, except in the following circumstances:</p>
                        <ul>
                            <li>With trusted third-party service providers who assist us in operating our website and conducting our business, as long as they agree to keep this information confidential.</li>
                            <li>When required by law or to protect our rights, property, or safety, or the rights, property, or safety of others.</li>
                            <li>In connection with a merger, acquisition, or sale of all or a portion of our assets, where your personal information may be one of the transferred assets.</li>
                        </ul>

                        <h2>5. Cookies and Tracking Technologies</h2>
                        <p>We use cookies and other tracking technologies to enhance your experience on our website. These technologies help us understand how you interact with our site and allow us to provide you with a personalized experience.</p>

                        <h2>6. Your Choices</h2>
                        <p>You have the following choices regarding your personal information:</p>
                        <ul>
                            <li>You can update or correct your personal information by contacting us at the provided contact information.</li>
                            <li>You can opt out of receiving marketing communications by following the unsubscribe instructions included in our emails.</li>
                            <li>You can disable cookies through your browser settings, but this may affect your ability to use certain features of our website.</li>
                        </ul>

                        <h2>7. Changes to This Privacy Policy</h2>
                        <p>We may update this privacy policy from time to time. Any changes will be posted on this page, and the effective date will be updated accordingly. Your continued use of our website and services constitutes your acceptance of the updated privacy policy.</p>

                        <h2>8. Contact Us</h2>
                        <p>If you have any questions or concerns about this privacy policy, please contact us at:</p>
                        <ul>
                            <li><strong>Email:</strong> <Link to="mailto:info@thealibi-deliveries.com">info@thealibi-deliveries.com</Link></li>
                            <li><strong>Phone:</strong> +256780385216</li>
                            <li><strong>Address:</strong> Kampala</li>
                        </ul>

                        <p>Thank you for choosing The Alibi Deliveries. We are committed to protecting your privacy and providing you with a secure and enjoyable shopping experience.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-delete" data-bs-dismiss="modal">Close</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}