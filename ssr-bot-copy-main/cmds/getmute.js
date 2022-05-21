const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/getmute\b)/i,
    func: async (msg, {cmd, userProfile, convInfo}) => {

        if(convInfo.status === 0) return await msg.error(messages.CONV_NOT_ACTIVATED)
        if (userProfile.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }

        let { userID } = await func.getUserIdForPunishment(msg)

        if (!userID || userID < 0 || isNaN(userID)) return msg.error('Укажите правильный айди'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.

        let target = await func.getUserFromMongo(userID, msg.peerId)
        let targetInfo = await func.getUserInfo(msg, userID)

        if(target.mute === true) {
            return await msg.ok(`Выписка из личного дела @id${userID}(${targetInfo[0].first_name} ${targetInfo[0].last_name})\n✯ Есть ли затычка у пользователя: Да!\n✯ Затычка будет снята с пользователя через ${target.muteTime} мин.`)
        } else {
            return await msg.ok(`Выписка из личного дела @id${userID}(${targetInfo[0].first_name} ${targetInfo[0].last_name})\n✯ Есть ли у пользователя затычка: Нет!`)

        }
    },
    work: 1,
    rights: 1, // Команда для Админов и выше
    tagWork: 'chat',
    help: '/getmute @user',
    desc: 'Узнать время затычки'
};
