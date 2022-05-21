const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/onlinelist\b)/i,
    func: async (msg, {cmd, userProfile}) => {
        if (userProfile.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }

        let result = await vk.api.messages.getConversationMembers({
            peer_id: msg.peerId,
        });

        let massive1 = []
        let num = 1
        for (const [i, el] of result.profiles.entries()) {
            if(el.online === 1) {
                if (el.online_info.is_mobile) {
                    massive1.push(`${num}. [id${el.id}|${el.first_name} ${el.last_name}] >> 📱`)
                } else {
                    massive1.push(`${num}. [id${el.id}|${el.first_name} ${el.last_name}] >> 🖥`)
                }
                num++
            }
        }
        await msg.send(`✭ Пользователи онлайн:\n${massive1.join("\n")}`)
    },
    work: 1,
    tagWork: 'chat',
    rights: 1, // Команда для Админов и выше
    help: '/onlinelist',
    desc: 'посмотреть пользователей в онлайн'
};
