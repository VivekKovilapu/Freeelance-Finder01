// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://freeelance-finder01-2.onrender.com';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  
  // Freelancer
  FETCH_FREELANCER: (id) => `${API_BASE_URL}/fetch-freelancer/${id}`,
  UPDATE_FREELANCER: `${API_BASE_URL}/update-freelancer`,
  
  // Projects
  FETCH_PROJECT: (id) => `${API_BASE_URL}/fetch-project/${id}`,
  FETCH_PROJECTS: `${API_BASE_URL}/fetch-projects`,
  NEW_PROJECT: `${API_BASE_URL}/new-project`,
  
  // Applications/Bids
  MAKE_BID: `${API_BASE_URL}/make-bid`,
  FETCH_APPLICATIONS: `${API_BASE_URL}/fetch-applications`,
  APPROVE_APPLICATION: (id) => `${API_BASE_URL}/approve-application/${id}`,
  REJECT_APPLICATION: (id) => `${API_BASE_URL}/reject-application/${id}`,
  
  // Project Submissions
  SUBMIT_PROJECT: `${API_BASE_URL}/submit-project`,
  APPROVE_SUBMISSION: (id) => `${API_BASE_URL}/approve-submission/${id}`,
  REJECT_SUBMISSION: (id) => `${API_BASE_URL}/reject-submission/${id}`,
  
  // Users
  FETCH_USERS: `${API_BASE_URL}/fetch-users`,
  
  // Chats
  FETCH_CHATS: (id) => `${API_BASE_URL}/fetch-chats/${id}`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/health`,
};

export default API_BASE_URL;
