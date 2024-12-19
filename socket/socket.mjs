/**------- Sockets created by Emelie -------*/
import { Server } from 'socket.io';
import documents from '../models/docs.mjs';

let timeout;

function initSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "https://www.student.bth.se",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('Connection from origin:', socket.handshake.headers.origin);

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
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
