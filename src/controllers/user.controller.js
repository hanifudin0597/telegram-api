const userModel = require('../models/user.model');
const { failed, success } = require('../utils/createResponse');
const deleteFile = require('../utils/deleteFile');


module.exports = {
    list: async (req, res) => {
        try {
            const { search } = req.query
            const searchValue = search || ''
            const user = await userModel.listUser(searchValue);

            success(res, {
                code: 200,
                payload: user.rows,
                message: 'Success get All user',
            });


        } catch (error) {
            failed(res, {
                code: 500,
                payload: error.message,
                message: 'Internal Server Error',
            });
        }
    },
    detail: async (req, res) => {
        try {
            const { id } = req.params

            const checkUser = await userModel.selectById(id)

            if (checkUser.rowCount == 0) {
                failed(res, {
                    code: 404,
                    payload: null,
                    message: `select user with id ${id} not found `,
                });
            }

            const user = await userModel.detailUser(id);

            success(res, {
                code: 200,
                payload: user.rows[0],
                message: 'Success get detail user',
            });


        } catch (error) {
            failed(res, {
                code: 500,
                payload: error.message,
                message: 'Internal Server Error',
            });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;

            const user = await userModel.selectById(id);
            // jika user tidak ditemukan
            if (!user.rowCount) {
                failed(res, {
                    code: 404,
                    payload: `User with Id ${id} not found`,
                    message: 'Update User Failed',
                });
                return;
            }

            // jika update user disertai photo
            const { photo, email } = user.rows[0]; // email tidak boleh diubah
            await userModel.updateById(id, { ...req.body, photo, email });

            success(res, {
                code: 200,
                payload: null,
                message: 'Update User Success',
            });
        } catch (error) {
            failed(res, {
                code: 500,
                payload: error.message,
                message: 'Internal Server Error',
            });
        }
    },
    updatePhoto: async (req, res) => {
        try {
            const { id } = req.params;

            const user = await userModel.selectById(id);
            // jika user tidak ditemukan
            if (!user.rowCount) {
                // menghapus photo jika ada
                if (req.file) {
                    deleteFile(req.file.path);
                }

                failed(res, {
                    code: 404,
                    payload: `User with Id ${id} not found`,
                    message: 'Update User Failed',
                });
                return;
            }

            // jika update user disertai photo
            let { photo } = user.rows[0];
            if (req.file) {
                if (user.rows[0].photo) {
                    // menghapus photo lama
                    deleteFile(`public/${user.rows[0].photo}`);
                }
                // mendapatkan name photo baru
                photo = req.file.filename;
            }
            await userModel.updatePhoto(id, photo);

            success(res, {
                code: 200,
                payload: null,
                message: 'Update User Photo Success',
            });
        } catch (error) {
            failed(res, {
                code: 500,
                payload: error.message,
                message: 'Internal Server Error',
            });
        }
    },
    remove: async (req, res) => {
        try {
            const { id } = req.params

            const user = await userModel.selectById(id);
            // jika user tidak ditemukan
            if (!user.rowCount) {
                // menghapus photo jika ada
                if (req.file) {
                    deleteFile(req.file.path);
                }

                failed(res, {
                    code: 404,
                    payload: `User with Id ${id} not found`,
                    message: 'Update User Failed',
                });
                return;
            }

            await userModel.destroy(id)

            success(res, {
                code: 200,
                payload: null,
                message: 'Success delete user',
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
