const noteRouter = require("express").Router();
const { createNote, deleteNote, fetchNote, fetchNotes } = require("../controllers/noteController");
const verifyAuth = require("../middlewares/auth.middleware");


noteRouter.post("/create", verifyAuth, createNote);
noteRouter.get("/:id", fetchNote);
noteRouter.get("/all", fetchNotes);
noteRouter.post("/delete/:id", verifyAuth, deleteNote);

module.exports = noteRouter;