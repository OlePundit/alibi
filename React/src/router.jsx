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
            element: <Dashboard />
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