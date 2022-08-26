const cors = require("cors");
const express = require("express");
const connection = require("./connection");
const userRoute = require("./routes/user");
const categoryRoute = require("./routes/category");
const productRoute = require("./routes/product");
const createBill = require("./routes/bill");
const dashboard = require("./routes/dashboard");
const pic = require("./routes/pic");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/product", productRoute);
app.use("/bill", createBill);
app.use("/dashboard", dashboard);
app.use("/image", pic);

module.exports = app;
