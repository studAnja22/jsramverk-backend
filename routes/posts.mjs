import express from 'express';
const router = express.Router();

import documents from "../models/docs.mjs";
// Adds a new document to the database
router.post("/", async (req, res) => {
    const result = await documents.addOne(req.body);
    const documentId = result.insertedId.toString();

    return res.redirect(`/posts/${documentId}`);
});
// updates an existing document in the database
router.post("/update", async (req, res) => {
    await documents.updateOne(req.body);

    const documentId = req.body["_id"];

    return res.redirect(`/posts/${documentId}`);
});

router.get('/:id', async (req, res) => {
    const docs = await documents.getOne(req.params.id);

    return res.json({
        data: docs
    });
});

router.get('/', async (req, res) => {
    const docs = await documents.getAll();

    return res.json({
        data: docs
    });
});

export default router;
