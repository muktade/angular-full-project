const express = require("express");
const connection = require("../connection");
const router = express.Router();

// var auth = require("./")

router.get("/details", (req, res) => {
  let categoryCount;
  let productCount;
  let billCount;
  {
    let qur = "select count(id) as categoryCount from category";
    connection.query(qur, (err, result) => {
      if (!err) {
        categoryCount = result[0].categoryCount;
      } else {
        return res.status(500).json(err);
      }
    });
  }
  {
    let qur = "select count(id) as productCount from product";
    connection.query(qur, (err, result) => {
      if (!err) {
        productCount = result[0].productCount;
      } else {
        return res.status(500).json(err);
      }
    });
  }
  {
    let qur = "select count(id) as billCount from bill";
    connection.query(qur, (err, result) => {
      if (!err) {
        billCount = result[0].billCount;
        var data = {
          category: categoryCount,
          product: productCount,
          bill: billCount,
        };
        return res.status(200).json(data);
      } else {
        return res.status(500).json(err);
      }
    });
  }
});

///export
module.exports = router;
