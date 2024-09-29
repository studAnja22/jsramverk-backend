import express from 'express';
const router = express.Router();

// Testing routes with method
router.get("/user", (req, res) => {
    res.json({
        data: {
            msg: "Got a GET request, sending back default 200"
        }
    });
});

router.post("/user", (req, res) => {
    res.status(201).json({
        data: {
            msg: "Got a POST request, sending back 201 Created"
        }
    });
});

router.put("/user", (req, res) => {
    // PUT requests should return 204 No Content
    res.status(204).send();
});

router.delete("/user", (req, res) => {
    // DELETE requests should return 204 No Content
    res.status(204).send();
});

export default router;
