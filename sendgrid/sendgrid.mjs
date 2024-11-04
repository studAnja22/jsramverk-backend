import 'dotenv/config'

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mail = {
    //Invite a friend to join by email
    invite: async function invite(body) {
        const msg = {
            to: body.email,
            from: process.env.SENDGRID_EMAIL,
            subject: "Let's work together! A document has been added to your inventory",
            text: "You've been invited to edit a document. Sign in and join the fun of editing documents live with your friends.",
            html: `<a href="${process.env.HOMEPAGE_URL}">Register here.</a>`,
        };

        try {
            await sgMail.send(msg);
        } catch (error) {
            console.error(error)
        }
    }
}

export default mail;
