const func = require('../src/func');
const messages = require('../message.json');

module.exports = {
    regexp: /^(а?\/kick\b)/i,
    func: async (msg, { cmd, userProfile }) => {
        // console.log(convInfo.convInfo.status)
        if (userProfile.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }
        let vkArray = await vk.api.messages.getConversationMembers({
            peer_id: msg.peerId,
        });

        let { userID, status } = await func.getUserIdForPunishment(msg)
        let reason = (status ? msg.text.split(' ').slice(1).join(' ') : msg.text.split(' ').slice(2).join(' ')).replace(/\n/g, " ");
        if (!userID || userID < 0 || isNaN(userID)) return msg.error('Укажите правильный индентификатор пользователя!'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.
        if (!reason || reason.length > 50) return msg.error('Укажите причину кика не больше 50 символов');

        let {owner, status1} = await func.checkAdminAndOwner(msg, vkArray, userID)
        if(status1) return await msg.error(`Извини, но данное действие будет стыдно совершить!`)


        let target = await func.getUserFromMongo(userID, msg.peerId)
        if(userProfile.admin <= target.admin  && msg.senderId !== owner.member_id) {
            return msg.error(messages.ERROR_MESSAGE_1);
        }

        //console.log(userProfile)
        let rankName = await func.getRankName(userProfile);

        let result = await func.kickUserFromChat(msg.peerId, userID)
        if(result) {
            await msg.send(`&#128128; @id${userID}(Пользователь) успешно кикнут с беседы!\nПричина: ${reason}\nПриговор вынес: @id${msg.senderId}(${rankName})`);
        } else {
            await msg.send(`Ты не сможешь этого сделать!`);
        }
        await func.setChatModerator(msg.peerId, userID, 0)
        await func.setPunishHistory(userID, msg.senderId, msg.peerId, 'kick', reason)

    },
    tagWork: 'chat',
    rights: 1, // Команда для Админов и выше
    help: '/kick @user причина',
    desc: 'Выгнать пользователя с беседы'
};
