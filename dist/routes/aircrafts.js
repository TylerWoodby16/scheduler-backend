"use strict";
// const express = require("express");
// const router = express.Router();
// const dbo = require("../db/conn");
// import { Request, Response, NextFunction } from 'express';
// router.get("/", function (req : Request, res : Response, next: NextFunction) {
//     // res.send(aircrafts);
//     const dbConnect = dbo.getDb();
//     dbConnect
//       .collection("aircrafts")
//       .find({})
//       .limit(50)
//       .toArray(function (err, result) {
//         if (err) {
//           res.status(400).send("Error fetching listings!");
//         } else {
//           res.json(result);
//         }
//       });
//   });
//   router.post("/", function (req, res, next) {
//     // const aircraftRequest = req.body;
//     // aircrafts.push(aircraftRequest);
//     // res.send(aircrafts);
//     // We only ever want to send one response.
//     const dbConnect = dbo.getDb();
//     const matchDocument = {
//       ...req.body,
//     };
//     dbConnect
//       .collection("aircrafts")
//       .insertOne(matchDocument, function (err, result) {
//         if (err) {
//           res.status(400).send("Error inserting matches!");
//         } else {
//           console.log("NO ERROR");
//           console.log(`Added a new match with id ${result.insertedId}`);
//           res.status(204).send();
//         }
//       });
//   });
//   router.delete("/deleteOne/:id", function (req, res, next) {
//     const dbConnect = dbo.getDb();
//     const idToDelete = req.params.id;
//     dbConnect
//       .collection("aircrafts")
//       .deleteOne({ _id: idToDelete }, function (err, _result) {
//         if (err) {
//           res.status(400);
//         } else {
//           res.status(204).send();
//         }
//       });
//   });
//   router.delete("/deleteMany/:name", function (req, res, next) {
//     const dbConnect = dbo.getDb();
//     // const listingQuery = { listing_id: req.body.id };
//     const nameToDelete = req.params.name;
//     dbConnect
//       .collection("aircrafts")
//       .deleteMany({ name: nameToDelete }, function (err, _result) {
//         if (err) {
//           res.status(400);
//         } else {
//           res.status(204).send();
//         }
//       });
//   });
//   // PUT /aircrafts -> update an aircraft in the aircrafts array
//   router.put("/update/:id", function (req, res, next) {
//     const dbConnect = dbo.getDb();
//     let requestBodyId = req.body._id;
//     let urlId = req.params.id;
//     if (requestBodyId != urlId) {
//       res.status(400).send("no");
//       console.log("didn't match");
//       console.log(requestBodyId + " " + urlId);
//       return;
//     }
//     let name = req.body.name;
//     dbConnect
//       .collection("aircrafts")
//       .updateOne(
//         { _id: requestBodyId },
//         { $set: { name: name } },
//         function (err, _result) {
//           if (err) {
//             console.log(err);
//             res.status(400).send(err);
//           } else {
//             console.log(_result);
//             res.status(204).send();
//           }
//         }
//       );
//   });
//   module.exports = router;
