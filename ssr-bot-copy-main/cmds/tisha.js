const func = require('../src/func');
const messages = require("../message.json");

module.exports = {
    regexp: /^(а?\/silence\b)/i,
    func: async (msg, { userProfile, convInfo }) => {
        if (userProfile.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }
        
        if (convInfo.silence >= 1) {
            await func.setSilenceStatus(msg.peerId, 0)
            return await msg.ok(`Режим тишины успешно выключен. Теперь все пользователи могут писать в чат.`)
        } else {
            await func.setSilenceStatus(msg.peerId, 1)
            return await msg.ok(`Режим тишины успешно активирован в чате. Любое сообщение пользователя будет удалено с чата.`)
        }

    },
    work: 1,
    rights: 2, // Команда для Админов и выше
    tagWork: 'chat',
    help: '/silence',
    desc: 'включить/выключить режим тишины'
};
