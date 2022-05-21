const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/unwarn\b)/i,
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

        let warnStatus = await func.getUserWarns(msg, userID, msg.peerId)
        if (!warnStatus) return msg.error('У пользователя нет активных выговоров!');
        await msg.ok(`@id${userID}(Пользователь) был амнистирован и с него снят выговор!\nРешение принял: @id${msg.senderId}(${rankName})`);

        await func.setUserUnBan(userID, msg.peerId)
        await func.setPunishHistory(userID, msg.senderId, msg.peerId, 'unwarn', '')
    },
    tagWork: 'chat',
    rights: 1, // Команда для Админов и выше
    help: '/unwarn @user',
    desc: 'Убрать выговор пользователю'
};
