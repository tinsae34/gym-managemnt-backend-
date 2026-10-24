import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3001,
        host: true,
        allowedHosts: [
            'flavoring-backspace-ascent.ngrok-free.dev',
            '.ngrok-free.dev',
            '.ngrok.io',
            '.loca.lt'
        ]
    }
})
