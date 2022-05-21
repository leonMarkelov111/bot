const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/mute\b)/i,
    func: async (msg, {cmd, userProfile}) => {
        if (userProfile.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }

        let vkArray = await vk.api.messages.getConversationMembers({
            peer_id: msg.peerId,
        });
        let { userID, status } = await func.getUserIdForPunishment(msg)

        let time2 = (status ? msg.text.split(' ')[1] : msg.text.split(' ')[2]);
        let time = Number.parseInt(time2);
        let reason = (status ? msg.text.split(' ').slice(2).join(' ') : msg.text.split(' ').slice(3).join(' ')).replace(/\n/g, " ");
        if (!userID || userID < 0 || isNaN(userID)) return msg.error('Укажите правильный айди'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.
        if (!time || time < 1) return msg.error('Укажите время затычки от 1 минуты!');
        if (time > 300) return msg.error('Укажите время затычки до 300 минут!');
        if (!reason || reason.length > 50) return msg.error('Укажите причину затычки длиной не больше 50 символов');


        let {owner, status1} = await func.checkAdminAndOwner(msg, vkArray, userID)
        //console.log(status1)
        if(status1) return await msg.error(`Извини, но данное действие будет стыдно совершить!`)
        //console.log(`${ID} + ${status}`)


        let target = await func.getUserFromMongo(userID, msg.peerId)
        if(userProfile.admin < target.admin && msg.senderId !== owner.member_id) {
            return msg.error(messages.ERROR_MESSAGE_1);
        }
        let rankName = await func.getRankName(userProfile);

        await msg.send(`&#128128; @id${userID}(Пользователю) временно была выдана затычка\nПричина: ${reason}\nВыдал: @id${msg.senderId}(${rankName})`);

        await func.setUserMute(userID, msg.peerId, time);
        await func.setPunishHistory(userID, msg.senderId, msg.peerId, 'mute', reason + ' на ' + time + ' мин')

        /*let banStatus = await func.getUserBan(msg, ID)
        if (banStatus) return msg.error('Этот пользователь уже забанен');
        msg.ok(`@id${ID}(Пользователь) успешно забанен по причине: "${reason}"`);

        await func.setUserBan(msg, ID, reason, 1);
        await func.kickUserFromChat(msg, ID)*/
    },
    work: 1,
    rights: 1, // Команда для Админов и выше
    tagWork: 'chat',
    help: '/mute [@ Пользователь] [время в минутах] [причина]',
    desc: 'Выдать затычку пользователю'
};
