# SB Works - Freelancing Platform

A full-stack freelancing platform built with React.js and Node.js, featuring separate portals for clients, freelancers, and administrators.

## 🚀 Features

### For Freelancers
- **Dashboard**: View current projects, completed projects, applications, and earnings
- **Profile Management**: Update skills and description
- **Project Discovery**: Browse and filter available projects
- **Application System**: Submit proposals and bids for projects
- **Project Management**: Track assigned projects and submit work

### For Clients
- **Project Creation**: Post new projects with detailed requirements
- **Application Review**: Review and manage freelancer applications
- **Project Monitoring**: Track project progress and approve submissions
- **Payment Management**: Handle project budgets and payments

### For Administrators
- **User Management**: View and manage all platform users
- **Project Oversight**: Monitor all projects and applications
- **System Analytics**: Access platform statistics and insights

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - UI framework
- **React Router DOM** - Client-side routing
- **Bootstrap 5** - CSS framework
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (Atlas or local)
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **Bcrypt** - Password hashing

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or Atlas account)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd freelancing-platform
```

### 2. Install Dependencies

#### Server Dependencies
```bash
cd server
npm install
```

#### Client Dependencies
```bash
cd client
npm install
```

### 3. Database Setup

#### Option A: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in `server/index.js` with your connection string

#### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service: `mongod`
3. The app will automatically connect to `mongodb://localhost:27017/Freelancing`

### 4. Environment Variables

Create a `.env` file in the server directory:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/freelancing?retryWrites=true&w=majority
PORT=6001
CLIENT_URL=http://localhost:3000
```

### 5. Run the Application

#### Start the Server
```bash
cd server
npm start
```

#### Start the Client (in a new terminal)
```bash
cd client
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:6001

## 🎯 Usage

### Getting Started

1. **Visit the Landing Page**: Navigate to http://localhost:3000
2. **Sign Up**: Click "Sign In" and then "Create an account"
3. **Choose User Type**: Select from Freelancer, Client, or Admin
4. **Complete Registration**: Fill in your details and create your account

### User Portals

#### Freelancer Portal
- **Dashboard**: Overview of projects and earnings
- **All Projects**: Browse available projects
- **My Projects**: View assigned projects
- **Applications**: Track your project applications

#### Client Portal
- **Dashboard**: Manage your posted projects
- **New Project**: Create and post new projects
- **Applications**: Review freelancer applications

#### Admin Portal
- **User Management**: View all registered users
- **Project Management**: Oversee all projects
- **Application Management**: Monitor all applications

## 🔧 Configuration

### MongoDB Connection
The application supports both MongoDB Atlas and local MongoDB:

- **Atlas**: Set `MONGODB_URI` environment variable
- **Local**: Ensure MongoDB is running locally on port 27017

### CORS Configuration
The server is configured to accept requests from `http://localhost:3000` by default. Update the CORS settings in `server/index.js` if needed.

## 📁 Project Structure

```
freelancing-platform/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── styles/         # CSS files
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Main server file
│   ├── Schema.js          # MongoDB schemas
│   ├── SocketHandler.js   # Socket.io handlers
│   └── package.json
└── README.md
```

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Update API endpoints to point to your production server

### Backend Deployment (Heroku/Railway)
1. Set environment variables in your hosting platform
2. Deploy the server folder
3. Update CORS settings for production domain

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for specific origins
- **Error Handling**: Comprehensive error handling and logging

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check if MongoDB is running locally
   - Verify Atlas connection string
   - Ensure network access is configured

2. **CORS Errors**
   - Update CORS settings in server/index.js
   - Check client URL configuration

3. **Port Already in Use**
   - Change PORT in server/index.js
   - Kill existing processes using the port

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with basic functionality
- **v1.1.0** - Enhanced UI/UX and responsive design
- **v1.2.0** - Added real-time features and improved error handling

---

**Happy Freelancing! 🚀**
