const express = require("express");
const connection = require("../connection");
const router = express.Router();

const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
require("dotenv").config();

///////user post math
router.post("/signup", (req, res) => {
  let user = req.body;
  let qur = "select * from user where email = ?";

  connection.query(qur, [user.email], (err, result) => {
    // console.log(result[0]);
    if (!err) {
      if (result.length <= 0) {
        let qure = "insert into user(name, contactNumber, email, password, pic, status, role) values( ?, ?, ?, ?, ?, 'false', 'user' )";
        connection.query(qure, [user.name, user.contactNumber, user.email, user.password, user.pic], (err, results) => {
          ////////////
          if (!err) {
            ///
            return res.status(200).json({ message: "User added Successfully." });
          } else {
            console.log(err);
            return res.status(500).json(err);
          }
        });
      } else {
        return res.status(400).json({ message: "Email already exist" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

//////////

router.post("/login", (req, res) => {
  const user = req.body;

  let qur = "select * from user where email = ?";
  connection.query(qur, [user.email], (err, result) => {
    if (!err) {
      if (result.length > 0) {
        if (result[0].password == user.password) {
          if (result[0].status == "false") {
            return res.status(401).json({ message: "Wait for admin approval" });
          } else {
            /////////////
            const response = {
              id: result[0].id,
              name: result[0].name,
              contactNumber: result[0].contactNumber,
              email: result[0].email,
              status: result[0].status,
              role: result[0].role,
              // pic: result[0].pic,
            };
            // sessionStorage.setItem("pic", result[0].pic);
            const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: "5h" });
            // const accessToken = jwt.sign(json(result[0]), process.env.ACCESS_TOKEN, { expiresIn: "3h" });

            res.status(200).json({ token: accessToken, pic: result[0].pic });
          }
        } else {
          return res.status(401).json({ message: "email & password dose not match" });
        }
      } else {
        return res.status(400).json({ message: "User dose not Exist." });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});
/////////////////
var transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

router.post("/forgetPassword", (req, res) => {
  const user = req.body;
  let qur = "select * from user where email = ?";
  connection.query(qur, [user.email], (err, result) => {
    if (!err) {
      if (result.length <= 0) {
        return res.status(200).json({ message: "Password sent successfully" });
      } else {
        let mailOptions = {
          from: process.env.Email,
          to: result[0].email,
          subject: "forget password",
          html: "<p><b>your login details</b><br><b>email: </b>" + result[0].email + "<br><b> Password: </b>" + result[0].password + "</p>",
        };
        transporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log("email sent: " + info.response);
          }
        });
        return res.status(200).json({ message: "pass set to your mail" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

/////////get value
router.get("/get", (req, res) => {
  let qur = "select id, name, email, contactNumber, status, pic from user where role='user'";
  connection.query(qur, (err, result) => {
    if (!err) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(err);
    }
  });
});

///update user status
router.patch("/update", (req, res) => {
  let user = req.body;
  let qur = "update user set status= ? where id= ?";
  connection.query(qur, [user.status, user.id], (err, result) => {
    if (!err) {
      if (result.affectedRows == 0) {
        return res.status(404).json({ message: "user does not exist" });
      } else {
        return res.status(200).json({ message: "user status update successfully" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

////////////token check
router.get("/checkToken", (req, res) => {
  return res.status(200).json({ message: "true" });
});

///change password
router.post("/changePassword", (req, res) => {
  let user = req.body;
  // const email = res.locals.email;
  const email = user.email;
  console.log(email);
  let qur = "select * from user where email=? and password =?";
  connection.query(qur, [email, user.oldPassword], (err, result) => {
    if (!err) {
      if (result.length <= 0) {
        return res.status(400).json({ message: "Incorrect Old Password" });
      } else if (result[0].password == user.oldPassword) {
        let qur1 = "update user set password = ? where email = ?";
        connection.query(qur1, [user.newPassword, email], (err, result) => {
          if (!err) {
            return res.status(200).json({ message: "Password Change Successfully" });
          } else {
            return res.status(500).json(err);
          }
        });
      } else {
        return res.status(400).json({ message: "Something went wrong. Please Try again later" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

//////////////////////

router.post("/picUpload", (req, res) => {
  let user = req.body;
  let qur = "insert into img(pic) values( ? )";
  console.log(user + "paise");
  connection.query(qur, [user.value], (err, results) => {
    ////////////
    if (!err) {
      ///
      return res.status(200).json({ message: "User added Successfully." });
    } else {
      return res.status(500).json(err);
    }
  });
});

/////////
module.exports = router;
