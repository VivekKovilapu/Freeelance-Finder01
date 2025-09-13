import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { Application, Chat, Freelancer, Project, User } from './Schema.js';
import { Server } from 'socket.io';
import http from 'http';
import SocketHandler from './SocketHandler.js';

const app = express();

// Middleware setup
app.use(express.json({ limit: "30mb" }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// CORS configuration
const allowedOrigins = [
    process.env.CLIENT_URL || "http://localhost:3000",
    "https://your-client-app.netlify.app", // Replace with your actual client URL
    "http://localhost:3000" // For local development
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin is in allowed origins
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        
        // Allow all Netlify deployments
        if (origin && origin.endsWith('.netlify.app')) {
            return callback(null, true);
        }
        
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'Freelancer Finder API Server', 
        status: 'running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running', timestamp: new Date().toISOString() });
});


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});

io.on("connection", (socket) =>{
    console.log("User connected");

    SocketHandler(socket);
})


const PORT = process.env.PORT || 6001;

// MongoDB Atlas connection - replace with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kovilapuvivek886_db_user:123@cluster0.2nqpdui.mongodb.net/freelancer01';

// For development, you can use local MongoDB if Atlas is not set up
const LOCAL_MONGODB_URI = 'mongodb://localhost:27017/Freelancing';

// Try MongoDB Atlas first, fallback to local MongoDB for development
const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            // Modern Mongoose options for Atlas compatibility
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferCommands: false // Disable mongoose buffering
        });
        console.log('✅ Connected to MongoDB Atlas');
    } catch (atlasError) {
        console.log('⚠️  MongoDB Atlas connection failed, trying local MongoDB...');
        console.error('Atlas Error Details:', atlasError.message);
        try {
            await mongoose.connect(LOCAL_MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('✅ Connected to local MongoDB');
        } catch (localError) {
            console.error('❌ Both MongoDB connections failed:');
            console.error('Atlas Error:', atlasError.message);
            console.error('Local Error:', localError.message);
            console.log('\n📝 To fix MongoDB Atlas:');
            console.log('1. Check your network access in MongoDB Atlas dashboard');
            console.log('2. Verify your username and password are correct');
            console.log('3. Make sure your IP is whitelisted (or use 0.0.0.0/0 for development)');
            console.log('4. Check if the database name "freelancing" exists');
            console.log('\n📝 To fix local MongoDB:');
            console.log('1. Install MongoDB locally and run: mongod');
            process.exit(1);
        }
    }
};

// Add connection event listeners for better debugging
mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected from MongoDB');
});

// Handle application termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🔌 Mongoose connection closed through app termination');
    process.exit(0);
});

connectToDatabase();

// Start server after successful DB connection
mongoose.connection.once('open', () => {


    app.post('/register', async (req, res) => {
        try {
            const { username, email, password, usertype } = req.body;

            // Validation
            if (!username || !email || !password || !usertype) {
                return res.status(400).json({ error: "All fields are required" });
            }

            if (!['freelancer', 'client', 'admin'].includes(usertype)) {
                return res.status(400).json({ error: "Invalid user type" });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "User already exists with this email" });
            }

            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);

            const newUser = new User({
                username,
                email,
                password: passwordHash,
                usertype
            });

            const user = await newUser.save();

            // Create freelancer profile if user type is freelancer
            if (usertype === 'freelancer') {
                const newFreelancer = new Freelancer({
                    userId: user._id
                });
                await newFreelancer.save();
            }

            // Remove password from response
            const userResponse = { ...user.toObject() };
            delete userResponse.password;

            res.status(201).json({ message: "User registered successfully", user: userResponse });

        } catch (err) {
            console.error('Registration error:', err);
            res.status(500).json({ error: err.message });
        }
    });


    app.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;

            // Validation
            if (!email || !password) {
                return res.status(400).json({ error: "Email and password are required" });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // Remove password from response
            const userResponse = { ...user.toObject() };
            delete userResponse.password;

            res.status(200).json({ message: "Login successful", user: userResponse });

        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({ error: err.message });
        }
    });


    app.get('/fetch-freelancer/:id', async(req, res)=>{
        try{

            const freelancer = await Freelancer.findOne({userId: req.params.id});

            res.status(200).json(freelancer);

        }catch(err){
            res.status(500).json({error: err.message});
        }
    })

    app.post('/update-freelancer', async(req, res)=>{
        const {freelancerId, updateSkills, description} = req.body;
        try{

            const freelancer = await Freelancer.findById(freelancerId);

            let skills = updateSkills.split(',');

            freelancer.skills = skills;
            freelancer.description = description;

            await freelancer.save();

            res.status(200).json(freelancer);

        }catch(err){
            res.status(500).json({error: err.message});
        }
    })


    // fetch project

    app.get('/fetch-project/:id', async(req, res)=>{
        try{

            const project = await Project.findById( req.params.id);

            res.status(200).json(project);

        }catch(err){
            res.status(500).json({error: err.message});
        }
    })

    // fetch all projects
    app.get('/fetch-projects', async(req, res)=>{
        try{

            const projects = await Project.find();

            res.status(200).json(projects);

        }catch(err){
            res.status(500).json({error: err.message});
        }
    })

    app.post('/new-project', async(req, res)=>{
        const {title, description, budget, skills, clientId,  clientName,  clientEmail} = req.body;
        try{

            const projectSkills = skills.split(',');
            const newProject = new Project({
                title,
                description,
                budget, 
                skills: projectSkills, 
                clientId,  
                clientName, 
                clientEmail,
                postedDate: new Date()
            })
            await newProject.save();
            res.status(200).json({message: "Project added"});
        }catch(err){
            res.status(500).json({error: err.message});
        }
    })


    // make bid

    app.post('/make-bid', async(req, res)=>{
        const {clientId, freelancerId, projectId, proposal, bidAmount, estimatedTime} = req.body;
        try{

            const freelancer = await User.findById(freelancerId);
            const freelancerData = await Freelancer.findOne({userId: freelancerId});
            const project = await Project.findById(projectId);
            const client = await User.findById(clientId);

            const newApplication = new Application({
                projectId,
                clientId,
                clientName: client.username,
                clientEmail: client.email,
                freelancerId,
                freelancerName: freelancer.username,
                freelancerEmail: freelancer.email,
                freelancerSkills: freelancerData.skills,
                title: project.title,
                description: project.description,
                budget: project.budget,
                requiredSkills: project.skills,
                proposal,
                bidAmount,
                estimatedTime
            })

            const application = await newApplication.save();

            project.bids.push(freelancerId);
            project.bidAmounts.push(parseInt(bidAmount));

            console.log(application);

            if(application){

                freelancerData.applications.push(application._id)
            }

            await freelancerData.save();
            await project.save();


            res.status(200).json({message: "bidding successful"});
        }catch(err){
            console.log(err)
            res.status(500).json({error: err.message});
        }
    })


    // fetch all applications
    app.get('/fetch-applications', async(req, res)=>{
        try{

            const applications = await Application.find();

            res.status(200).json(applications);

        }catch(err){
            res.status(500).json({error: err.message});
        }
    })


    // approve application
    app.get('/approve-application/:id', async(req, res)=>{
        try{

            const application = await Application.findById(req.params.id);

            const project = await Project.findById(application.projectId);

            const freelancer = await Freelancer.findOne({userId: application.freelancerId});

            const user = await User.findById(application.freelancerId);

            application.status = 'Accepted';

            await application.save();

            const remainingApplications = await Application.find({projectId: application.projectId, status: "Pending"});

            for (const appli of remainingApplications) {
                appli.status = 'Rejected';
                await appli.save();
            }

            project.freelancerId = freelancer.userId;
            project.freelancerName = user.username;
            project.budget = application.bidAmount;

            project.status = "Assigned";

            freelancer.currentProjects.push(project._id);

            await project.save();
            await freelancer.save();


            res.status(200).json({message: "Application approved!!"});

        }catch(err){
            console.log(err);
            res.status(500).json({error: err.message});
        }
    })

    // reject application
    app.get('/reject-application/:id', async(req, res)=>{
        try{

            const application = await Application.findById(req.params.id);

           

            application.status = 'Rejected';

            await application.save();



            res.status(200).json({message: "Application rejected!!"});

        }catch(err){
            res.status(500).json({error: err.message});
        }
    })


    // submit project
    app.post('/submit-project', async(req, res)=>{
        const {clientId, freelancerId, projectId, projectLink, manualLink, submissionDescription} = req.body;
        try{

            const project = await Project.findById(projectId);

            project.projectLink = projectLink;
            project.manualLink = manualLink;
            project.submissionDescription = submissionDescription;
            project.submission = true;

            await project.save();
            res.status(200).json({message: "Project submitted successfully"});
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });


    // approve submission
    app.get('/approve-submission/:id', async(req, res)=>{
        try{

            const project = await Project.findById(req.params.id);
            const freelancer = await Freelancer.findOne({userId: project.freelancerId});

            project.submissionAccepted = true;
            project.status = "Completed";

            freelancer.currentProjects.pop(project._id);
            freelancer.completedProjects.push(project._id);

            freelancer.funds = parseInt(freelancer.funds) + parseInt(project.budget);

            await project.save();
            await freelancer.save();

            res.status(200).json({message: "submission approved"});
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });


    // reject submission
    app.get('/reject-submission/:id', async(req, res)=>{
        try{

            const project = await Project.findById(req.params.id);

            project.submission = false;
            project.projectLink = "";
            project.manualLink = "";
            project.submissionDescription = "";

            await project.save();

            res.status(200).json({message: "submission rejected"});
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });


    // fetch all users
    app.get('/fetch-users', async(req, res)=>{
        try{

            const users = await User.find();

            res.status(200).json(users);

        }catch(err){
            res.status(500).json({error: err.message});
        }
    })


    
    // fetch chats
    app.get('/fetch-chats/:id', async(req, res)=>{
        try{

            const chats = await Chat.findById(req.params.id);

            console.log(chats);

            res.status(200).json(chats);

        }catch(err){
            res.status(500).json({error: err.message});
        }
    })


    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});