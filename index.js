const express = require("express");
const bodyParser = require("body-parser")
const router = require("./routes/userRoute");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();




const app = express();
const PORT = process.env.PORT || 4060

app.use(bodyParser.json());
app.use(cors());

app.use(cookieParser());
app.use("/", router)




app.listen(PORT, ()=>{
    
    console.log(`server started at http://localhost:${PORT}`);
})