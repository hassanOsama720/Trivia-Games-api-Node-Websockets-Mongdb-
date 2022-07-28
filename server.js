require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const http = require('http');
const server = http.createServer(app);
const { WebcastPushConnection } = require('tiktok-live-connector');

const { Server } = require("socket.io");
const io = new Server(server,{
  cors: {
      origin: '*'
  }});


app.use(cors());

io.on('connection', (socket) => {
  let tiktokUsername = process.env.USER_NAME;
  
  // Create a new wrapper object and pass the username
  let tiktokChatConnection = new WebcastPushConnection(tiktokUsername);
  
  // Connect to the chat (await can be used as well)
  tiktokChatConnection.connect().then(state => {
    console.info(`Connected to roomId ${state.roomId}`);
  }).catch(err => {
    console.log('Failed to connect', err);
    socket.emit("chat",err);
  })
  
  // Define the events that you want to handle
  // In this case we listen to chat messages (comments)
  tiktokChatConnection.on('chat', data => {
    // console.log(data)
    socket.emit("chat",data);
  })
});



app.use(bodyParser.json());

app.use(morgan("tiny"));

//CORS
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Methods",
    "GET,POST,DELETE,PUT,OPTIONS"
  );
  response.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

//Connect to DB
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch(() => {
    console.log("DB Error.");
  });

// To port
server.listen(process.env.PORT || 8080);

//Import Routes
const userRouter = require("./routes/userRouter");
const questionRouter = require("./routes/questionRouter");


app.use(questionRouter);
app.use(userRouter);



//Not found MW
app.use((request, response) => {
  response.status(404).json({ data: "Not Found" });
});

//Error MW
app.use((error, request, response, next) => {
  //JS  code function.length
  let status = error.status || 500;
  response.status(status).json({ Error: error + "" });
});