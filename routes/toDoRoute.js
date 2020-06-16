const router = require("express").Router();
let ToDoList = require("../models/toDoModel");
const auth = require("../middleware/auth");

//
//------------ List options -----------

// //Get all note lists from all users !
// router.route("/").get((req, res) => {
//   const mySort = { createdAt: -1 };
//   ToDoList.find()
//     .sort(mySort)
//     .then((data) => res.json(data))
//     .catch((err) => res.status(400).json(err));
// });

//find all lists belong to the curren user
router.post("/userLists", auth, (req, res) => {
  ToDoList.find({ belongTo: req.body.belongTo })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
});

//find selected list
router.post("/sellectList", auth, (req, res) => {
  ToDoList.findById(req.body.listId)
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
});

// Create a new list
router.post("/newList", auth, (req, res) => {
  //create the new post from the imported Schema
  const newNoteList = new ToDoList({
    listName: req.body.listName,
    belongTo: req.body.belongTo,
  });

  newNoteList
    .save()
    .then((postData) => res.json(`New Post ${postData.listName} Added !`))
    .catch((err) => res.status(400).json(`Error: ${err.message}`));
});

//delate a list
router.post("/removeList", auth, (req, res) => {
  ToDoList.findByIdAndDelete(req.body.listId)
    .then((data) => res.json(`${data.listName} is removed from db`))
    .catch((err) => res.status(400).json(err));
});

//
//----------------- Note Options --------------
//

//Add new note in a list
router.post("/newNote", auth, async (req, res) => {
  const note = {
    $push: {
      notes: {
        text: req.body.text,
        isDone: req.body.isDone,
        important: req.body.important,
      },
    },
  };
  try {
    await ToDoList.findByIdAndUpdate(req.body.id, note)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    res.send("Note Added");
  } catch (error) {
    res.status(400).send(error);
  }
});

//disply one note
router.post("/note", auth, (req, res) => {
  const id = req.body.id;
  const noteId = req.body.noteId;

  ToDoList.find({ _id: id }, { notes: { $elemMatch: { _id: noteId } } })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
});

//update a single note
router.post("/updateNote", auth, (req, res) => {
  const id = req.body.id;
  const noteId = req.body.noteId;
  newText = req.body.newText;

  ToDoList.updateOne(
    { _id: id, "notes._id": noteId },
    {
      $set: {
        "notes.$.text": newText,
        "notes.$.isDone": req.body.isDone,
        "notes.$.important": req.body.important,
      },
    }
  )
    .then(() => res.json("Note updated!"))
    .catch((err) => res.json(err));
});

//remove a single note
router.post("/removeNote", auth, (req, res) => {
  const id = req.body.id;
  const noteId = req.body.noteId;

  ToDoList.updateOne({ _id: id }, { $pull: { notes: { _id: noteId } } })
    .then((data) => res.json(`Note removed`))
    .catch((err) => res.json(err));
});

module.exports = router;
