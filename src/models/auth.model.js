const { reject } = require('bcrypt/promises');
const db = require('../config/db');

module.exports = {
    register: (body) => new Promise((resolve, reject) => {
        const {
            id,
            email,
            hash,
            username = '',
            phone = '',
            bio = '',
            photo = ''
        } = body;

        db.query(
            'INSERT INTO users (id, email, password, username, phone, bio, photo) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [
                id,
                email,
                hash,
                username,
                phone,
                bio,
                photo
            ],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            },
        );
    }),
    login: (email) => new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM users WHERE email=$1',
            [email],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            },
        );
    }),
    selectByEmail: (email) => new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM users WHERE email=$1',
            [email],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            },
        );
    }),
};
