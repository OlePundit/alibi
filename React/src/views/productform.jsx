import {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client.js";

export default function ProductForm(){
    const {id} = useParams()
    const navigate = useNavigate();
    const [showWineOptions, setShowWineOptions] = useState(false);
    const [showWhiskyOptions, setShowWhiskyOptions] = useState(false);

    const [product, setProduct] = useState({
        id: null,
        name: "",
        description: "",
        volume: "",
        price: "",
        stock: "",
        category: "",
        sub_category:"",
        image:"",
        discount:"",
        wineType:"",
        whiskyType:"",
        alcohol:""
      });
      const [errors, setErrors] = useState(null);
      const [loading, setLoading] = useState(false);

      if (id){
        useEffect(()=>{
            setLoading(true)
            axiosClient.get(`/products/${id}`)
                .then(({data})=>{
                    setLoading(false)
                    setProduct(data.currentProduct)
                    console.log(data.currentProduct)
                })
                .catch(()=>{
                    setLoading(false)
                })
        },[])
    }
    
    const handleCategoryChange = (ev) => {
        const selectedCategory = ev.target.value;
        setProduct({ ...product, category: selectedCategory });
        setShowWineOptions(selectedCategory === 'wine');
        setShowWhiskyOptions(selectedCategory === 'whisky');

      };
    
      const handleWineTypeChange = (ev) => {
        setProduct({ ...product, wineType: ev.target.value });
      };
      const handleWhiskyTypeChange = (ev) => {
        setProduct({ ...product, whiskyType: ev.target.value });
      };
      const onImageChoose = (ev) => {
        const file = ev.target.files[0];
        
        // Check if file type is allowed
        const allowedTypes = ['image/jpeg','image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Invalid file type. Please select a file of type: jpeg or png.');
            ev.target.value = null; // Reset file input
            return;
        }
    
        const reader = new FileReader();
        reader.onload = () => {
          const fileData = reader.result;
          setProduct({
                ...product,
                image: file,
            });
        };
        reader.readAsArrayBuffer(file);
      };
    
    
    
      const onSubmit = (ev) => {
        ev.preventDefault();
        const formData = new FormData();

        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('volume', product.volume);
        formData.append('price', product.price);
        formData.append('stock', product.stock);
        formData.append('category', product.category);
        formData.append('discount', product.discount);
        formData.append('image', product.image);
        formData.append('alcohol', product.alcohol);

        // Append category-specific sub-category
        if (product.category === 'wine') {
            formData.append('sub_category', product.wineType);
        } else if (product.category === 'whisky') {
            formData.append('sub_category', product.whiskyType);
        } else {
            formData.append('sub_category', product.sub_category); // For other categories
        }
                

        let res = null;

        if(id){
            res = axiosClient
            .post(`/products/${product.id}?_method=PUT`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            })
        }else{
            res = axiosClient
            .post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            })
        }
        res
            .then(() => {
                console.log(formData);
                navigate('/admin/dashboard');
                if(id){
                    setNotification('Product was successfully updated')
                }else{
                    setNotification('Product was successfully created')
    
                }
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };
    return (
        <div>
            {product.id && <h2> Update product: {product.name}</h2>}
            {!product.id && <h2>New product</h2>}
            {loading && <div className="text-center">Loading...</div>}
            {errors && (
              <div className="alert">
                {Object.keys(errors).map((key) => (
                  <p key={key}>{errors[key][0]}</p>
                ))}
              </div>
            )}
            {!loading && (

            <form onSubmit={onSubmit} encType="multipart/form-data">

                <input
                onChange={(ev) => setProduct({ ...product, name: ev.target.value })}
                value={product.name}
                placeholder="Product name"
                className="form-control mb-3"
                ></input>
                <input 
                  id="image"
                  type="file" 
                  onChange={onImageChoose} 
                  placeholder="Upload product image" 
                  className="form-control mb-3"
                />
                <select value={product.volume} onChange={ev => setProduct({...product, volume: ev.target.value})} className="mb-3 form-control">
                    <option value="default">Choose volume</option>
                    <option value="5ltr">5ltr</option>
                    <option value="1ltr">1ltr</option>
                    <option value="1.5 ltr">1.5 ltr</option>
                    <option value="750ml">750ml</option>
                    <option value="500ml">500ml</option>
                    <option value="350ml">350ml</option>
                    <option value="250ml">250ml</option>
                    <option value="other">Other</option>
                </select>
                <select value={product.category} onChange={handleCategoryChange} className="mb-3 form-control">
                    <option value="default">Select category</option>
                    <option value="wine">Wine</option>
                    <option value="whisky">Whisky</option>
                    <option value="brandy">Brandy</option>
                    <option value="scotch">Scotch</option>
                    <option value="spirit">Spirit</option>
                    <option value="gin">Gin</option>
                    <option value="vodka">Vodka</option>
                    <option value="beer">Beer</option>
                    <option value="rum">Rum</option>
                    <option value="mixers">Mixers</option>
                    <option value="bourbon">Bourbon</option>
                    <option value="cognac">Cognac</option>
                    <option value="mixers">Mixers</option>                    
                    <option value="tequila">Tequila</option>
                    <option value="liquer">Liquer</option>
                    <option value="champagne">Champagne</option>

                    <option value="other">Other</option>
                </select>
                {showWineOptions && (
                    <select
                    value={product.wineType}
                    onChange={handleWineTypeChange}
                    className="mb-3 form-control"
                    >
                    <option value="">Select wine type</option>
                    <option value="red_wine">Red</option>
                    <option value="white_wine">White</option>
                    </select>
                )}
                {showWhiskyOptions && (
                    <select
                    value={product.whiskyType}
                    onChange={handleWhiskyTypeChange}
                    className="mb-3 form-control"
                    >
                    <option value="">Select whisky type</option>
                    <option value="bourbon">Bourbon</option>
                    <option value="scotch">Scotch</option>
                    <option value="single_malt">Single malt</option>

                    </select>
                )}
                <select value={product.stock} onChange={ev => setProduct({...product, stock: ev.target.value})} className="mb-3 form-control">
                    <option value="default">Stock status</option>
                    <option value="available">available</option>
                    <option value="unavailable">unavailable</option>
                </select>
                <input
                onChange={(ev) => setProduct({ ...product, price: ev.target.value })}
                value={product.price}
                placeholder="Price"
                className="form-control mb-3"
                ></input>
                <input
                onChange={(ev) => setProduct({ ...product, alcohol: ev.target.value })}
                value={product.alcohol}
                placeholder="alcohol volume"
                className="form-control mb-3"
                ></input>
                <input
                value={product.discount}
                onChange={(ev) => setProduct({ ...product, discount: ev.target.value })}
                placeholder="Discount (optional)"
                className="form-control mb-3"
                ></input>
                <textarea
                onChange={(ev) => setProduct({ ...product, description: ev.target.value })}
                value={product.description}
                placeholder="Description"
                className="form-control"
                >

                </textarea>
                <button className="btn-add mt-3">Submit</button>
            </form>
               )}
        </div>
    )
}