const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://srivastavasid26:Sidsrivas90@cluster0.jqy1sef.mongodb.net/university?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});
