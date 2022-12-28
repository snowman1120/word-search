let users = [];

const connectSocket = (socketIO) => {
    socketIO.on('connection', (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`) 
        socket.on("connected", function (userId) {
          users[userId] = socket.id;
          console.log(users)
        });
        socket.on("message", data => {
          /** 
          Uncomment to save the messages to the message.json file 
          */

          users[data.id] = data;
        })
    
        // socket.on("typing", data => (
        //   socket.broadcast.emit("typingResponse", data)
        // ))
    
        // socket.on("newUser", data => {
        //   users.push(data)
        //   socketIO.emit("newUserResponse", users)
        // })
     
        socket.on('disconnect', () => {
          console.log('🔥: A user disconnected');
          // users = users.filter(user => user.socketID !== socket.id)
          // socketIO.emit("newUserResponse", users)
          socket.disconnect()
        });
    });
}

module.exports = {
  connectSocket,
  users
}