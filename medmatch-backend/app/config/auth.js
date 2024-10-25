module.exports = {

    // access token config
    access_token_secret: '3e9af42de397cfc9387a06972c28c23a1ac7e9a60fb6dc1f05295bc6057baf500672d4a13db5d04ea84bbc4c5679164a7723f3d49f516bb73dc3df6e3b768c8e',
    access_token_expiry: '365d', // 1 year in days
    access_token_cache_expiry: 31536000, // seconds

    // access token config
    refresh_token_secret: '56a6d157ad7d2ee09e480960ae857e528ae546d156f47433b1afad162311c45aa520697b65d13a5c72891f6145ab1f2675886fc124027dc95f86073dd8fe1462',
    refresh_token_expiry: '366d', // 1 year 1 day in days
    refresh_token_cache_expiry: 31622400, // seconds

    // password salt
    password_salt: 10,

    // OTP
    otp: {
        length: 6,
        expiry: 84600, // seconds
    },
};