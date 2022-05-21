const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/unmute\b)/i,
    func: async (msg, { cmd , userProfile}) => {
        if (userProfile.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }
        let { userID } = await func.getUserIdForPunishment(msg)

        if (!userID || userID < 0 || isNaN(userID)) return msg.error('Укажите правильный индентификатор пользователя!'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.

        let target = await func.getUserFromMongo(userID, msg.peerId)
        if(userProfile.admin < target.admin) {
            return msg.error(messages.ERROR_MESSAGE_1);
        }

        //console.log(userProfile)
        let rankName = await func.getRankName(userProfile);

        await msg.ok(`@id${userID}(Пользователь) был амнистирован и с него снята затычка!\nРешение принял: @id${msg.senderId}(${rankName})`);

        await func.setUserUnMute(userID, msg.peerId)
        await func.deleteUserMuteWarn(userID, msg.peerId)
        await func.setPunishHistory(userID, msg.senderId, msg.peerId, 'unmute', 'unmute')
    },
    tagWork: 'chat',
    rights: 1, // Команда для Админов и выше
    help: '/unmute @user',
    desc: 'Снять затычку'
};
