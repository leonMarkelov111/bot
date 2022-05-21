const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/unban\b)/i,
    func: async (msg, { cmd , userProfile}) => {
        if (userProfile.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }
        let { userID, status } = await func.getUserIdForPunishment(msg)

        let reason = (status ? msg.text.split(' ').slice(1).join(' ') : msg.text.split(' ').slice(2).join(' ')).replace(/\n/g, " ");
        if (!userID || userID < 0 || isNaN(userID)) return msg.error('Укажите правильный индентификатор пользователя!'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.
        if (!reason || reason.length > 50) return msg.error('Укажите причину признания гражданина врагом народа длиной не больше 50 символов');

       // console.log(userProfile)
        let rankName = await func.getRankName(userProfile);

        let banStatus = await func.getUserBan(msg, userID, msg.peerId)
        if (!banStatus) return msg.error('Пользователь не найден в бан листе!');
        await msg.ok(`@id${userID}(Пользователь) был амнистирован и с него снят бан!\nПричина: ${reason}\nРешение принял: @id${msg.senderId}(${rankName})`);

        await func.setUserUnBan(userID, msg.peerId)
        await func.setPunishHistory(userID, msg.senderId, msg.peerId, 'unban', reason)
    },
    tagWork: 'chat',
    rights: 2, // Команда для Админов и выше
    help: '/unban @user причина',
    desc: 'Вынести из бан-листа'
};
