const express = require("express");
const connection = require("../connection");
const router = express.Router();

router.post("/picUpload", (req, res) => {
  let user = req.body;
  let qur = "insert into img(pic) values( ? )";
  // console.log(user + " ami akhane");
  connection.query(qur, [user], (err, results) => {
    ////////////
    if (!err) {
      ///
      return res.status(200).json({ message: "pic added Successfully." });
    } else {
      console.log(err);

      return res.status(500).json(err);
    }
  });
});

router.get("/files", (req, res) => {
  let qur = "select pic from img";
  connection.query(qur, (err, result) => {
    if (!err) {
      // console.log(result);
      return res.status(200).json({ result });
    } else {
      console.log(err);

      return res.status(500).json(err);
    }
  });
});

module.exports = router;
