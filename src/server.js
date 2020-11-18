import express from 'express'
import viewEngine from "./config/viewEngines";
import initWebRoute from "./routes/web";
import bodyParser from "body-parser";
require("dotenv").config()

let app = express();

// config view engine
 viewEngine(app);

 //parese request to json

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended : true}));

 //init web routes

 initWebRoute(app);

 let port = process.env.PORT || 4449;
 app.listen( port, () => {
     console.log("chatbot dang chay o cong: "+port);
 });




