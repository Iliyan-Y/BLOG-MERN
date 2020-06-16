const router = require("express").Router();
let Test = require("../models/testSchema");

//Get Data from DB
router.route("/").get((req, res) => {
  //get the data from mongoDB
  Test.find()
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json(err));
});

// Post data to the DB
router.route("/add").post((req, res) => {
  //save the data wanted to be posted in variables
  const name = req.body.username;
  const description = req.body.description;
  const duration = Number(req.body.duration);
  const date = Date.parse(req.body.date);

  //create the new post from the imported Schema
  const newTest = new Test({
    username: req.body.username,
    description,
    duration,
    date,
  });

  //save the new post to the DB
  newTest
    .save()
    .then(() => res.json("Data Added !"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

//get informetion to the exact object
router.route("/:id").get((req, res) => {
  Test.findById(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json(err));
});

//handle delete
router.route("/:id").delete((req, res) => {
  Test.findByIdAndDelete(req.params.id)
    .then((data) =>
      res.json(
        `${data.description} from ${data.username} is removed from the DB`
      )
    )
    .catch((err) => res.status(400).json(err));
});

//Update data (the route will recive it in json format)
router.route("/update/:id").post((req, res) => {
  //find the current data
  Test.findById(req.params.id).then((data) => {
    //add new data
    data.username = req.body.username;
    data.description = req.body.description;
    data.duration = Number(req.body.duration);
    data.date = Date.parse(req.body.date);
    //save the data
    data
      .save()
      .then((info) => res.json(info.username + " Data updated !"))
      .catch((err) => res.status(400).json(err));
  });
});

module.exports = router;
