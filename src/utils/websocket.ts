import { io } from 'socket.io-client'
import { WS_URL } from '../../config'

export const socket = io(WS_URL)

socket.on('connect', () => {
    console.log('connected to websocket server')
})

socket.on('disconnect', () => {
    console.log('disconnected from websocket server')
})