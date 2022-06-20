const db = require('../config/db');

module.exports = {
    selectById: (id) => new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM users WHERE id=$1',
            [id],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            },
        );
    }),
    listUser: (search) => new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM users  WHERE LOWER(username) LIKE '%${search.toLowerCase()}%'`,
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            },
        );
    }),
    detailUser: (id) => new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM users WHERE id='${id}'`,
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            },
        );
    }),
    updateById: (id, body) => new Promise((resolve, reject) => {
        const { username, phone, bio } = body
        // console.log(username, phone, bio, id)
        db.query(
            `UPDATE users SET username=$1, phone=$2, bio=$3 WHERE id=$4`, [username, phone, bio, id],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            },
        );
    }),
    updatePhoto: (id, photo) => new Promise((resolve, reject) => {
        db.query(
            `UPDATE users SET photo=$1 WHERE id=$2`, [photo, id],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            },
        );
    }),
    destroy: (id) => new Promise((resolve, reject) => {
        db.query(
            `DELETE FROM users WHERE id='${id}' `,
            (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            },
        )
    })
};
