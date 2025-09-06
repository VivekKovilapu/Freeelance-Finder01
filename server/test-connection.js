import mongoose from 'mongoose';

// MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://kovilapuvivek886_db_user:123@cluster0.2nqpdui.mongodb.net/freelancer01';

console.log('🔍 Testing MongoDB Atlas connection...');
console.log('Connection String:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

const testConnection = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false
        });
        
        console.log('✅ Successfully connected to MongoDB Atlas!');
        console.log('📊 Database:', mongoose.connection.db.databaseName);
        console.log('🔗 Host:', mongoose.connection.host);
        console.log('📝 Port:', mongoose.connection.port);
        
        // Test a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📁 Collections:', collections.map(c => c.name));
        
        await mongoose.connection.close();
        console.log('🔌 Connection closed successfully');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Connection failed:');
        console.error('Error Type:', error.name);
        console.error('Error Message:', error.message);
        
        if (error.name === 'MongoServerError') {
            console.log('\n🔧 Possible solutions:');
            console.log('1. Check if your IP address is whitelisted in MongoDB Atlas');
            console.log('2. Verify your username and password');
            console.log('3. Make sure the database user has read/write permissions');
        } else if (error.name === 'MongoNetworkError') {
            console.log('\n🔧 Network error - possible solutions:');
            console.log('1. Check your internet connection');
            console.log('2. Verify the connection string is correct');
            console.log('3. Check if your firewall is blocking the connection');
        }
        
        process.exit(1);
    }
};

testConnection();
