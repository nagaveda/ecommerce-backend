require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require("./routes/auth");

//DB Connection
mongoose.connect(process.env.DATABASE,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true 
    }).then(()=>{
        console.log("DB CONNECTED...!");
    }).catch((err)=>{
        console.log("Unable to connect to the Database due to some error..!");
    });

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api", authRoutes);

//Port
const port = process.env.PORT || 8000;

//Starting a server
app.listen(port, ()=>{
    console.log(`Server running on port: ${port}`);
});