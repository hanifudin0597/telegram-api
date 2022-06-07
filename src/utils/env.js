require('dotenv').config();

module.exports = {
    APP_NAME: process.env.APP_NAME || 'My App',
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3005,
    API_URL: process.env.API_URL,
    CLIENT_URL: process.env.CLIENT_URL,
    // database
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    // jwt
    JWT_SECRET: process.env.JWT_SECRET,
}