const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/ban\b)/i,
    func: async (msg, {cmd, userProfile, convInfo}) => {
        //if(!result) return msg.error('Используй команду правильно.\n\n');
        if(convInfo.status === 0) return await msg.error(messages.CONV_NOT_ACTIVATED)

        if (userProfile.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }


        let vkArray = await vk.api.messages.getConversationMembers({
            peer_id: msg.peerId,
        });

        let { userID, status } = await func.getUserIdForPunishment(msg)

        let reason = (status ? msg.text.split(' ').slice(1).join(' ') : msg.text.split(' ').slice(2).join(' ')).replace(/\n/g, " ");
        if (!userID || userID < 0 || isNaN(userID)) return msg.error('Укажите правильный индентификатор пользователя!'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.
        if (!reason || reason.length > 50) return msg.error('Укажите причину бана пользователя не больше 50 символов');

        let {owner, status1} = await func.checkAdminAndOwner(msg, vkArray, userID)
        if(status1) return await msg.error(`Извини, но данное действие будет стыдно совершить!`)


        let target = await func.getUserFromMongo(userID, msg.peerId)
        if(userProfile.admin <= target.admin && msg.senderId !== owner.member_id) {
            return msg.error(`Осторожней, за такие действия тебя могут и забанить!`);
        }

        //console.log(userProfile)
        let rankName = await func.getRankName(userProfile);

        let banStatus = await func.getUserBan(msg, userID, msg.peerId)
        if (banStatus) return msg.error('Пользователь уже присутствует в базе банов!');

        let result = await func.kickUserFromChat(msg.peerId, userID)
        if(result) {
            await msg.send(`&#128128; @id${userID}(Пользователь) был успешно забанен!\nПричина: ${reason}\nПриговор вынес: @id${msg.senderId}(${rankName})`);
        } else {
            await msg.send(`Ты не сможешь этого сделать!`);
        }
        await func.setUserBan(userID, msg.peerId, reason)
        await func.setPunishHistory(userID, msg.senderId, msg.peerId, 'ban', reason)

    },
    tagWork: 'chat',
    rights: 2, // Команда для Админов и выше
    help: '/ban @user причина',
    desc: 'Забанить игрока'
};
