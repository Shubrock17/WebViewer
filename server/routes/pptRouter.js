const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PPT = require("../models/ppt");
const PPTRouter = express.Router();
PPTRouter.use(bodyParser.json());
PPTRouter.route("/")
  .get((req, res, next) => {
    PPT.find({})
      .then(
        (ppt) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(ppt);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    PPT.create(req.body)
      .then(
        (ppt) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(ppt);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported");
  })
  .delete((req, res, next) => {
    PPT.remove({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

PPTRouter.route("/:pptid")
  .get((req, res, next) => {
    PPT.find({ name: req.params.pptid })
      .then(
        (ppt) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(ppt);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported");
  })
  .put((req, res, next) => {
    PPT.updateOne({name:req.params.pptid}, { $set: req.body })
      .then(
        (ppt) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(ppt);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    PPT.findOneAndDelete({ name: req.params.pptid })
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
PPTRouter.route("/:pptid/comments")
  .get((req, res, next) => {
    PPT.findOne({ name: req.params.pptid })
      .then(
        (ppt) => {
          if (ppt != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(ppt.comments);
          } else {
            err = new Error("ppt" + req.params.pptid + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    PPT.findOne({ name: req.params.pptid })
      .then(
        (ppt) => {
          if (ppt != null) {
            ppt.comments.push(req.body);
            ppt.save().then(
              (ppt) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(ppt);
              },
              (err) => next(err)
            );
            console.log(ppt);
          } else {
            err = new Error("ppt " + req.params.pptid + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported");
  })
  .delete((req, res, next) => {
    PPT.findOne({ name: req.params.pptid })
      .then(
        (ppt) => {
          if (ppt != null) {
            for (var i = ppt.comments.length - 1; i >= 0; i--) {
              ppt.comments.id(ppt.comments[i]._id).remove();
            }
            ppt.save().then(
              (ppt) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(ppt);
              },
              (err) => next(err)
            );
          } else {
            err = new Error("ppt " + req.params.pptid + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

// PPTRouter.route("/:pptid/comments/:commentid")
//   .get((req, res, next) => {
//     PPT.findById(req.params.pptid)
//       .then(
//         (ppt) => {
//           if (ppt != null && ppt.comments.id(req.params.commentid) != null) {
//             res.statusCode = 200;
//             res.setHeader("Content-Type", "application/json");
//             res.json(ppt.comments.id(req.params.commentid));
//           } else if (ppt == null) {
//             err = new Error("ppt " + req.params.pptid + " not found");
//             err.status = 404;
//             return next(err);
//           } else {
//             err = new Error("comment  " + req.params.commentid + " not found");
//             err.status = 404;
//             return next(err);
//           }
//         },
//         (err) => next(err)
//       )
//       .catch((err) => next(err));
//   })
//   .post((req, res, next) => {
//     res.statusCode = 403;
//     res.end("POST operation not supported");
//   })
//   .put((req, res, next) => {
//     PPT.findById(req.params.pptid)
//       .then(
//         (ppt) => {
//           if (ppt != null && ppt.comments.id(req.params.commentid) != null) {
//             if (req.body.comment) {
//               ppt.comments.id(req.params.commentid).comment = req.body.comment;
//             }
//             ppt.save().then(
//               (ppt) => {
//                 res.statusCode = 200;
//                 res.setHeader("Content-Type", "application/json");
//                 res.json(ppt);
//               },
//               (err) => next(err)
//             );
//           } else if (dish == null) {
//             err = new Error("ppt " + req.params.pptid + " not found");
//             err.status = 404;
//             return next(err);
//           } else {
//             err = new Error("comment  " + req.params.commentid + " not found");
//             err.status = 404;
//             return next(err);
//           }
//         },
//         (err) => next(err)
//       )
//       .catch((err) => next(err));
//   })
//   .delete((req, res, next) => {
//     PPT.findById(req.params.pptid)
//       .then(
//         (ppt) => {
//           if (ppt != null && ppt.comments.id(req.params.commentid) != null) {
//             ppt.comments.id(req.params.commentid).remove();

//             ppt.save().then(
//               (ppt) => {
//                 res.statusCode = 200;
//                 res.setHeader("Content-Type", "application/json");
//                 res.json(ppt);
//               },
//               (err) => next(err)
//             );
//           } else if (ppt == null) {
//             err = new Error("dish " + req.params.pptid + " not found");
//             err.status = 404;
//             return next(err);
//           } else {
//             err = new Error("comment  " + req.params.commentid + " not found");
//             err.status = 404;
//             return next(err);
//           }
//         },
//         (err) => next(err)
//       )
//       .catch((err) => next(err));
//   });

module.exports = PPTRouter;
