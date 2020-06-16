const router = require("express").Router();
let BlogPost = require("../models/blogPostSchema");
const auth = require("../middleware/auth");

//find users post
router.route("/").post(auth, (req, res) => {
  BlogPost.find({ author: { _id: req.body.userId } })
    .sort(req.body.sortBy)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json(err));
});

//handle delete
router.route("/:id").delete(auth, (req, res) => {
  BlogPost.findByIdAndDelete(req.params.id)
    .then((data) => res.json(`${data.title} is removed from the DB`))
    .catch((err) => res.status(400).json(err));
});

// //delatemany
// router.get("/junk", (req, res) => {
//   try {
//     BlogPost.deleteMany({ public: false })
//       .then((data) => res.json(data))
//       .catch((err) => res.status(400).json(err));
//   } catch (e) {
//     print(e);
//   }
// });

module.exports = router;
