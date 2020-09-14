module.exports = {
    devServer: {
        proxy: {
            '/user': {
                target: 'http://localhost:8090',
                changeOrigin: true
            },
            '/admin': {
                target: 'http://localhost:8090',
                changeOrigin: true
            },
            '/portal/image': {
                target: 'http://localhost:8090',
                changeOrigin: true
            }
        }
    }
};