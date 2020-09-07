module.exports = {
    transpileDependencies: ["vuetify"],
    configureWebpack: {
        devtool: "source-map",
    },
    devServer: {
        proxy: 'https://api.viaplanner.ca/',
        port: 8080, 
        host: "0.0.0.0"
    }
};
