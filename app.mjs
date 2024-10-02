import 'dotenv/config'

const port = process.env.PORT || 1337;;

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

/**------- Routes import -------*/
import posts from "./routes/posts.mjs";//document routes
import testRoutes from "./routes/testRoutes.mjs";
import hello from "./routes/hello.mjs";

/**------- Express settings -------*/
const app = express();

app.disable('x-powered-by');

app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(), "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

/**-- Middleware - called for all routes --*/
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

/**------- Active Routes -------*/
app.use("/posts", posts);
app.use("/testRoutes", testRoutes);
app.use("/hello", hello);

app.get("/", (req, res) => res.send({ message: "Hello world!" }));

/**------- Error handlers -------*/
// Add routes for 404 and error handling
// Catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// Error handler - get 404 error message in json
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});

/**------- Start up server -------*/
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
