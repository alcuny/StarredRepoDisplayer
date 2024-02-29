/*module.exports = {
    devServer: {
        proxy: {
            "/api/*": {
                target: "http://localhost:3000",
                secure: false
            }
        }
    }
};*/

module.exports = {
    devServer: {
    proxy: 'https://github.com/login/oauth/',
    }
    }