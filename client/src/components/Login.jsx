import React, { useContext, useState } from 'react'
import { GeneralContext } from '../context/GeneralContext';

const Login = ({setAuthType}) => {
  const {setEmail, setPassword, login} = useContext(GeneralContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setEmail(formData.email);
    setPassword(formData.password);
    
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="authForm" onSubmit={handleLogin}>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account</p>
        
        <div className="form-floating mb-3 authFormInputs">
            <input 
              type="email" 
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="floatingInput" 
              name="email"
              placeholder="name@example.com" 
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <label htmlFor="floatingInput">Email address</label>
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        
        <div className="form-floating mb-3 authFormInputs">
            <input 
              type="password" 
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              id="floatingPassword" 
              name="password"
              placeholder="Password" 
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
            /> 
            <label htmlFor="floatingPassword">Password</label>
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary w-100" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>

        <p className="auth-switch">
          Not registered? 
          <span onClick={()=> setAuthType('register')} className="auth-link">
            Create an account
          </span>
        </p>
    </form>
  )
}

export default Login