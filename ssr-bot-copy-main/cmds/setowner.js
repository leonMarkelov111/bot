const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/setowner\b)/i,
    func: async (msg, { cmd, convInfo, userProfile}) => {
        if(convInfo.status === 1) {
            let vkArray = await vk.api.messages.getConversationMembers({
                peer_id: msg.peerId,
            });

            let owner = vkArray.items.find(s => s.is_owner === true)

            if (userProfile.admin < cmd.rights && msg.senderId !== owner.member_id) {
                return msg.error(messages.CANT_ACCESS_TO_COMMAND);
            }
            let { userID } = await func.getUserIdForPunishment(msg)
            if (!userID || userID < 0 || isNaN(userID)) return msg.error('Укажите корректный идентификатор товарища!');

            if(msg.senderId === owner.member_id) {
                await func.setChatModerator(msg.peerId, userID, 3)
                return msg.ok(`@id${userID}(Пользователь) был назначен Владельцем!`)
            } else {
                return msg.error(messages.ERROR_MESSAGE_1);
            }


        }
    },
    tagWork: 'chat',
    rights: 3, // Команда для Владельца беседы
    help: '/setowner',
    desc: 'Назначить пользователю 3 уровень доступа'
};
