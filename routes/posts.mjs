import express from 'express';
const router = express.Router();

import documents from "../models/docs.mjs";
import auth from '../models/auth.mjs';
import { ObjectId } from 'mongodb';

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
    let token = req.headers['x-access-token'];
    
    if (token) {
        return res.json({
            message: "Token found",
            token: token,
            user: auth.user
        });
    }

    return res.status(401).json({
        message: "Token not found",
        token: "",
        user: ""
    });
})

// Get one document
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ 
            message: "Invalid id format. id must be 24 characters",
            id: id
        });
    }

    try {
        const foundDocument = await documents.getOne(id);
        if (foundDocument) {
            return res.json(foundDocument);
        }
        return res.status(404).json({
            message: "Document not found", 
            id: id 
        });
    } catch (e) {
        console.error("Error trying to fetch document with that id:", e);
        return res.status(500).json({ 
            message: "Internal Server Error" 
        });
    }
});

// updates an existing document in the documents database
router.post("/update", async (req, res) => {
    const id = req.body["_id"];

    try {
        const result = await documents.updateOne(req.body);

        //Check if we made any updates
        const matchedCount = result.matchedCount;
        const modifiedCount = result.modifiedCount;

        if (matchedCount > 0 && modifiedCount > 0) {
            return res.status(200).json({ 
                message: "Document updated successfully", 
                id: id
            });
        } else if (matchedCount > 0 && modifiedCount === 0) {
            return res.status(200).json({ 
                message: "No changes were made.", 
                id: id
            });
        } else {
            return res.status(404).json({ 
                message: "Document was not found.", 
                id: id
            });
        }
    } catch (e) {
        console.error("Error trying to update document:", e);
        return res.status(404).json({ 
            message: "Invalid id"
        });
    }
    
});

// updates and adds a user to allowed_users in the users database
router.post("/update_collaborator", async (req, res) => {
    try {
        const userExists = await documents.addCollaborator(req.body);

        if (userExists) {
            return res.json({ message: "User already invited"});//User is already in allowed_users
        }
        const documentId = req.body["_id"];
        // Send invite with sendgrid!
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
