const express = require('express');
const httpServer = require('http');
app = express();
server = httpServer.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    }
});



const PORT = 4000;
//var io = socketIo(server);
// var io = socketIo(PORT);
//io.listen(PORT);




// io.listen(PORT, () =>{ 
//     console.log("listening on port " + PORT)
// });


server.listen(PORT, () =>{ 
    console.log("listening on port " + PORT )
});

io.on('connection', socket =>{
    console.log("client connected");
    socket.emit("sendingData", "message");
    socket.on("disconnect", () => {
        console.log("client disconnected");
    })
});