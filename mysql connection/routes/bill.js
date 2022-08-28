const express = require("express");
const connection = require("../connection");
const router = express.Router();
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
let fs = require("fs");
var uuid = require("uuid");
// var auth = require("./")

router.post("/generateReport", (req, res) => {
  const generateUUid = uuid.v1();
  const orderDetails = req.body;
  var productDetailsReport = JSON.parse(orderDetails.productDetails);
  let qur = "insert into bill(name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) values(?,?,?,?,?,?,?,'admin')";
  connection.query(
    qur,
    [
      orderDetails.name,
      generateUUid,
      orderDetails.email,
      orderDetails.contactNumber,
      orderDetails.paymentMethod,
      orderDetails.totalAmount,
      orderDetails.productDetails,
      //   res.locals.email,
    ],
    (err, result) => {
      if (!err) {
        ejs.renderFile(
          path.join(__dirname, "", "report.ejs"),
          {
            productDetails: productDetailsReport,
            name: orderDetails.name,
            email: orderDetails.email,
            contactNumber: orderDetails.contactNumber,
            paymentMethod: orderDetails.paymentMethod,
            totalAmount: orderDetails.totalAmount,
          },
          (err, result) => {
            if (err) {
              return res.status(500).json(err);
            } else {
              pdf.create(result).toFile("./generate_pdf/" + generateUUid + ".pdf", function (err, data) {
                if (err) {
                  console.log(err);
                  return res.status(500).json(err);
                } else {
                  return res.status(200).json({ uuid: generateUUid });
                }
              });
            }
          }
        );
      } else {
        return res.status(500).json(err);
      }
    }
  );
});

///////pdf open
router.post("/getPdf", (req, res) => {
  const orderDetails = req.body;
  const pdfPath = "./generate_pdf/" + orderDetails.uuid + ".pdf";
  if (fs.existsSync(pdfPath)) {
    res.contentType("application/pdf");
    fs.createReadStream(pdfPath).pipe(res);
  } else {
    var productDetailsReport = JSON.parse(orderDetails.productDetails);

    ejs.renderFile(
      path.join(__dirname, "", "report.ejs"),
      {
        productDetails: productDetailsReport,
        name: orderDetails.name,
        email: orderDetails.email,
        contactNumber: orderDetails.contactNumber,
        paymentMethod: orderDetails.paymentMethod,
        totalAmount: orderDetails.totalAmount,
      },
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        } else {
          pdf.create(result).toFile("./generate_pdf/" + orderDetails.uuid + ".pdf", function (err, data) {
            if (err) {
              console.log(err);
              return res.status(500).json(err);
            } else {
              res.contentType("application/pdf");
              fs.createReadStream(pdfPath).pipe(res);
            }
          });
        }
      }
    );
  }
});

//////get bill
router.get("/getBill", (req, res) => {
  let qur = "select * from bill order by id desc";
  connection.query(qur, (err, result) => {
    if (!err) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(err);
    }
  });
});
///delete bill
router.delete("/deleteBill/:id", (req, res) => {
  let id = req.params.id;
  let qur = "delete from bill where id= ?";
  connection.query(qur, [id], (err, result) => {
    if (!err) {
      if (result.affectedRows == 0) {
        return res.status(404).json({ message: "Bill id Not found" });
      } else {
        return res.status(200).json({ message: "Bill delete Done" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});
///get bill by email
router.get(`/getBill/:email`, (req, res) => {
  let email = req.params.email;
  let qur = "select * from bill where email= ?";
  connection.query(qur, [email], (err, result) => {
    if (!err) {
      return res.status(200).json(result);
    } else {
      console.log(err);
      return res.status(500).json(err);
    }
  });
});
///export
module.exports = router;
