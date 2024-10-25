const express = require("express");
const app = express();
const {bootDatabase} = require("./database")
const routes = require("./../routes/api");
const {notFound} = require("../controllers/404Controller");
const {validateToken} = require("../middlewares/validateAuth");
const cors = require('cors');

// database bootstrapping
bootDatabase();

// register request type
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

const fileUpload = require('express-fileupload');
app.use(fileUpload());

// Use middlewares
app.use('/v1', validateToken);

// register routes
app.use("/v1", routes);
app.use(notFound);

module.exports = app;