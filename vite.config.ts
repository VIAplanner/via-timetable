import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import tailwindcss from '@tailwindcss/vite'
import checker from 'vite-plugin-checker'

import path from 'path'

export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
        Components({
            resolvers: [
                PrimeVueResolver()
            ]
        }),
        checker({ vueTsc: true })
    ],
    resolve: {
        alias: [
            { find: '@', replacement: path.resolve(__dirname, './src') }
        ]
    },
    server: {
        proxy: {
            '/api': {
                target: 'https://api.viaplanner.ca/',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '')
            }
        },
        port: 8080,
        host: '0.0.0.0'
    },
    build: {
        sourcemap: true
    }
});