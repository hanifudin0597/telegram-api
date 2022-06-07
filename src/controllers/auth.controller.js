const bcrypt = require('bcrypt');
const authModel = require('../models/auth.model');
const jwtToken = require('../utils/generateJwtToken');
const { failed, success } = require('../utils/createResponse');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    register: async (req, res) => {
        try {
            const user = await authModel.selectByEmail(req.body.email);
            if (user.rowCount) {
                failed(res, {
                    code: 500,
                    payload: 'Email already exist',
                    message: 'Register Failed',
                });
                return;
            }

            bcrypt.hash(req.body.password, 10, async (err, hash) => {
                if (err) {
                    failed(res, { code: 400, payload: err.message, message: 'failed hash password' })
                }
                authModel.register({
                    id: uuidv4(),
                    ...req.body,
                    hash,
                });
                const user = await authModel.selectByEmail(req.body.email);
                success(res, {
                    code: 200,
                    payload: user.rows[0],
                    message: 'Register Success',
                });

            });
        } catch (error) {
            failed(res, {
                code: 500,
                payload: error.message,
                message: 'Internal Server Error',
            });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await authModel.login(email);

            // jika user ditemukan
            if (user.rowCount > 0) {
                const match = await bcrypt.compare(password, user.rows[0].password);
                // jika password benar
                if (match) {
                    const jwt = await jwtToken({
                        id: user.rows[0].id,
                        username: user.rows[0].username
                    });
                    success(res, {
                        code: 200,
                        payload: user.rows[0],
                        message: 'Login Success',
                        token: {
                            jwt,
                            id: user.rows[0].id,
                            username: user.rows[0].username,
                            photo:user.rows[0].photo
                        },
                    });
                    return;
                }
            }

            failed(res, {
                code: 401,
                payload: 'Wrong Email or Password',
                message: 'Login Failed',
            });
        } catch (error) {
            failed(res, {
                code: 500,
                payload: error.message,
                message: 'Internal Server Error',
            });
        }
    },
}