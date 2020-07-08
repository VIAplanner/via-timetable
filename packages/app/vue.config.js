module.exports = {
    transpileDependencies: ["vuetify"],
    configureWebpack: {
        devtool: "source-map",
    },
    devServer: {
        proxy: 'http://api.viaplanner.ca/',
    }
};
