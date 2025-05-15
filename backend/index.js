require("dotenv").config();

const config=require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const express = require('express');
const cors = require('cors');
const app = express();

const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./utilities")
const User = require("./models/user.model");
const Note = require("./models/note.model");

app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.get("/", (req,res)=>{
    res.json({data:"hello"});
});

//Create Account
app.post("/create-account", async(req,res)=>{
    try {
        const { fullName, email, password } = req.body;

        // Validate required fields
        if (!fullName || !email || !password) {
            return res.status(400).json({
                error: "Please provide all required fields: fullName, email, and password"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: "User with this email already exists"
            });
        }

        // Create new user
        const newUser = new User({
            fullName,
            email,
            password // Note: In a production app, you should hash the password
        });

        await newUser.save();
        const accessToken=jwt.sign({userId: newUser._id},process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"3600m",
        });
        return res.status(201).json({
            message: "Account created successfully",
            error:false,
            accessToken,
            user: {
                fullName: newUser.fullName,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Error creating account:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

//Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                error: "Please provide both email and password"
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        // Verify password (Note: In production, use proper password hashing)
        if (user.password !== password) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        // Generate JWT token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "3600m" }
        );

        return res.status(200).json({
            message: "Login successful",
            error: false,
            accessToken,
            user: {
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

//Create Note
app.post("/add-note", authenticateToken, async (req, res) => {
        const { title, content, tags } = req.body;
        const userId = req.user.userId;

        if(!title){
            return res.status(400).json({
                error: "Title is required"
            });
        }
        if(!content){
            return res.status(400).json({
                error: "Content is required"
            });
        }

        try{
            const newNote = new Note({
                title,
                content,
                tags: tags || [],
                userId: userId,
            });

        await newNote.save();

        return res.status(201).json({
            error:false,
            message: "Note added successfully",
            note: newNote,
        });
    } catch (error) {
        console.error("Error adding note:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//edit note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const {title, content, tags, isPinned} = req.body;
    const {userId} = req.user;

    if(!title && !content && !tags){
        return res.status(400).json({
            error: "No changes made"
        });
    }

    try{
        const note = await Note.findOne({_id: noteId, userId});

        if(!note){
            return res.status(404).json({
                error: "Note not found"
            });
        }

        if(title){
            note.title = title;
        }
        if(content){
            note.content = content;
        }
        if(tags){
            note.tags = tags;
        }
        if(isPinned){
            note.isPinned = isPinned;
        }
        
        await note.save();

        return res.status(200).json({
            error: false,
            message: "Note updated successfully",
            note: note,
        });
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ error: "Internal server error" });
    }
        
        
});

//get all notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
    const {userId} = req.user;

    try{
        const notes = await Note.find({userId}).sort({isPinned: -1});

        return res.status(200).json({
            error: false,
            message: "Notes fetched successfully",
            notes: notes,
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});

//delete note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const {userId} = req.user;

    try{
        const note = await Note.findOne({_id: noteId, userId});
        
        if(!note){
            return res.status(404).json({
                error: "Note not found"
            });
        }

        await Note.deleteOne({_id: noteId, userId});

        return res.status(200).json({
            error: false,
            message: "Note deleted successfully",
        });
        
        
    }catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});

app.listen(8000);

module.exports = app;

