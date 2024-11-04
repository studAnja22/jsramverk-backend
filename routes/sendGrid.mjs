import 'dotenv/config'

import mail from '../sendgrid/sendgrid.mjs';
import express from 'express';
const router = express.Router();

router.post("/invite_user", async (req, res) => {
    mail.invite(req.body);
});

export default router;
