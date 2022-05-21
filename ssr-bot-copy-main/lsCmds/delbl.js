const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/delbl\b)/i,
    func: async (msg, {cmd}) => {
        let userProfile = await func.getAdminBot(msg.senderId)
        if (userProfile.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }

        let { userID } = await func.getUserIdForPunishment(msg)

        if (!userID || userID < 0 || isNaN(userID)) return msg.error('Укажите правильный индентификатор пользователя!'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.


        let target = await func.checkUserInBlackList(userID)
        console.log(target)
        let targetInfo = await func.getUserInfo(msg, userID)
        return await msg.ok(`@id${userID}(${targetInfo[0].first_name} ${targetInfo[0].last_name}) успешно вынесен с ЧС!`)
    },
    tagWork: 'user',
    rights: 3, // Команда для Админов и выше
    help: '/delbl @user',
    desc: 'Удалить пользователя с ЧС'
};
