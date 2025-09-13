# Environment Variables for Render Deployment

## Required Environment Variables

Set these in your Render dashboard under Environment Variables:

### 1. NODE_ENV
- **Value**: `production`
- **Description**: Sets the application environment

### 2. PORT
- **Value**: `10000` (or leave empty for Render to auto-assign)
- **Description**: Port number for the server

### 3. MONGODB_URI
- **Value**: Your MongoDB Atlas connection string
- **Example**: `mongodb+srv://username:password@cluster.mongodb.net/database_name`
- **Description**: MongoDB database connection string

### 4. CLIENT_URL
- **Value**: Your deployed client application URL
- **Example**: `https://your-client-app.netlify.app`
- **Description**: Frontend application URL for CORS configuration

## How to Set Environment Variables in Render

1. Go to your Render dashboard
2. Select your web service
3. Go to "Environment" tab
4. Add each variable with its corresponding value
5. Click "Save Changes"
6. Redeploy your service

## Security Notes

- Never commit your actual MongoDB URI to version control
- Use strong passwords for your MongoDB Atlas database
- Keep your environment variables secure
