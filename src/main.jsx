import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {  Route,Routes, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Layout from './Layout.jsx'
import Registration from './pages/Registration.jsx'
import Todo from './pages/Todo.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route  element={<Layout/>}>
      <Route path='/' element={<Login/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/registration' element={<Registration/>} />
      <Route path='/todo' element={<Todo/>} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
