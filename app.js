const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = 3000;

// Serve static files from the 'public' directory
app.use('/Public', express.static(path.join(__dirname, 'Public'), { 'extensions': ['css'] }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const MONGODB_URI = "mongodb+srv://srivastavasid26:Sidsrivas90@cluster0.jqy1sef.mongodb.net/university?retryWrites=true&w=majority";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});

// User model
const User = require('./Database/Model/User');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Greeting route
app.get('/greeting', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'greeting.html'));
});


// Sign-up route
app.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Create a new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
        });

        // Save the user to the database
        await newUser.save();
        if(newUser){
            console.log("User Saved")
        }

        res.redirect('/login');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.route('/login')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    })
    .post(async (req, res) => {
        try {
            const { email, password } = req.body;

            // Check if the user exists in the database
            const user = await User.findOne({ email, password });

            if (user) {
                // Redirect to the index page after successful login
                res.redirect('/greeting');
            } else {
                // Prompt the user to sign up
                res.status(401).send(`
                <div style="text-align: center; margin-top: 20px;">
                    <h1 style="color: #ff0000;">Invalid credentials. Please <a href="/public/signup.html" style="color: #0000ff;">sign up</a> or try again.</h1>
                </div>
            `);
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
