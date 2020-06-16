const mongoose = require("mongoose");

const comentsModel = mongoose.Schema(
  {
    body: {
      type: String,
      minlength: 3,
      required: true,
    },
    belongToPost: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "BlogPost",
    },
    authorName: {
      type: String,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    authorPic: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Coments = mongoose.model("comments", comentsModel);

module.exports = Coments;
