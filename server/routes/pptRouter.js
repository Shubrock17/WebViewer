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
    PPT.updateOne({ name: req.params.pptid }, { $set: req.body })
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
PPTRouter.route("/user/:user").get((req, res, next) => {
  PPT.find({ user: req.params.user })
    .then(
      (ppts) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(ppts);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
PPTRouter.route("/user/:user/commentsreq").get((req, res, next) => {
  PPT.find({ user: req.params.user })
    .then(
      (ppts) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        var newArray = ppts.map((ep) => {
          return ep.comments.filter(function (el) {
            return el.isaccepted == false;
          });
        });
        res.json(newArray);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
PPTRouter.route("/user/:pptid/commentsreq").put((req, res, next) => {
  PPT.updateOne({name:req.params.pptid},{$set:{'comments.$[outer].isaccepted':true}},{arrayFilters:[{'outer.id':req.body.id}]}).then((resp)=>{
    res.statusCode=200;
    res.setHeader("Content-Type", "application/json");
    res.json(resp);
  });
}).delete((req, res, next) => {
  PPT.findOne({ name: req.params.pptid })
    .then(
      (ppt) => {
        if (ppt != null) {
          let idx=ppt.comments.findIndex(x => x.id ===req.body.id);
          ppt.comments[idx].remove();
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

module.exports = PPTRouter;
