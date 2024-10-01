import express from 'express';
const router = express.Router();

import documents from "../models/docs.mjs";

// Get all documents
router.get('/', async (req, res) => {
    const docs = await documents.getAll();

    return res.json(docs);
});

// Adds a new document to the database
router.post("/", async (req, res) => {
    const result = await documents.addOne(req.body);
    const documentId = result.insertedId.toString();

    return res.redirect(`/${documentId}`);
    // return res.redirect(`/posts/${documentId}`);// for postman
});

// Get one document
router.get('/:id', async (req, res) => {
    const docs = await documents.getOne(req.params.id);

    return res.json(docs);
});

// updates an existing document in the database
router.post("/update", async (req, res) => {
    await documents.updateOne(req.body);

    const documentId = req.body["_id"];

    return res.redirect(`/${documentId}`);
    // return res.redirect(`/posts/${documentId}`);// for postman
});

// delete a document
router.post("/delete/:id", async (req, res) => {
    const id = req.params.id;

    await documents.deleteOne(id);

    return res.redirect("/");
});

export default router;
