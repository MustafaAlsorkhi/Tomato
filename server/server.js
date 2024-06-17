require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();


app.use(cors());
app.use(express.json());

const UserRoute = require("./routers/usersRouter");
const ItemsRoute = require("./routers/itemsRouter");
const orderRoute = require("./routers/orderRouter");

app.use(UserRoute);
app.use(ItemsRoute) ;
app.use(orderRoute) ;






app.listen(4444,()=>{
    console.log("Server is running on port 4444");
}) 