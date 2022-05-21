const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/warn\b)/i,
    func: async(msg, { cmd , userProfile}) => {
        if (userProfile.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }

        let vkArray = await vk.api.messages.getConversationMembers({
            peer_id: msg.peerId,
        });
        let { userID, status } = await func.getUserIdForPunishment(msg)
        let reason = (status ? msg.text.split(' ').slice(1).join(' ') : msg.text.split(' ').slice(2).join(' ')).replace(/\n/g, " ");
        if (!userID || userID < 0 || isNaN(userID)) return msg.error('Укажите правильный индентификатор пользователя!'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.
        if (!reason || reason.length > 50) return msg.error('Укажите причину выдачи предупреждения пользователю длиной не больше 50 символов');


        let { owner, status1 } = await func.checkAdminAndOwner(msg, vkArray, userID)
        if(status1) return await msg.error(`Извини, но данное действие будет стыдно совершить!`)
        let target = await func.getUserFromMongo(userID, msg.peerId)
        if(userProfile.admin <= target.admin && msg.senderId !== owner.member_id) {
            return msg.error(messages.ERROR_MESSAGE_1);
        }

        let banStatus = await func.getUserBan(msg, userID, msg.peerId)
        if (banStatus) return msg.error('Он уже забанен в беседе!');
        await func.addUserWarn(userID, msg.peerId)

        let warnUser = await func.convUserAdd(msg, userID, msg.peerId)
        let rankName = await func.getRankName(userProfile);
        await msg.send(`&#128128; @id${userID}(Пользователь) получил выговор!\nПричина: ${reason}\nВыговор вынес: @id${msg.senderId}(${rankName})\nВ данный момент у пользователя ${warnUser.warns} из 3 выговоров.`);
        let userInfo = func.getUserInfo(msg, userID)
        await func.setPunishHistory(userID, msg.senderId, msg.peerId, 'warn', reason)

        if(warnUser.warns === 3) {
            await msg.send(`&#128128; @id${userID}(Пользователь) получил 3 из 3 выговоров и теперь автоматически он попадает в бан лист!`);
            await func.setUserBan(userID, msg.peerId, "3 из 3 выговоров")
            await func.kickUserFromChat(msg.peerId, userID)
            await func.setPunishHistory(userID, msg.senderId, msg.peerId, 'unwarn', '3/3 выговоров')
            await func.setPunishHistory(userID, msg.senderId, msg.peerId, 'ban', '3/3 выговоров')
        }
    },
    rights: 1, // Команда для Админов и выше
    help: '/warn @user причина',
    desc: 'выдать выговор пользователю'
};
