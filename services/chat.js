const Chat = require('../models/chat'); 
const ChatMessages = require('../models/chatmessage'); 
const ChatRoom = require('../models/chatRoom'); 
const ChatRoomMembers = require('../models/chatroommembers'); 


class ChatService {
    async createRoom(name) {
        try {
            const roomExist = await ChatRoom.findOne({ where: {name:name}})
            // Create a new chatroom
            if (roomExist)
            {
                throw new Error('room name already Exists');
            }
            else 
            {
               
                const room = await ChatRoom.create({
                    name,
                   
                });
    
                return {room};
                

            }
            


        } catch (error) {
            console.log(error)
            throw new Error('Error creating room');
        }
    }

    async deleteRoom(name) {
        try {
            const roomExist = await ChatRoom.findOne({ where: {name:name}})
            // Create a new chatroom
            if (roomExist)
            {
                await roomExist.destroy();
                
            }
            else 
            {
               
                throw new Error('room name does not Exists');
               
            }
            


        } catch (error) {
            console.log(error)
            throw new Error('Error deleting room');
        }
    }

    async joinRoom(username,chatname) {
        try {
            const roomExist = await ChatRoomMembers.findOne({ where: { username:username, chatroomName: chatname}})
            // Create a new chatroom
            if (roomExist)
            {
                throw new Error('you are already in the group');
                
            }
            else 
            {
               
                const room = await ChatRoomMembers.create({
                    username,
                    chatroomName:chatname
                   
                });
    
                return {room};
               
            }
            


        } catch (error) {
            console.log(error)
            throw new Error('Error joining room');
        }
    }

    async leaveRoom(username,chatname) {
        try {
            const roomExist = await ChatRoomMembers.findOne({ where: { username:username, chatroomName: chatname}})
            // Create a new chatroom
            if (roomExist)
            {
                await roomExist.destroy();
                
            }
            else 
            {
               
               

                throw new Error('Room does not exist');
               
            }
            


        } catch (error) {
            console.log(error)
            throw new Error('Error leaving room');
        }
    }

    async message(username,chatname) {
        try {
            const roomExist = await ChatRoom.findOne({ where: { chatroomName: chatname}})
            // Create a new chatroom
            if (roomExist)
            {
               
                const room = await ChatMessages.create({
                    username,
                    roomName:chatname
                   
                });
    
                return {room};
            }
            else 
            {
               
                throw new Error('Room does not exist');
               
            }
            


        } catch (error) {
            console.log(error)
            throw new Error('Error sending message room');
        }
    }

   
    async findMessage(sender) {
        try{
            const messages = await Chat.findAll({ where: { receiver: sender } })

            return  messages ;

        }catch(error)
        {
            throw error;
        }
    }

    async findGroupMessage(sender) {
        try{
            const rooms = await ChatRoomMembers.findAll({ where: { username: sender } });
            if(rooms.length > 0)
            {

            const groups = rooms.map((rooms) => { 
                
             const { chatroomName } = rooms.dataValues;
                
             return chatroomName;
            });
           
            const messages = [];

            for (const group of groups) {
                

                const message = await ChatMessages.findAll({ where : { roomName: group}})

               // console.log(message)
                messages.push(message)
               
          
           

            }
            
            const flattenedMessages = [].concat(...messages);
           
             return flattenedMessages;
            }

            return  'You belong to no groups' ;

        }catch(error)
        {
            throw error;
        }
    }


}

module.exports = new ChatService();
