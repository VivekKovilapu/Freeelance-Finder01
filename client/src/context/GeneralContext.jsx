import React, { createContext, useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socketIoClient from 'socket.io-client';

export const GeneralContext = createContext();

const GeneralContextProvider = ({children}) => {

  const WS = process.env.REACT_APP_API_URL || 'http://localhost:6001';

  const socket = socketIoClient(WS);


  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');
 
  
  
  
  const login = async () => {
    try {
      const loginInputs = { email, password };
      const response = await axios.post('http://localhost:6001/login', loginInputs);
      
      if (response.data.user) {
        const user = response.data.user;
        localStorage.setItem('userId', user._id);
        localStorage.setItem('usertype', user.usertype);
        localStorage.setItem('username', user.username);
        localStorage.setItem('email', user.email);
        
        if (user.usertype === 'freelancer') {
          navigate('/freelancer');
        } else if (user.usertype === 'client') {
          navigate('/client');
        } else if (user.usertype === 'admin') {
          navigate('/admin');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      alert(err.response?.data?.error || "Login failed!");
    }
  }
      
  const inputs = {username, email, usertype, password};

  const register = async () => {
    try {
      const response = await axios.post('http://localhost:6001/register', inputs);
      
      if (response.data.user) {
        const user = response.data.user;
        localStorage.setItem('userId', user._id);
        localStorage.setItem('usertype', user.usertype);
        localStorage.setItem('username', user.username);
        localStorage.setItem('email', user.email);

        if (user.usertype === 'freelancer') {
          navigate('/freelancer');
        } else if (user.usertype === 'client') {
          navigate('/client');
        } else if (user.usertype === 'admin') {
          navigate('/admin');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert(err.response?.data?.error || "Registration failed!");
    }
  }


  const logout = async () =>{
    
    localStorage.clear();
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorage.removeItem(key);
      }
    }
    
    navigate('/');
  }


  return (
    <GeneralContext.Provider value={{socket, login, register, logout, username, setUsername, email, setEmail, password, setPassword, usertype, setUsertype}} >{children}</GeneralContext.Provider>
  )
}

export default GeneralContextProvider