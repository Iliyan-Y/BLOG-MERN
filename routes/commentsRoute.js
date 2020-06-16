const router = require("express").Router();
let comments = require("../models/commentsModel");
const auth = require("../middleware/auth");

// router.get("/", (req, res) => {
//   comments
//     .find()
//     .then((data) => res.json(data))
//     .catch((err) => res.status(400).json(err));
// });

//find comments belongs to post
router.post("/showcomments", (req, res) => {
  comments
    .find({ belongToPost: req.body.postId })
    .sort({ createdAt: -1 })
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json(err));
});

//create comment
router.post("/new", auth, (req, res) => {
  if (req.body.text.length < 3)
    return res.status(400).send("Comment need to be at least 3 characters");

  const newComment = new comments({
    body: req.body.text,
    belongToPost: req.body.postId,
    authorName: req.body.authorName,
    authorId: req.body.authorId,
    authorPic: req.body.authorPic,
  });

  newComment
    .save()
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json(err));
});

//delate own comments
router.post("/delUserComment", auth, (req, res) => {
  let userId = req.body.userId;
  let commentId = req.body.commentId;

  comments
    .deleteOne({ _id: commentId }, { authorId: userId })
    .then(() => res.status(200).send("Ok"))
    .catch((err) => res.status(400).json(err));
});

//Edit comments
router.post("/update", auth, async (req, res) => {
  try {
    let comment = await comments.findById(req.body.commentId);
    comment.body = req.body.newComment;
    await comment.save();
    res.status(201).send("Comment updated");
  } catch (err) {
    res.status(400).send("Error: ", err);
  }
});

module.exports = router;
