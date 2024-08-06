import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from "./views/login.jsx"
import Signup from './views/signup.jsx';
import Notfound from './views/notfound.jsx';
import Index from "./components/index.jsx"
import Dashboard from "./views/dashboard.jsx"
import Users from "./views/users.jsx"
import Admin from "./components/admin.jsx"
import Products from './views/products.jsx';
import Orders from './views/orders.jsx';
import ProductDetail from './views/productdetail.jsx';
import Checkout from './views/checkout.jsx';
import ProductForm from './views/productform.jsx';
import AdminProducts from './views/adminproducts.jsx';
import UserForm from './views/userform.jsx';
import UserUpdate from './views/userupdate.jsx';
import Contact from './views/contact.jsx';
import Wine from './views/wine.jsx';
import Vodka from './views/vodka.jsx';
import Whisky from './views/whisky.jsx';
import Mixers from './views/mixers.jsx';
import Gin from './views/gin.jsx';
import Spirit from './views/spirit.jsx';
import Cognac from './views/cognac.jsx';
import Brandy from './views/brandy.jsx';
import Rum from './views/rum.jsx';
import Liquer from './views/liqeur.jsx';
import Beer from './views/beer.jsx';
import Bourbon from './views/bourbon.jsx';
import RedWine from './views/redwine.jsx';
import WhiteWine from './views/white_wine.jsx';
import Scotch from './views/scotch.jsx';
import SingleMalt from './views/singlemalt.jsx';


const router = createBrowserRouter([
    {
        path:'/admin',
        element:<Admin/>,
        children:[
          {
            path: '/admin',
            element: <Navigate to="/admin/users" />
          },
          {
            path: '/admin/dashboard',
            element: <Navigate to="/admin/products" />
          },
          {
            path: '/admin/product/new',
            element: <ProductForm key="productCreate"/>
          },
          {
            path: '/admin/product/:id',
            element: <ProductForm key="productUpdate"/>
          },
          {
            path: '/admin/users',
            element: <Users />
          },
          {
            path: '/admin/user/new',
            element: <UserForm/>
          },
          
          {
            path: '/admin/user/:id',
            element: <UserUpdate/>
          },

          {
            path: '/admin/orders',
            element: <Orders />
          },
          {
            path:'/admin/products',
            element: <AdminProducts />
          }
        ]
      },

        {
            path:'/',
            element:<Index/>,
            children:[
                {
                  path: '/',
                  element: <Navigate to="/products" />
                },
                {
                  path: '/products',
                  element: <Products />
                },
                {
                  path: '/products/wine',
                  element: <Wine />,
                },
                {
                  path: '/products/wine/red_wine',
                  element: <RedWine />
                },
                {
                  path: '/products/wine/white_wine',
                  element: <WhiteWine />
                },
          
            
                {
                  path: '/products/vodka',
                  element: <Vodka />
                },
                {
                  path: '/products/whisky',
                  element: <Whisky />,
                },
                {
                  path: '/products/whisky/bourbon',
                  element: <Bourbon />
                },
                {
                  path: '/products/whisky/scotch',
                  element: <Scotch />
                },
                {
                  path: '/products/whisky/singlemalt',
                  element: <SingleMalt />
                },
               
      
                {
                  path: '/products/mixers',
                  element: <Mixers />
                },
                {
                  path: '/products/beer',
                  element: <Beer />
                },
                {
                  path: '/products/gin',
                  element: <Gin />
                },

                {
                  path: '/products/spirit',
                  element: <Spirit />
                },
                {
                  path: '/products/cognac',
                  element: <Cognac />
                },
                {
                  path: '/products/rum',
                  element: <Rum />
                },
                {
                  path: '/products/brandy',
                  element: <Brandy />
                },
                {
                  path: '/products/liqeur',
                  element: <Liquer />
                },


                {
                  path: '/contact',
                  element: <Contact />
                },
                {
                  path: '/product/detail/:id',
                  element: <ProductDetail />
                },
                {
                  path: '/checkout',
                  element: <Checkout />
                },
                {
                    path: '/login',
                    element: <Login />
                },
                {
                    path: '/signup',
                    element: <Signup />
                },


            ]
        },


    {
        path: '*',
        element: <Notfound />
    },

]
);

export default router;