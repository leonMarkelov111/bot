const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/setadmin\b)/i,
    func: async (msg, { cmd, convInfo, userProfile}) => {
        let vkArray = await vk.api.messages.getConversationMembers({
            peer_id: msg.peerId,
        });

        let owner = vkArray.items.find(s => s.is_owner === true)

        if (userProfile.admin < cmd.rights && msg.senderId !== owner.member_id) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }
        // console.log(convInfo.convInfo.status)
        if(convInfo.status === 1) {
            let { userID } = await func.getUserIdForPunishment(msg)
            if (!userID || userID < 0 || isNaN(userID)) return msg.error('Укажите корректный идентификатор товарища!');

            let target = await func.getUserFromMongo(userID, msg.peerId)
            if(userProfile.admin <= target.admin && msg.senderId !== owner.member_id) {
                return msg.error(messages.ERROR_MESSAGE_1);
            }

            await func.setChatModerator(msg.peerId, userID, 2)
            return msg.ok(`@id${userID}(Пользователь) был назначен Администратором беседы`)
        }
    },
    tagWork: 'chat',
    rights: 3, // Команда для Владельца беседы
    help: '/setadmin',
    desc: 'Назначить пользователю 2 уровень доступа'
};
