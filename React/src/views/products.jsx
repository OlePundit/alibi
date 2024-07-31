import { useState,useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axiosClient from "../axios-client.js";
import { Link, Outlet } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import liquor from '../assets/liquor.jpg';
import liquor1 from '../assets/liquor1.jpg';
import liquor2 from '../assets/liquor2.jpg';
import liquor3 from '../assets/liquor3.jpg';
import ReactSlider from 'react-slider';
import { ShoppingCartIcon, EyeIcon, BoltIcon, LockClosedIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useCart } from '../contexts/cartContext.jsx';

export default function Products(){
    const [products, setProducts] = useState([]);
    const [filtrations, setFiltrations] = useState([]);
    const [trendings, setTrendings] = useState([]);

    const [wines, setWines] = useState([])

    const [ product, setProduct] = useState({
        volume:'',
        stock:''
    });
    const [value, setValue] = useState([]);
    const { addToCart } = useCart(); // Use the cart context

    const [currentPage, setCurrentPage] = useState(1); // Move currentPage state outside PaginationComponent
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState({}); // State to store user images

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              initialSlide: 1
            }
          }
        ]
      };
    useEffect(() => {
        getProducts(); // Call getJobs when the component mounts

    }, [currentPage]); // The empty dependency array ensures it only runs once when the component 
    useEffect(() => {
        getTrendings(); // Call getJobs when the component mounts

    }, []); // The empty dependency array ensures it only runs once when the component 
    useEffect(() => {
        getWines(); // Call getJobs when the component mounts

    }, []); // The empty dependency array ensures it only runs once when the component 

    const totalPages = 1; // Assuming you have the total number of pages

    const handleLoadMore = () => {
        setCurrentPage(prevPage => prevPage + 1);
      };

      const getTrendings = () => {
        setLoading(true);
        axiosClient.get(`products?includeTrending=true`)
        .then(({ data })=> {
            setLoading(false);
            console.log('these are the trendings:',data.data);
            setTrendings(data.data);
            const trendingIds = data.data.map(trending => trending.id);
            fetchImages(trendingIds); // Fetch images for new products only


        })
        .catch((error) => {
            setLoading(false);
            console.error("Error fetching trending products:", error);
        });
    }

    const getWines = () => {
        setLoading(true);
        axiosClient.get(`products?includeWine=true`)
        .then(({ data })=> {
            setLoading(false);
            console.log('these are the wines:',data.data);
            setWines(data.data);
            const wineIds = data.data.map(wine => wine.id);
            fetchImages(wineIds); // Fetch images for new products only
        })
        .catch((error) => {
            setLoading(false);
            console.error("Error fetching wines products:", error);
        });
    }
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
    
    const calculateDiscountPercentage = (price, discount) => {
        return Math.round((discount / price) * 100);
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
    const onSubmit = ev => {
        ev.preventDefault()
        axiosClient.get(`/products?includeUsers=true&page=${currentPage}&minPrice=${value[0]}&maxPrice=${value[1]}&volume=${product.volume}&stock=${product.stock}`)
        .then(({data})=>{
            setLoading(false);
            setFiltrations(prevProducts => [...prevProducts, ...data.data]); // Append new products
            console.log('filtration results',data.data);
        })
        .catch((error)=> {
            setLoading(false);
            console.error("Error fetching jobs:", error);
        });
    }
    return (
        <div className="body">
            <div className="products container">
                <Tabs>
                    <div className="tabs-and-slider-container">
                        <div className="tabs-container">
                            <TabList className="categories mt-3">
                                <Tab>All Drinks</Tab>
                                <Tab>Wine</Tab>
                                <Tab>Vodka</Tab>
                                <Tab>Whisky</Tab>
                                <Tab>Mixers</Tab>
                                <Tab>Beer</Tab>
                                <Tab>Scotch</Tab>
                                <Tab>Spirit</Tab>
                                <Tab>Bourbon</Tab>
                                <Tab>Cognac</Tab>
                                <Tab>Cream</Tab>
                                <Tab>Rum</Tab>
                                <Tab>Gin</Tab>
                                <Tab>Brandy</Tab>
                                <Tab>Liquer</Tab>
                            </TabList>
                        </div>
                        <div className="slider-container">
                            <Slider {...settings}>
                                <div className="slider-image-container">
                                    <img src={liquor}/>
                                </div>
                                <div className="slider-image-container">
                                    <img src={liquor1}/>
                                </div>
                                <div className="slider-image-container">
                                    <img src={liquor2}/>
                                </div>
                            </Slider>
                        </div>
                        <div className="filter-container">
                            <div className="col-6 col-md-4 col-lg-3 col-xl-4 filter-panel filter-res">
                                <div class="dropdown mt-3">
                                    <button type="button" className="btn-add dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filter" viewBox="0 0 16 16">
                                                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
                                            </svg>Filter
                                        </span>
                                    </button>
                                    <div className="dropdown-menu filter-wrap">
                                        <label className="mt-3">Filter By Price</label>
                                        <form onSubmit={onSubmit} encType="multipart/form-data">
                                            <ReactSlider
                                            defaultValue={[0, 100000]}
                                            min={0}
                                            max={100000}
                                            className="horizontal-slider"
                                            thumbClassName="example-thumb"
                                            trackClassName="example-track"
                                            onBeforeChange={(value, index) =>
                                                console.log(`onBeforeChange: ${JSON.stringify({ value, index })}`)
                                            }
                                            onAfterChange={(value, index) =>
                                                console.log(`onAfterChange: ${JSON.stringify({ value, index })}`)
                                            }
                                            ariaLabel={['Lower thumb', 'Upper thumb']}
                                            ariaValuetext={state => `Thumb value ${state.valueNow}`}
                                            renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                                            pearling
                                            minDistance={10}
                                            onChange={(value,index)=>setValue(value)}
                                            thumbActiveClassName="active"
                                            />

                                            
                                            <div className="start"> 
                                                <div className="starting">Starting price: {value[0]}</div>
                                                <div>Stop price: {value[1]}</div>
                                            </div>

                                            <br/>
                                            <hr>
                                            </hr>
                                            <label className="mt-3">Filter By Volume</label>

                                            <select value={product.volume} onChange={ev => setProduct({...product, volume: ev.target.value})} className="mt-3 mb-3 form-control">
                                                <option value="">Choose volume</option>
                                                <option value="5ltr">5 Litres</option>
                                                <option value="1ltr">1 Litre</option>
                                                <option value="750ml">750 ml</option>
                                                <option value="500ml">500  ml</option>
                                                <option value="350ml">350  ml</option>
                                                <option value="250ml">250  ml</option>
                                            </select>
                                            <label className="mt-3 mb-3">Filter By Payment frequency</label>

                                            <select value={product.stock} onChange={ev => setProduct({...product, stock: ev.target.value})} className="mb-3 form-control">
                                                <option value="">availability</option>
                                                <option value="available">Available</option>
                                                <option value="unavailable">Unavailable</option>
                                            </select>
                                            <button className="btn-add mt-3">Filter</button>
                                        </form>
                                    </div>
                                </div>
                                <img src={liquor3}></img>
                            </div> 
                        </div>
                    </div>
                    <TabPanel>

                        <div>
                            {filtrations && filtrations.length > 0 ? (
                                <div className="row justify-content-center job-contents d-flex">
                                    <div className="heading-container">
                                        <h2 className="heading">Results</h2>
                                        <div className="heading-line"></div>
                                    </div>   
                                    {filtrations.map(f => (        
                                        <div key={f.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                            <img src={images[f.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                                            {f.discount && (
                                                <div class="text">-{calculateDiscountPercentage(f.price, f.discount)}%</div>
                                            )}
                                            <div class="card-body">
                                                <p class="font-weight-bold">{f.name} <span>{f.volume}</span></p>   
                                            
                                                {
                                                    f.discount ? (
                                                        <div class="d-flex discount-wrap">
                                                            <p class="strike-through">{f.price}<span> KSH </span></p> 
                                                            <p>{calculateDiscount(f.price, f.discount)}<span> KSH </span></p> 
                                                        </div>


                                                    ) : (
                                                        <p>{f.price}<span> KSH </span></p> 
            
                                        
                                                )}
                                                <div class="action-btns">
                                                <button className="action" onClick={()=>handleAddToCart(t)}>
                                                    <ShoppingCartIcon className="icon-f" />

                                                </button>

                                                <Link to={`https://wa.me/?text=${productDetailLink(f.id)}`} className="action">

                                                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                                                            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                                                        </svg>
                                                    </Link>
                                                    <Link to={`/product/detail/${f.id}`} className="action">
                                                        <EyeIcon className="icon-f w-5 h-5" />

                                                    </Link>

                                                </div>
                                            </div> 
                                        </div>

                                    ))} 
                                </div>
                            ):(
                                <div className="row justify-content-center job-contents d-flex">
                                    <div className="heading-container">
                                        <h2 className="heading">Top Trending</h2>
                                        <div className="heading-line"></div>
                                    </div>  
                                    {trendings.map(t => (        
                                        <div key={t.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                            <img src={images[t.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                                            {t.discount && (
                                                <div class="text">-{calculateDiscountPercentage(t.price, t.discount)}%</div>
                                            )}
                                            <div class="card-body">
                                                <p class="font-weight-bold">{t.name} <span>{t.volume}</span></p>   
                                            
                                                {
                                                    t.discount ? (
                                                        <div class="d-flex discount-wrap">
                                                            <p class="strike-through">{t.price}<span> KSH </span></p> 
                                                            <p>{calculateDiscount(t.price, t.discount)}<span> KSH </span></p> 
                                                        </div>


                                                    ) : (
                                                        <p>{t.price}<span> KSH </span></p> 
            
                                        
                                                )}
                                                <div class="action-btns">
                                                <button className="action" onClick={()=>handleAddToCart(t)}>
                                                    <ShoppingCartIcon className="icon-f" />

                                                </button>

                                                <Link to={`https://wa.me/?text=${productDetailLink(t.id)}`} className="action">

                                                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                                                            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                                                        </svg>
                                                    </Link>
                                                    <Link to={`/product/detail/${t.id}`} className="action">
                                                        <EyeIcon className="icon-f w-5 h-5" />

                                                    </Link>

                                                </div>
                                            </div> 
                                        </div>

                                    ))}
                                    <div className="heading-container">
                                        <h2 className="heading">Top Wines</h2>
                                        <div className="heading-line"></div>
                                    </div>  
                                    {wines.map(w => (        
                                            <div key={w.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                                <img src={images[w.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                                                {w.discount && (
                                                    <div class="text">-{calculateDiscountPercentage(w.price, w.discount)}%</div>
                                                )}
                                                <div class="card-body">
                                                    <p class="font-weight-bold">{w.name} <span>{w.volume}</span></p>   
                                                
                                                    {
                                                        w.discount ? (
                                                            <div class="d-flex discount-wrap">
                                                                <p class="strike-through">{w.price}<span> KSH </span></p> 
                                                                <p>{calculateDiscount(w.price, w.discount)}<span> KSH </span></p> 
                                                            </div>


                                                        ) : (
                                                            <p>{w.price}<span> KSH </span></p> 
                
                                            
                                                    )}
                                                    <div class="action-btns">
                                                    <button className="action" onClick={()=>handleAddToCart(w)}>
                                                    <ShoppingCartIcon className="icon-f" />

                                                    </button>

                                                    <Link to={`https://wa.me/?text=${productDetailLink(w.id)}`} className="action">

                                                            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                                                                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                                                            </svg>
                                                        </Link>
                                                        <Link to={`/product/detail/${w.id}`} className="action">
                                                            <EyeIcon className="icon-f w-5 h-5" />

                                                        </Link>

                                                    </div>
                                                </div> 
                                            </div>

                                        ))}
                                    <div className="heading-container">
                                        <h2 className="heading">More Products</h2>
                                        <div className="heading-line"></div>
                                    </div>  
                                    {products.map(p => (        
                                        <div key={p.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                            <img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                                            {p.discount && (
                                                <div class="text">-{calculateDiscountPercentage(p.price, p.discount)}%</div>
                                            )}
                                            <div class="card-body">
                                                <p class="font-weight-bold">{p.name} <span>{p.volume}</span></p>   
                                            
                                                {
                                                    p.discount ? (
                                                        <div class="d-flex discount-wrap">
                                                            <p class="strike-through">{p.price}<span> KSH </span></p> 
                                                            <p>{calculateDiscount(p.price, p.discount)}<span> KSH </span></p> 
                                                        </div>


                                                    ) : (
                                                        <p>{p.price}<span> KSH </span></p> 
            
                                        
                                                )}
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
                            )}

                            <div className="row mt-3 mb-3 d-flex button-wrap justify-content-center">
                                <button className="btn-add col-3 mx-2" onClick={handleLoadMore} disabled={loading}>Load More</button>
                            </div>
                            <div className="row mt-5 justify-content-center">
                                <div className="info col-md-3 col-sm-5 col-10">
                                    <div className="icon-box">
                                        <BoltIcon className="icon-f w-5 h-5" />

                                    </div>
                                    <h3>24 hour Express Delivery</h3>
                                    <p>We deliver to all places within Kampala around the clock. Expect your delivery in under 1 hour, depending on your location. </p>
                                </div>
                                <div className="info col-md-3 col-sm-5 col-10">
                                    <div className="icon-box">

                                        <LockClosedIcon className="icon-f w-5 h-5" />
                                    </div>
                                    <h3>Secure Payment</h3>
                                    <p>Our checkout system is completely secure, and we accept both visa and mastercard payments</p>
                                </div>
                                <div className="info col-md-3 col-sm-5 col-10">
                                    <div className="icon-box">

                                        <CurrencyDollarIcon className="icon-f w-5 h-5" />
                                    </div>
                                    <h3>Free pick up</h3>
                                    <p>Pick up your goods for free at any of our locations</p>
                                </div>
                                <div className="info col-md-3 col-sm-5 col-10">
                                    <div className="icon-box">

                                        <ShoppingCartIcon className="icon-f w-5 h-5" />
                                    </div>
                                    <h3>Wide assortment of drinks</h3>
                                    <p>We have more than 1000 different types of drinks available. From whisky, wine to brandy.</p>
                                </div>
                            </div>

                        </div>
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'wine').map (p => (        
                                        <div key={p.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                        <img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                                        {p.discount && (
                                            <div class="text">-{calculateDiscountPercentage(p.price, p.discount)}%</div>
                                        )}
                                        <div class="card-body">
                                            <p class="font-weight-bold">{p.name} <span>{p.volume}</span></p>   
                                        
                                            {
                                                p.discount ? (
                                                    <div class="d-flex discount-wrap">
                                                        <p class="strike-through">{p.price}<span> KSH </span></p> 
                                                        <p>{calculateDiscount(p.price, p.discount)}<span> KSH </span></p> 
                                                    </div>


                                                ) : (
                                                    <p>{p.price}<span> KSH </span></p> 
        
                                    
                                            )}
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
                        </div>
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'vodka').map (p => (        
                                        <div key={p.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                        <img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                                        {p.discount && (
                                            <div class="text">-{calculateDiscountPercentage(p.price, p.discount)}%</div>
                                        )}
                                        <div class="card-body">
                                            <p class="font-weight-bold">{p.name} <span>{p.volume}</span></p>   
                                        
                                            {
                                                p.discount ? (
                                                    <div class="d-flex discount-wrap">
                                                        <p class="strike-through">{p.price}<span> KSH </span></p> 
                                                        <p>{calculateDiscount(p.price, p.discount)}<span> KSH </span></p> 
                                                    </div>


                                                ) : (
                                                    <p>{p.price}<span> KSH </span></p> 
        
                                    
                                            )}
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
                        </div>
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'whisky').map (p => (        
                                        <div key={p.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                        <img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                                        {p.discount && (
                                            <div class="text">-{calculateDiscountPercentage(p.price, p.discount)}%</div>
                                        )}
                                        <div class="card-body">
                                            <p class="font-weight-bold">{p.name} <span>{p.volume}</span></p>   
                                        
                                            {
                                                p.discount ? (
                                                    <div class="d-flex discount-wrap">
                                                        <p class="strike-through">{p.price}<span> KSH </span></p> 
                                                        <p>{calculateDiscount(p.price, p.discount)}<span> KSH </span></p> 
                                                    </div>


                                                ) : (
                                                    <p>{p.price}<span> KSH </span></p> 
        
                                    
                                            )}
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
                        </div>
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'mixers').map (p => (        
                                        <div key={p.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                        <img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                                        {p.discount && (
                                            <div class="text">-{calculateDiscountPercentage(p.price, p.discount)}%</div>
                                        )}
                                        <div class="card-body">
                                            <p class="font-weight-bold">{p.name} <span>{p.volume}</span></p>   
                                        
                                            {
                                                p.discount ? (
                                                    <div class="d-flex discount-wrap">
                                                        <p class="strike-through">{p.price}<span> KSH </span></p> 
                                                        <p>{calculateDiscount(p.price, p.discount)}<span> KSH </span></p> 
                                                    </div>


                                                ) : (
                                                    <p>{p.price}<span> KSH </span></p> 
        
                                    
                                            )}
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
                        </div>
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'beer').map (p => (        
                                        <div key={p.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                        <img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                                        {p.discount && (
                                            <div class="text">-{calculateDiscountPercentage(p.price, p.discount)}%</div>
                                        )}
                                        <div class="card-body">
                                            <p class="font-weight-bold">{p.name} <span>{p.volume}</span></p>   
                                        
                                            {
                                                p.discount ? (
                                                    <div class="d-flex discount-wrap">
                                                        <p class="strike-through">{p.price}<span> KSH </span></p> 
                                                        <p>{calculateDiscount(p.price, p.discount)}<span> KSH </span></p> 
                                                    </div>


                                                ) : (
                                                    <p>{p.price}<span> KSH </span></p> 
        
                                    
                                            )}
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
                        </div>
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'scotch').map (p => (        
                                        <div key={p.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                        <img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                                        {p.discount && (
                                            <div class="text">-{calculateDiscountPercentage(p.price, p.discount)}%</div>
                                        )}
                                        <div class="card-body">
                                            <p class="font-weight-bold">{p.name} <span>{p.volume}</span></p>   
                                        
                                            {
                                                p.discount ? (
                                                    <div class="d-flex discount-wrap">
                                                        <p class="strike-through">{p.price}<span> KSH </span></p> 
                                                        <p>{calculateDiscount(p.price, p.discount)}<span> KSH </span></p> 
                                                    </div>


                                                ) : (
                                                    <p>{p.price}<span> KSH </span></p> 
        
                                    
                                            )}
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
                        </div>
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'spirit').map (p => (        
                                        <div key={p.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                        <img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                                        {p.discount && (
                                            <div class="text">-{calculateDiscountPercentage(p.price, p.discount)}%</div>
                                        )}
                                        <div class="card-body">
                                            <p class="font-weight-bold">{p.name} <span>{p.volume}</span></p>   
                                        
                                            {
                                                p.discount ? (
                                                    <div class="d-flex discount-wrap">
                                                        <p class="strike-through">{p.price}<span> KSH </span></p> 
                                                        <p>{calculateDiscount(p.price, p.discount)}<span> KSH </span></p> 
                                                    </div>


                                                ) : (
                                                    <p>{p.price}<span> KSH </span></p> 
        
                                    
                                            )}
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
                        </div>
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'bourbon').map (p => (        
                                        <div key={p.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                        <img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                                        {p.discount && (
                                            <div class="text">-{calculateDiscountPercentage(p.price, p.discount)}%</div>
                                        )}
                                        <div class="card-body">
                                            <p class="font-weight-bold">{p.name} <span>{p.volume}</span></p>   
                                        
                                            {
                                                p.discount ? (
                                                    <div class="d-flex discount-wrap">
                                                        <p class="strike-through">{p.price}<span> KSH </span></p> 
                                                        <p>{calculateDiscount(p.price, p.discount)}<span> KSH </span></p> 
                                                    </div>


                                                ) : (
                                                    <p>{p.price}<span> KSH </span></p> 
        
                                    
                                            )}
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
                        </div>
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'cognac').map (p => (        
                                        <div key={p.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                        <img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                                        {p.discount && (
                                            <div class="text">-{calculateDiscountPercentage(p.price, p.discount)}%</div>
                                        )}
                                        <div class="card-body">
                                            <p class="font-weight-bold">{p.name} <span>{p.volume}</span></p>   
                                        
                                            {
                                                p.discount ? (
                                                    <div class="d-flex discount-wrap">
                                                        <p class="strike-through">{p.price}<span> KSH </span></p> 
                                                        <p>{calculateDiscount(p.price, p.discount)}<span> KSH </span></p> 
                                                    </div>


                                                ) : (
                                                    <p>{p.price}<span> KSH </span></p> 
        
                                    
                                            )}
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
                        </div>
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'cream').map (p => (        
                                        <div key={p.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                        <img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                                        {p.discount && (
                                            <div class="text">-{calculateDiscountPercentage(p.price, p.discount)}%</div>
                                        )}
                                        <div class="card-body">
                                            <p class="font-weight-bold">{p.name} <span>{p.volume}</span></p>   
                                        
                                            {
                                                p.discount ? (
                                                    <div class="d-flex discount-wrap">
                                                        <p class="strike-through">{p.price}<span> KSH </span></p> 
                                                        <p>{calculateDiscount(p.price, p.discount)}<span> KSH </span></p> 
                                                    </div>


                                                ) : (
                                                    <p>{p.price}<span> KSH </span></p> 
        
                                    
                                            )}
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
                        </div>
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'rum').map (p => (        
                                        <div key={p.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                        <img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                                        {p.discount && (
                                            <div class="text">-{calculateDiscountPercentage(p.price, p.discount)}%</div>
                                        )}
                                        <div class="card-body">
                                            <p class="font-weight-bold">{p.name} <span>{p.volume}</span></p>   
                                        
                                            {
                                                p.discount ? (
                                                    <div class="d-flex discount-wrap">
                                                        <p class="strike-through">{p.price}<span> KSH </span></p> 
                                                        <p>{calculateDiscount(p.price, p.discount)}<span> KSH </span></p> 
                                                    </div>


                                                ) : (
                                                    <p>{p.price}<span> KSH </span></p> 
        
                                    
                                            )}
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
                        </div>
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'gin').map (p => (        
                                        <div key={p.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                        <img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                                        {p.discount && (
                                            <div class="text">-{calculateDiscountPercentage(p.price, p.discount)}%</div>
                                        )}
                                        <div class="card-body">
                                            <p class="font-weight-bold">{p.name} <span>{p.volume}</span></p>   
                                        
                                            {
                                                p.discount ? (
                                                    <div class="d-flex discount-wrap">
                                                        <p class="strike-through">{p.price}<span> KSH </span></p> 
                                                        <p>{calculateDiscount(p.price, p.discount)}<span> KSH </span></p> 
                                                    </div>


                                                ) : (
                                                    <p>{p.price}<span> KSH </span></p> 
        
                                    
                                            )}
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
                        </div>
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'brandy').map (p => (        
                                        <div key={p.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                        <img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                                        {p.discount && (
                                            <div class="text">-{calculateDiscountPercentage(p.price, p.discount)}%</div>
                                        )}
                                        <div class="card-body">
                                            <p class="font-weight-bold">{p.name} <span>{p.volume}</span></p>   
                                        
                                            {
                                                p.discount ? (
                                                    <div class="d-flex discount-wrap">
                                                        <p class="strike-through">{p.price}<span> KSH </span></p> 
                                                        <p>{calculateDiscount(p.price, p.discount)}<span> KSH </span></p> 
                                                    </div>


                                                ) : (
                                                    <p>{p.price}<span> KSH </span></p> 
        
                                    
                                            )}
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
                        </div>
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'liquer').map (p => (        
                                        <div key={p.id} className="product-wrap box col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                        <img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                                        {p.discount && (
                                            <div class="text">-{calculateDiscountPercentage(p.price, p.discount)}%</div>
                                        )}
                                        <div class="card-body">
                                            <p class="font-weight-bold">{p.name} <span>{p.volume}</span></p>   
                                        
                                            {
                                                p.discount ? (
                                                    <div class="d-flex discount-wrap">
                                                        <p class="strike-through">{p.price}<span> KSH </span></p> 
                                                        <p>{calculateDiscount(p.price, p.discount)}<span> KSH </span></p> 
                                                    </div>


                                                ) : (
                                                    <p>{p.price}<span> KSH </span></p> 
        
                                    
                                            )}
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
                        </div>
                    </TabPanel>
                </Tabs>


            </div>
                    
        </div>
    )
}