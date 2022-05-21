const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/bl\b)/i,
    func: async (msg, {cmd}) => {
        let userProfile = await func.getAdminBot(msg.senderId)
        if (userProfile.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }

        let { userID } = await func.getUserIdForPunishment(msg)

        if (!userID || userID < 0 || isNaN(userID)) return msg.error('Укажите правильный индентификатор пользователя!'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.


        let target = await func.getAdminBot(userID)
        if(target.admin !== undefined) {
            if(userProfile.admin <= target.admin) {
                return msg.error(messages.ERROR_MESSAGE_1);
            }
        }


        target = await func.checkUserInBlackList(userID)
        let targetInfo = await func.getUserInfo(msg, userID)
        if (!target) return msg.error('Пользователь не найден в ЧС!');

        await msg.send(`Информация о ЧС @id${userID}(${targetInfo[0].first_name} ${targetInfo[0].last_name})\nПричина ЧС: ${target.reason}\nЗанёс: @id${target.giverID}`)
    },
    tagWork: 'user',
    rights: 2, // Команда для Админов и выше
    help: '/getbl @user',
    desc: 'Узнать информацию о ЧС пользователя'
};
