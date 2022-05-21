const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/bl\b)/i,
    func: async (msg, {cmd}) => {
        let userProfile = await func.getAdminBot(msg.senderId)
        if (userProfile.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }

        let { userID, status } = await func.getUserIdForPunishment(msg)

        let server = Number.parseInt(status ? msg.text.split(' ')[1] : msg.text.split(' ')[2]);

        if(!server || server > 10 || isNaN(server)) return msg.error(`Укажи корректный номер сервера.\n 0 - ЧС проекта, 1-10 - ЧС определенного сервера`)

        let reason = (status ? msg.text.split(' ').slice(2).join(' ') : msg.text.split(' ').slice(3).join(' ')).replace(/\n/g, " ");
        if (!userID || userID < 0 || isNaN(userID)) return msg.error('Укажите правильный индентификатор пользователя!'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.
        if (!reason || reason.length > 50) return msg.error('Укажите причину ЧС пользователя не больше 50 символов');


        let target = await func.getAdminBot(userID)
        if(target) {
            if(userProfile.admin <= target.admin) {
                return msg.error(messages.ERROR_MESSAGE_1);
            }
        }

        target = await func.checkUserInBlackList(userID)
        if (target) return msg.error('Пользователь уже присутствует в ЧС! Используйте /getbl @user для того, чтоб узнать информацию о его ЧС.');

        let convs = await func.getUserConvsFromMongo(msg.senderId, null, 1)

        await func.addUserToBlackList(userID, msg.senderId, reason, server)
        for (let el of convs) {
            let result = await func.kickUserFromChat(el.convID, userID)
            if (result) {
                await vk.api.messages.send({
                    random_id: 0,
                    peer_id: el.convID,
                    message: `&#128128; @id${userID}(Пользователь) успешно кикнут с беседы в следствии добавления в ЧС!\nПричина: ${reason}`
                });
                await func.setChatModerator(el.convID, userID, 0)
                await func.setBotAdmin(userID, 0)
                await func.setPunishHistory(userID, msg.senderId, el.convID, 'blackList', reason)
            }
        }

        await msg.ok(`@id${userID}(Пользователь) успешно внесён в общий ЧС проекта и кикнут со всех бесед проекта!`)
    },
    tagWork: 'user',
    rights: 4, // Команда для Админов и выше
    help: '/bl @user @server причина',
    desc: 'Занести игрока в черный список'
};
