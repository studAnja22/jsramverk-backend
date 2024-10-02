import express from 'express';
const router = express.Router();

import documents from "../models/docs.mjs";

// Get all documents
router.get('/', async (req, res) => {
    try {
        const docs = await documents.getAll();

        return res.json(docs);
    } catch (e) {
        console.error("Error trying to fetch documents:", e);
    }
    
});

// Adds a new document to the database
router.post("/", async (req, res) => {
    try {
        const result = await documents.addOne(req.body);
        const documentId = result.insertedId.toString();

        const newDocument = await documents.getOne(documentId);

        return res.status(201).json({
            message: "Document added successfully",
            document: newDocument
        });
    } catch (e) {
        console.error("Error adding new document:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

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
