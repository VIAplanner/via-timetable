module.exports = {
    transpileDependencies: ["vuetify"],
    configureWebpack: {
        devtool: "source-map",
    },
    devServer: {
        proxy: 'https://api.viaplanner.ca/',
    }
};
