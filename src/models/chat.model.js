const db = require('../config/db')
const { v4: uuidv4 } = require('uuid');


module.exports = {
    store: (data) => {
        // const { sender, receiver, chat } = data
        return new Promise((resolve, reject) => {
            const {
            id=uuidv4(),
            sender = '',
            receiver = '',
            chat = '',
            date= new Date()
        } = data;
            db.query(`
        INSERT INTO chats (id, sender, receiver, chat, date)
        VALUES ($1, $2, $3, $4, $5)`, [id, sender, receiver, chat, date] , (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        })
    },
    list: (sender, receiver) => {
        return new Promise((resolve, reject) => {
            db.query(`
            SELECT chats.id, chats.chat, userSender.username AS sender, userReceiver.username AS receiver FROM chats 
            LEFT JOIN users AS userSender ON chats.sender=userSender.id
            LEFT JOIN users AS userReceiver ON chats.receiver=userReceiver.id
            WHERE
            (sender='${sender}' AND receiver='${receiver}')
            OR
            (sender='${receiver}' AND receiver='${sender}')

        `, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        })
    }
}