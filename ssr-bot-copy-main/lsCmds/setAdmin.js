const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/setadmin\b)/i,
    func: async (msg, { cmd }) => {
        let userProfile = await func.getAdminBot(msg.senderId)
        //if(userProfile === null || userProfile === undefined) return msg.error(messages.CANT_ACCESS_TO_COMMAND)
        if (userProfile.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }

        let { userID, status } = await func.getUserIdForPunishment(msg)
        if (!userID || userID < 0 || isNaN(userID)) return msg.error('Укажите корректный идентификатор товарища!');

        let target = await func.getAdminBot(userID)
        if(target.admin !== undefined) {
            if(userProfile.admin <= target.admin) {
                return msg.error(messages.ERROR_MESSAGE_1);
            }
        } else {
            return msg.error(`У этого пользователя нет никаких прав в боте!`)
        }

        let lvl = Number.parseInt(status ? msg.text.split(' ')[1] : msg.text.split(' ')[2]);

        let result = await func.setBotAdmin(userID, lvl)
        if(result.admin === lvl) return msg.ok(`@id${userID}(Пользователю) был выдан уровень доступа к боту ${lvl}`)
        else return msg.error(`Произошла ошибка при выдаче уровня доступа. Обратитесь к разработчику бота!`)
    },
    tagWork: 'user',
    rights: 6,
    help: '/setadmin',
    desc: 'Назначить пользователю уровень доступа к боту'
};
