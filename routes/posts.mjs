import express from 'express';
const router = express.Router();

import documents from "../models/docs.mjs";
import auth from '../models/auth.mjs';

// Get all documents
router.get('/', async (req, res) => {
    try {
        const docs = await documents.getAll();

        return res.json(docs);
    } catch (e) {
        console.error("Error trying to fetch documents:", e);
    }
});

// Get user documents
router.get('/get_documents', async (req, res) => {
    try {
        const docs = await documents.getUsersDocuments();

        return res.json(docs);
    } catch (e) {
        console.error("Error trying to fetch documents:", e);
    }
});

// Adds a new document to the database
router.post("/", async (req, res) => {
    try {
        await documents.addOne(req.body, res);

        return res.status(201).json({
            message: "Document added successfully"
        });
    } catch (e) {
        console.error("Error adding new document:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get jwt token
router.get("/token", (req, res) => {
    if (auth.token) {
        return res.json({
            message: "Token found",
            token: auth.token,
            user: auth.user
        });
    }

    return res.status(404).json({
        message: "Token not found",
        token: ""
    });
})

// Get one document
router.get('/:id', async (req, res) => {
    try {
        const docs = await documents.getOne(req.params.id);

        return res.json(docs);
    } catch (e) {
        console.error("Error trying to fetch document with that id:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// updates an existing document in the database
router.post("/update", async (req, res) => {
    try {
        await documents.updateOne(req.body);

        const documentId = req.body["_id"];

        return res.json({ message: "Document updated successfully", id: documentId });
    } catch (e) {
        console.error("Error trying to update document:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    
});

// updates an existing document in the database
router.post("/update_collaborator", async (req, res) => {
    try {
        const userExists = await documents.addCollaborator(req.body);

        if (userExists) {
            return res.json({ message: "User already invited"});//User is already in allowed_users
        }
        const documentId = req.body["_id"];

        return res.json({ message: "Collaborator has been invited to edit the document.", id: documentId });
    } catch (e) {
        console.error("Error trying to add collaborator:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Removes a collaborator from allowed_users
router.delete("/remove_collaborator", async (req, res) => {
    try {
        const userExists = await documents.removeCollaborator(req.body);

        if (!userExists) {
            return res.status(404).json({ message: "User not found in this collaboration"});//user not in allowed_users
        }
        const documentId = req.body["_id"];

        return res.json({ message: "User has been removed from document.", id: documentId });
    } catch (e) {
        console.error("Error trying to remove collaborator:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// delete a document
router.post("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;

        await documents.deleteOne(id);

        return res.json({ message: "Document deleted successfully", id: id });
    } catch (e) {
        console.error("Error trying to delete document:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    
});

export default router;
