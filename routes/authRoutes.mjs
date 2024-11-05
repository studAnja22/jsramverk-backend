import express from 'express';
const router = express.Router();

import auth from "../models/auth.mjs";

router.post("/", async (req, res) => {
    try {
        const result = await auth.register(req.body);

        if (result) {
            return res.status(201).json({
                message: "Added new user"
            });
        }
    } catch (e) {
        console.error("Error adding user:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const result = await auth.login(req.body);

        if (result.data.type == 'fail') {
            return res.status(400).json({ message: result.data.message });
        }

        if (result.data.type == 'success') {
            return res.status(201).json({
                message: result.data.message,
                token: res.data.token,
            });
        }
    } catch (e) {
        console.error("Error logging in...:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
