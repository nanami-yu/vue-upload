module.exports = {
    outputDir : 'dist',
    assetsDir : 'assets',
    lintOnSave : false,
    devServer: {
        open : true,
        host : "0.0.0.0",
        port : "8081",
        https : false,
        hotOnly : true,
        proxy : {
            '/api' : {
                target : 'http://localhost:8080',
                changeOrigin : true,
                // pathRewrite : {
                //     '^/api' : ''
                // }
            }
        }
    }
}