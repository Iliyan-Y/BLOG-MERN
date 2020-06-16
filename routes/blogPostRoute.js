const router = require("express").Router();
let BlogPost = require("../models/blogPostSchema");
const auth = require("../middleware/auth");

//Get All the posts from the db
router.route("/").get((req, res) => {
  //get the data from mongoDB
  const mySort = { createdAt: -1 };
  BlogPost.find({ public: true })
    .sort(mySort)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json(err));

  //fast update existing posts
  // BlogPost.updateMany({}, { tags: [] })
  //   .then((data) => res.json(data))
  //   .catch((err) => res.status(400).json(err));
});

//Get posts with tags and public only
router.post("/displayTags", async (req, res) => {
  const tags = req.body.tags;
  BlogPost.find({ public: true, tags: { $all: tags } })
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json(err));
});

// Post data to the DB
router.post("/newPost", auth, (req, res) => {
  //create the new post from the imported Schema
  const newPost = new BlogPost({
    title: req.body.title,
    description: req.body.description,
    postText: req.body.postText,
    thumb: req.body.thumb,
    author: req.body.author,
    authorName: req.body.authorName,
    public: req.body.public,
    tags: req.body.tags,
  });

  //save the new post to the DB
  newPost
    .save()
    .then((postData) => res.json(`New Post ${postData.title} Added !`))
    .catch((err) => res.status(400).json(`Error: ${err.message}`));
});

//get informetion from the exact object
router.route("/:id").get((req, res) => {
  BlogPost.findById(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json(err));
});

//Update data (the route will recive it in json format)
router.route("/update/:id").post(auth, (req, res) => {
  //find the current data
  BlogPost.findById(req.params.id).then((data) => {
    //Update the existing data
    data.title = req.body.title;
    data.description = req.body.description;
    data.postText = req.body.postText;
    data.thumb = req.body.thumb;
    data.public = req.body.public;
    data.tags = req.body.tags;
    //save the data
    data
      .save()
      .then((info) => res.json(info.title + " post updated !"))
      .catch((err) => res.status(400).json(err));
  });
});

module.exports = router;
