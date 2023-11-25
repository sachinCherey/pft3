import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Signin from './components/Signin/Signin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {


  return (
    <div className="App">
      <Router>
        <Header />
       
  

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Signup/>} />
          <Route path="/signin" element={<Signin />} />
        </Routes>

        <ToastContainer />
      </Router>
    </div>
  );
}

export default App;
