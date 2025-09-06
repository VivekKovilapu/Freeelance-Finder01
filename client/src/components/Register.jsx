import React, { useContext, useState } from 'react'
import { GeneralContext } from '../context/GeneralContext';

const Register = ({setAuthType}) => {
  const {setUsername, setEmail, setPassword, setUsertype, register} = useContext(GeneralContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    usertype: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.usertype) {
      newErrors.usertype = 'Please select a user type';
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

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setUsername(formData.username);
    setEmail(formData.email);
    setPassword(formData.password);
    setUsertype(formData.usertype);
    
    try {
      await register();
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="authForm" onSubmit={handleRegister}>
      <h2>Create Account</h2>
      <p className="auth-subtitle">Join SB Works today</p>
      
      <div className="form-floating mb-3 authFormInputs">
        <input 
          type="text" 
          className={`form-control ${errors.username ? 'is-invalid' : ''}`}
          id="floatingUsername" 
          name="username"
          placeholder="username"
          value={formData.username}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <label htmlFor="floatingUsername">Username</label>
        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
      </div>
      
      <div className="form-floating mb-3 authFormInputs">
        <input 
          type="email" 
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          id="floatingEmail" 
          name="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <label htmlFor="floatingEmail">Email address</label>
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
      
      <div className="form-floating mb-3 authFormInputs">
        <input 
          type="password" 
          className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
          id="floatingConfirmPassword" 
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          disabled={isLoading}
        /> 
        <label htmlFor="floatingConfirmPassword">Confirm Password</label>
        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
      </div>
      
      <div className="mb-3">
        <select 
          className={`form-select form-select-lg ${errors.usertype ? 'is-invalid' : ''}`}
          name="usertype"
          value={formData.usertype}
          onChange={handleInputChange}
          disabled={isLoading}
        >
          <option value="">Select user type</option>
          <option value="freelancer">Freelancer</option>
          <option value="client">Client</option>
          <option value="admin">Admin</option>
        </select>
        {errors.usertype && <div className="invalid-feedback">{errors.usertype}</div>}
      </div>

      <button 
        type="submit" 
        className="btn btn-primary w-100" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </button>
      
      <p className="auth-switch">
        Already registered? 
        <span onClick={()=> setAuthType('login')} className="auth-link">
          Sign in
        </span>
      </p>
    </form>
  )
}

export default Register