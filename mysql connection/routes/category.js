const express = require("express");
const connection = require("../connection");
const router = express.Router();
// var auth = require("../")
// var checkRole =require("../")

///create category
router.post("/add", (req, res) => {
  let category = req.body;
  let qur = "insert into category (name) values(?)";
  connection.query(qur, [category.name], (err, result) => {
    if (!err) {
      return res.status(200).json({ message: "Category Added Successfully" });
    } else {
      return res.status(500).json(err);
    }
  });
});

//////get all category
router.get("/get", (req, res) => {
  let qur = "select * from category order by name";
  connection.query(qur, (err, result) => {
    if (!err) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(err);
    }
  });
});

/////////update category
router.patch("/update", (req, res) => {
  let product = req.body;
  let qur = "update category set name =? where id = ?";
  connection.query(qur, [product.name, product.id], (err, result) => {
    if (!err) {
      if (result.affectedRows == 0) {
        return res.status(404).json({ message: "Category id not found" });
      } else {
        return res.status(200).json({ message: "Category Changed successfully" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

////export

module.exports = router;
