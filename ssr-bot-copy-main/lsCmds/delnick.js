const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/delnick\b)/i,
    func: async (msg, { cmd, userProfile, convInfo}) => {

        if(convInfo.status === 0) return await msg.error(messages.CONV_NOT_ACTIVATED)
        if (userProfile.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }

        let { userID } = await func.getUserIdForPunishment(msg)
        //console.log(`${ID} + ${status}`)

        if (!userID || userID < 0 || isNaN(userID)) return msg.error('Укажите правильный айди'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.

        await func.setUserNick( msg.peerId, userID, "")
        let rankName = await func.getRankName(userProfile);
        await msg.ok(`@id${userID}(Пользователю) был удалён ник!\nУдалил ник: @id${msg.senderId}(${rankName})`);

    },
    tagWork: 'user',
    rights: 2, // Команда для Админов и выше
    help: '/delnick',
    desc: 'Удалить ник товарищу'
};
