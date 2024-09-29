import express from 'express';
const router = express.Router();

router.get('/', function(req, res, next) {
    const data = {
        data: {
            msg: "Hello World"
        }
    };

    res.json(data);
});

router.get("/:msg", (req, res) => {
    console.log("Request params: ", req.params);
    const data = {
        data: {
            msg: req.params.msg
        }
    };

    res.json(data);
});

export default router;
