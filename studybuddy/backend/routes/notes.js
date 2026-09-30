const express = require("express");
const jwt = require("jsonwebtoken");

const Note = require("../models/Note");

const router = express.Router();


// AUTHENTICATION MIDDLEWARE
const authenticate = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid token"
    });

  }
};


// ADD NOTE
router.post("/", authenticate, async (req, res) => {

  try {

    const { title, subject, content } = req.body;

    if (!title || !subject || !content) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }

    const note = await Note.create({
      title,
      subject,
      content,
      userId: req.userId
    });

    res.status(201).json({
      message: "Note added successfully",
      note
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to add note",
      error: error.message
    });

  }

});


// GET NOTES
router.get("/", authenticate, async (req, res) => {

  try {

    const notes = await Note.find({
      userId: req.userId
    }).sort({
      createdAt: -1
    });

    res.json(notes);

  } catch (error) {

    res.status(500).json({
      message: "Failed to get notes",
      error: error.message
    });

  }

});


// DELETE NOTE
router.delete("/:id", authenticate, async (req, res) => {

  try {

    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    res.json({
      message: "Note deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to delete note",
      error: error.message
    });

  }

});


module.exports = router;