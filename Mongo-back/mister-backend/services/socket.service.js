var gIo = null
const ObjectId = require('mongodb').ObjectId
const dbService = require('../services/db.service')
async function setupSocketAPI(http) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*'
        }
    })

    const collection = await dbService.getCollection('msg')
    gIo.on('connection', socket => {
        socket.on('set_user_socket',user=>{
            socket.userId = user._id
            socket.fullname = user.fullname
        })
        socket.on('socket_send_msg', msg => {
            collection.insertOne({...msg,from:socket.fullname})

            gIo.to(socket.myTopic).emit('socket_add_msg', msg)
        })
        socket.on('socket_set_topic', async (topic) => {
            const criteria = { topic }
            const msgs = await collection.find(criteria).toArray()
            socket.emit('socket_set_topic_msgs', msgs)
            if (socket.myTopic === topic) return
            if (socket.myTopic) socket.leave(socket.myTopic)
            socket.join(topic)
            socket.myTopic = topic

        })

        socket.on('socket_typing', async (isTyping) => {
            const user = await getUserSocket(socket.userId)
            if (isTyping) {
                // gIo.to(socket.myTopic).emit('start_typing', {isTyping,fullname:user.fullname})
                socket.broadcast.to(socket.myTopic).emit('start_typing', {isTyping,fullname:user.fullname})
            }
            else
            gIo.to(socket.myTopic).emit('stop_typing', false)
        })

      


    })
    async function getUserSocket(userId) {
        const sockets = await _getAllSockets()
        const socket = sockets.find(s => s.userId === userId)
        return socket
    }

    async function _getAllSockets() {
        const sockets = await gIo.fetchSockets()
        return sockets
    }


}
module.exports = {
    setupSocketAPI
}