const express = require("express");
const connection = require("../connection");
const router = express.Router();

// var auth =require("../");
// var checkRole =require("./");

////product  api

router.post("/add", (req, res) => {
  let product = req.body;
  let qur = "insert into product(name, categoryId, description, price, pic, status) values(?,?,?,?,?,'true')";
  connection.query(qur, [product.name, product.categoryId, product.description, product.price, product.pic], (err, result) => {
    if (!err) {
      return res.status(200).json({ Message: "Product added successfully" });
    } else {
      return res.status(500).json(err);
    }
  });
});
/////////product get

router.get("/get", (req, res) => {
  let qur =
    "select p.id, p.name, p.description, p.price, p.pic, p.status, c.id as categoryId, c.name as categoryName from product as p inner join category as c where p.categoryId=c.id";
  connection.query(qur, (err, result) => {
    if (!err) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(err);
    }
  });
});

///get
router.get("/getByCategory/:id", (req, res) => {
  const id = req.params.id;
  let qur = "select id, name from product where categoryId =? and status='true'";
  connection.query(qur, [id], (err, result) => {
    if (!err) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(err);
    }
  });
});

//////////////

router.get("/getById/:id", (req, res) => {
  const id = req.params.id;
  let qur = "select id, name, description,price from product where id = ?";
  connection.query(qur, [id], (err, result) => {
    if (!err) {
      return res.status(200).json(result[0]);
    } else {
      return res.status(500).json(err);
    }
  });
});
////update product
router.patch("/update", (req, res) => {
  let product = req.body;
  let qur = "update product set name = ?, categoryId=?, description=?, price=? where id=? ";
  connection.query(qur, [product.name, product.categoryId, product.description, product.price, product.id], (err, result) => {
    if (!err) {
      if (result.affectedRows == 0) {
        return res.status(404).json({ Message: "Product Id does not Found" });
      } else {
        return res.status(200).json({ message: "product Update Successfully" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

////////////////

router.delete("/delete/:id", (req, res) => {
  let id = req.params.id;
  let qur = "delete from product where id = ?";
  connection.query(qur, [id], (err, result) => {
    if (!err) {
      if (result.affectedRows == 0) {
        return res.status(404).json({ message: "Product id does not found" });
      } else {
        return res.status(200).json({ message: "Product delete successfully" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

///////update status
router.patch("/updateStatus", (req, res) => {
  let product = req.body;
  let qur = "update product set status =? where id =?";
  connection.query(qur, [product.status, product.id], (err, result) => {
    if (!err) {
      if (result.affectedRows == 0) {
        return res.status(404).json({ message: "Product Not Found" });
      } else {
        return res.status(200).json({ message: "Product Status Updated." });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});
//////////////export
module.exports = router;
