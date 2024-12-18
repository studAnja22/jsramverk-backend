import express from 'express';
const router = express.Router();

import users from '../models/users.mjs';

router.get('/', async (req, res) => {
    try {
        const allUsers = await users.getAll();

        return res.json(allUsers);
    } catch (e) {
        console.error("Error trying to fetch users:", e);
    }
});

// localhost:1337/users/
router.post("/register_user", async (req, res) => {
    try {
        const result = await users.register(req.body);

        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        if (result) {
            return res.status(201).json({
                message: "Successfully registered new user."
            });
        }
    } catch (e) {
        console.error("Error adding user:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
//Deletes the user, all their documents and removes them from any collaborations
router.post("/deregister_user", async (req, res) => {
    try {
        await users.deregister(req, res);
    } catch (e) {
        console.error("Error occurred while deregister the user:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
