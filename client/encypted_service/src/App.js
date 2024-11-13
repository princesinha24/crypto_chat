import React, { useEffect, useState } from 'react';
import {createBrowserRouter, Route, Routes, RouterProvider, Outlet} from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import Login from './utility/login';
import Headers from './utility/header';
import Footer from './utility/footer';
import Signup from './utility/signup';
import Chat from './utility/chat';

function App() {
  const [res, setRes] = useState('Hello'); // State to hold response data

  const router=createBrowserRouter([
    {
      element: <>
          <Headers />
          <main>
          <Outlet />
          </main>
        </>
      ,
      children: [
      {
        path: '/',
        element: <p>{res}</p>
      }
    ,
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/message',
      element: <Chat />
    }],
},
]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
