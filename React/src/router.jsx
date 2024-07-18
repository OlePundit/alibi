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
            path: '/admin/users',
            element: <Users />
          },

          {
            path: '/admin/orders',
            element: <Orders />
          },
        ]
      },

        {
            path:'/',
            element:<Index/>,
            children:[
                {
                    path: '/products',
                    element: <Products />
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