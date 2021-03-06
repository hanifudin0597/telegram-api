const { store, list, deleteChat } = require('../models/chat.model')

module.exports = (io, socket) => {
    socket.on('ping', (data) => {
        socket.emit('ping-response', data)
    })
    socket.on('join-room', (data) => {
        // join ke ruangan sendiri
        const { id, email, password, username } = data
        socket.join(id)
    })
    socket.on('send-message', (data) => {
        store(data)
            .then(async () => {
                // kirim pesan ke ruangan orang lain
                const listChat = await list(data.sender, data.receiver)
                io.to(data.receiver).emit("send-message-response", listChat.rows)
            })
            .catch((err) => {
                console.log(err)
            })
    })
    socket.on('chat-history', async (data) => {
        const listChat = await list(data.sender, data.receiver)
        io.to(data.sender).emit("send-message-response", listChat.rows)
    })
    socket.on('delete-message', async (data) => {
        const { sender, receiver, chatId } = data;
        
        deleteChat(chatId)
            .then(async () => {
                const listChat = await list(sender, receiver)
                io.to(receiver).emit('send-message-response', listChat.rows);
                io.to(receiver).emit('send-message-response', listChat.rows);
            })
            .catch((err) => {
                console.log(err)
            })
    })
}