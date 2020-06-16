const mongoose = require("mongoose");

const toDoSchema = mongoose.Schema(
  {
    listName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 175,
    },
    belongTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    notes: [
      {
        text: { type: String },
        isDone: { type: Boolean },
        createdAt: { type: Date, default: Date.now },
        important: { type: Boolean },
      },
    ],
  },

  {
    timestamps: true,
  }
);

const ToDoList = mongoose.model("ToDoList", toDoSchema);

module.exports = ToDoList;
