module.exports = {
    auth_secret: process.env.AUTH_TOKEN_SECRET,
    access_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_secret: process.env.REFRESH_TOKEN_SECRET,
    transfer_verify_secret: process.env.TRANSFER_VERIFY_SECRET,
    verify_secret: process.env.VERIFY_SECRET,
    external_token_secret: process.env.EXTERNAL_DATA_SECRET
}