const noteModel = require("../models/noteSchema");

async function createNote(req, res, next) {
    const { title, description } = req.body;
    const user = req.user;

    try {
        //check if user has access to write 
        if(!hasWriteAccess(user.user_type)) {
            res.json({
                message: "access denied, you need to be either an author or a guest author to be able to write a note",
                success: false,
            })
        }

        if (title.length < 5 || description.length < 20) {
            res.json({
                message: "title must be at 5 characters long, while description must be to least 20 characters long",
                success: false,
            })
        };

        const note = new noteModel({
            title: title,
            description: description,
            author: user.id
        });

        await note.save();

        return res.json({
            message: "Note Created",
            success: true,
            note: note
        })

    } catch (error) {
      return res.json({
        success: false,
        message: `An error occurred why creating a note: ${error.message}`,
        error: error
      }) 
    }
};

async function fetchNotes(req, res, next) {
    try {
        const notes = await noteModel.find().populate("author", "email").exec();
            return res.json({
                message: "Notes",
                count: notes.length,
                success: true,
                notes: notes
            })
    } catch (error) {
      return res.json({
        success: false,
        message: `An error occurred why fetching all notes: ${error.message}`,
        error: error
      }) 
    }
}

async function fetchNote(req, res, next) {
    const { id } = req.params;
    try {
        
        const note = await noteModel.findOne({ _id: id }).populate("author", "-password -timestamps -createdat -updatedat").exec();
        if (!note) {
            return res.json({
                success: false,
                message: 'Note not found',
            })
        }

        return res.json({
            message: "Note",
            success: true,
            note: note
        })
    } catch (error) {
      return res.json({
        success: false,
        message: `An error occurred why fetching note with id ${id}: ${error.message}`,
        error: error
      })
    }
}

async function deleteNote(req, res, next) {
    const { id } = req.params;
    const user = req.user;
    try {
        
        const note = await noteModel.findOne({ _id: id }).populate("author", "_id").exec();

        if(!note) {
            return res.json({
                success: false,
                message: `Note not found`,
            })
        }

        const isAuthor = (user.id.toString() === note.author._id.toString()) ? true : false;

        //check access
        if (!hasWriteAccess(user.user_type) && !isAuthor) {
            res.json({
                message: "access denied, cannot delete someone else note",
                success: false,
            })
        }

        await noteModel.deleteOne({ _id: id }).exec();

        return res.json({
            message: "Note deleted",
            success: true,
            deleted: true
        })
    } catch (error) {
      return res.json({
        success: false,
        message: `An error occurred why deleting note with id ${id}: ${error.message}`,
        error: error
      })
    }
}

function hasWriteAccess(user_type) {
    return ["AUTHOR", "GUEST_AUTHOR"].includes(user_type);
}

module.exports = {
    createNote,
    fetchNote,
    fetchNotes,
    deleteNote,
}