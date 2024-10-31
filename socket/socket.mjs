/**------- Sockets created by Emelie -------*/
import { Server } from 'socket.io';
import documents from '../models/docs.mjs';

let timeout;

function initSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
    socket.on("join_room", (room) => {
        socket.join(room);
    });

    socket.on("content", (data) => {
        //io.emit("content", data);
        io.to(data["_id"]).emit("content", data);

        clearTimeout(timeout);

        timeout = setTimeout(() => {
            console.log("spara data");
            documents.updateOne(data);
        }, 2000);
    });

    socket.on('disconnect', () => {
        console.log("Disconnected");
    });
});
}

export default initSocket;
