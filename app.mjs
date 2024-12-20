import 'dotenv/config'

const port = process.env.PORT || 1337;
/**---- import packages ----*/
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

//**----models import ------*/
import auth from './models/auth.mjs';

/**---- Socket imports */
import initSocket from './socket/socket.mjs';
import { createServer } from 'node:http';

/**------- Routes import -------*/
import posts from "./routes/posts.mjs";//document routes
import users from './routes/usersRoutes.mjs';//user routes
import authRoutes from "./routes/authRoutes.mjs"; //auth routes
import sendGrid from "./routes/sendGrid.mjs"; // send invites with sendgrid route

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
    const publicRoutes = [
        "/",
        "/auth/login",
        "/auth",
        "/users/register_user",
        "/sendGrid/invite_user"
    ];

    // No token check for public routes
    if (publicRoutes.includes(req.path)) {
        return next();
    }

    // If valid token: function returns next();
    auth.checkToken(req, res, next);
    // next();
});

/**------- Active Routes -------*/
app.use("/posts", posts);
app.use("/users", users);
app.use("/auth", authRoutes);
app.use("/sendgrid", sendGrid);

app.get("/", (req, res) => res.send({ message: "Hello world!" }));

/**------- 404 Error handlers -------*/
// Catch 404 and forward to Error handler
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

/**----- Initialize Socket.io ----- */
const httpServer = createServer(app);

initSocket(httpServer);

/**------- Start up server -------*/
const server = httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

export default server;
