const { createNote, deleteNote, fetchNote, fetchNotes } = require("../controllers/noteController");
const verifyAuth = require("../middlewares/auth.middleware");

const noteRouter = require("express").Router();

noteRouter.post("/create", verifyAuth, createNote);
noteRouter.get("/note/:id", fetchNote);
noteRouter.get("/all", fetchNotes);
noteRouter.post("/delete/:id", verifyAuth, deleteNote);

module.exports = noteRouter;