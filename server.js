const FlightData = require('./FlightData');

const prompt = require('prompt');

const express = require('express');
const httpServer = require('http');
// const { resolve } = require('path');
app = express();
server = httpServer.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    }
});

const PORT = 4000;

var schema = {
    properties: {
        Altitude: {
            conform: function(input) {
                return input >= 0 && input <= 3000;
            },
            message: "Altitude must be in range of 0 to 3000",
            required: true
        },
        HIS: {
            conform: function(input) {
                return input >= 0 && input <= 360;
            },
            message: "HIS must be in range of 0 to 360",
            required: true
        },
        ADI: {
            conform: function(input) {
                return input >= -100 && input <= 100;
            }, 
            message: "ADI must be in range of -100 to 100",
            required: true
        }
    }
}; 

prompt.start();

/**
 * gets validated input from the the prompt and returns it with a promise
 */
const InputData = () => {
    return new Promise((resolve, reject) => {
        prompt.get(schema, function (err, result) {
            if (err) {
                console.log(err);
                reject();
            }
            else {
                resolve(new FlightData(result.Altitude, result.HIS, result.ADI));
            }
        });
    })
}

/**
 * the server listen on the PORT and waits for clients
 */
server.listen(PORT, () =>{ 
    console.log("listening on port " + PORT )
});

/**
 * gets a client when he connects.
 * always gets input from the prompt and send the the client
 */
io.on('connection', async (socket) =>{
    console.log("client connected");

    socket.on("disconnect", () => {
        console.log("client disconnected");
    })

    while (true) {
        const flightData = await InputData();
        console.log("finished getting prompt data");
        socket.emit("sendingData", flightData);
    }

});
