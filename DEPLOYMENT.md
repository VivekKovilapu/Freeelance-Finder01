# Deploy Freelancer Finder Server to Render

This guide will help you deploy your Node.js server to Render.com.

## Prerequisites

1. **GitHub Repository**: Your code should be pushed to a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas**: Set up a MongoDB Atlas database (free tier available)

## Step 1: Prepare Your MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Whitelist all IP addresses (0.0.0.0/0) for development
5. Get your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/database_name`)

## Step 2: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. **Push your code to GitHub** with the `render.yaml` file in the root directory
2. **Go to Render Dashboard** and click "New +"
3. **Select "Web Service"**
4. **Connect your GitHub repository**
5. **Configure the service**:
   - **Name**: `freelancer-finder-server`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free (or choose a paid plan for better performance)

### Option B: Manual Configuration

If you prefer manual setup:

1. **Go to Render Dashboard** and click "New +"
2. **Select "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service**:
   - **Name**: `freelancer-finder-server`
   - **Environment**: `Node`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

## Step 3: Set Environment Variables

In your Render dashboard, go to the "Environment" tab and add:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Application environment |
| `PORT` | `10000` | Server port (or leave empty for auto-assignment) |
| `MONGODB_URI` | `your_mongodb_connection_string` | MongoDB Atlas connection string |
| `CLIENT_URL` | `https://your-client-app.netlify.app` | Your frontend URL for CORS |

## Step 4: Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Wait for the deployment to complete (usually 2-5 minutes)
4. Your server will be available at: `https://your-app-name.onrender.com`

## Step 5: Test Your Deployment

1. **Health Check**: Visit `https://your-app-name.onrender.com/health`
2. **Root Endpoint**: Visit `https://your-app-name.onrender.com/`
3. **Test API**: Try your registration/login endpoints

## Step 6: Update Your Client Application

Update your client application to use the new server URL:

```javascript
// In your client code, update the API base URL
const API_BASE_URL = 'https://your-app-name.onrender.com';
```

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check that all dependencies are in `package.json`
2. **Database Connection Error**: Verify your MongoDB URI and network access
3. **CORS Errors**: Update the `CLIENT_URL` environment variable
4. **Port Issues**: Ensure your app uses `process.env.PORT`

### Logs:

- Check the "Logs" tab in Render dashboard for error messages
- Common errors are usually related to environment variables or database connections

## Free Tier Limitations

- **Sleep Mode**: Free tier services sleep after 15 minutes of inactivity
- **Cold Start**: First request after sleep may take 30+ seconds
- **Build Time**: Limited build minutes per month
- **Bandwidth**: Limited bandwidth usage

## Upgrading to Paid Plan

For production use, consider upgrading to a paid plan for:
- No sleep mode
- Faster cold starts
- More build minutes
- Better performance
- Custom domains

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to your repository
2. **Database Security**: Use strong passwords and limit network access
3. **CORS**: Only allow necessary origins
4. **HTTPS**: Render provides HTTPS by default

## Next Steps

1. Set up a custom domain (optional)
2. Configure monitoring and alerts
3. Set up automated deployments from your main branch
4. Consider setting up a staging environment

## Support

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- Check your application logs in the Render dashboard for specific errors
