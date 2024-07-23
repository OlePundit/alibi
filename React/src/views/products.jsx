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

export default function Products(){
    const [products, setProducts] = useState([]);
    const [ product, setProduct] = useState({
        volume:'',
        stock:''
    });
    const [value, setValue] = useState([]);

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
    const getProducts = () => {
        setLoading(true);
        axiosClient.get(`/products?includeUsers=true&page=${currentPage}`)
            .then(({ data }) => {
                setLoading(false);
                console.log(data.data);
                setProducts(data.data);
                const productIds = data.data.map(product => product.id);
                const uniqueProductIds = [...new Set(productIds)]
                fetchImages(uniqueProductIds);
            })
            .catch((error) => {
                setLoading(false);
                console.error("Error fetching products:", error);
            });
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
    const onSubmit = ev => {
        ev.preventDefault()
        axiosClient.get(`/products?includeUsers=true&page=${currentPage}&minPrice=${value[0]}&maxPrice=${value[1]}&volume=${product.volume}&stock=${product.stock}`)
        .then(({data})=>{
            setLoading(false);
            setProducts(data.data)
            console.log(data.data);
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
                            <div className="row justify-content-center job-contents d-flex">
                            {products.map(p => (        
                                <div className="product-wrap col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                    <Link to={`/product/detail/${p.id}`}><img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
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
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'wine').map (p => (        
                                <div className="product-wrap col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                    <Link to={`/product/detail/${p.id}`}><img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img>
                                    <div class="card-body">
                                        <div class="d-flex mb-1 align-items-center">     
                                            <div>
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
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'vodka').map (p => (        
                                <div className="product-wrap col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                    <Link to={`/product/detail/${p.id}`}><img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img> 
                                        <div class="card-body">
                                            <div class="d-flex mb-1 align-items-center">     
                                                <div>
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
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'whisky').map (p => (        
                                <div className="product-wrap col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                    <Link to={`/product/detail/${p.id}`}><img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img>                      
                                        <div class="card-body">
                                            <div class="d-flex mb-1 align-items-center">     
                                                <div>
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
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'mixers').map (p => (        
                                <div className="product-wrap col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                    <Link to={`/product/detail/${p.id}`}><img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img>                               
                                        <div class="card-body">
                                            <div class="d-flex mb-1 align-items-center">     
                                                <div>
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
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'beer').map (p => (        
                                <div className="product-wrap col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                    <Link to={`/product/detail/${p.id}`}><img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img>              
                                        <div class="card-body">
                                            <div class="d-flex mb-1 align-items-center">     
                                                <div>
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
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'scotch').map (p => (        
                                <div className="product-wrap col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                    <Link to={`/product/detail/${p.id}`}><img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img>                           
                                        <div class="card-body">
                                            <div class="d-flex mb-1 align-items-center">     
                                                <div>
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
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'spirit').map (p => (        
                                <div className="product-wrap col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                    <Link to={`/product/detail/${p.id}`}><img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img>                             
                                        <div class="card-body">
                                            <div class="d-flex mb-1 align-items-center">     
                                                <div>
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
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'bourbon').map (p => (        
                                <div className="product-wrap col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                    <Link to={`/product/detail/${p.id}`}><img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img>                           
                                        <div class="card-body">
                                            <div class="d-flex mb-1 align-items-center">     
                                                <div>
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
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'cognac').map (p => (        
                                <div className="product-wrap col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                    <Link to={`/product/detail/${p.id}`}><img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img>               
                                        <div class="card-body">
                                            <div class="d-flex mb-1 align-items-center">     
                                                <div>
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
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'cream').map (p => (        
                                <div className="product-wrap col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                    <Link to={`/product/detail/${p.id}`}><img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img>                     
                                        <div class="card-body">
                                            <div class="d-flex mb-1 align-items-center">     
                                                <div>
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
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'rum').map (p => (        
                                <div className="product-wrap col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                    <Link to={`/product/detail/${p.id}`}><img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img>                  
                                        <div class="card-body">
                                            <div class="d-flex mb-1 align-items-center">     
                                                <div>
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
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'gin').map (p => (        
                                <div className="product-wrap col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                    <Link to={`/product/detail/${p.id}`}><img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img>                          
                                        <div class="card-body">
                                            <div class="d-flex mb-1 align-items-center">     
                                                <div>
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
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'brandy').map (p => (        
                                <div className="product-wrap col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                    <Link to={`/product/detail/${p.id}`}><img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img>                              
                                        <div class="card-body">
                                            <div class="d-flex mb-1 align-items-center">     
                                                <div>
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
                    </TabPanel>
                    <TabPanel>

                        <div>
                            <div className="row justify-content-center job-contents d-flex">

                            {products.filter(p => p.category === 'liquer').map (p => (        
                                <div className="product-wrap col-xl-2 col-lg-3 col-md-3 col-sm-5 col-10">          
                                    <Link to={`/product/detail/${p.id}`}><img src={images[p.id]} className="card-img-top rounded" style={{maxWidth:'100%'}}></img>                          
                                        <div class="card-body">
                                            <div class="d-flex mb-1 align-items-center">     
                                                <div>
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
                    </TabPanel>
                </Tabs>
                <div className="row mt-3 mb-3 d-flex button-wrap justify-content-center">
                    <button className="btn-edit col-3" onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
                    <button className="btn-add col-3 mx-2" onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
                </div>

            </div>
                    
        </div>
    )
}