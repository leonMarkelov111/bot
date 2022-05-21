const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/getwarns\b)/i,
    func: async (msg, {cmd, userProfile}) => {
        if (userProfile.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }

        let { userID } = await func.getUserIdForPunishment(msg)

        if (!userID || userID < 0 || isNaN(userID)) return msg.error('Укажите правильный айди'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.

        let target = await func.getUserFromMongo(userID, msg.peerId)
        let targetInfo = await func.getUserInfo(msg, userID)

        return await msg.ok(`Выписка из личного дела @id${userID}(${targetInfo[0].first_name} ${targetInfo[0].last_name})\n✯ Количество выговоров: ${target.warns} из 3!`)
    },
    work: 1,
    rights: 1, // Команда для Админов и выше
    tagWork: 'chat',
    help: '/getwarns @user',
    desc: 'Узнать выговоры пользователя'
};
