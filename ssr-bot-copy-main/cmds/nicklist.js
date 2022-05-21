const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/nicklist\b)/i,
    func: async (msg, {cmd, userProfile}) => {
        if (userProfile.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }

        let result = await vk.api.messages.getConversationMembers({
            peer_id: msg.peerId,
        });

        let convUsers = await func.getConvUsers(msg.peerId)

        let massive1 = []
        for (const el of result.profiles) {
            let user = convUsers.find(s => s.userID === el.id && s.nickName !== "")
            if(user) {
                massive1.push(`[id${el.id}|${el.first_name} ${el.last_name}] >> ${user.nickName}`)
            }
        }
        await msg.send(`✭ Пользователи с никами:\n${massive1.join("\n")}`)

        massive1 = []
        for (const el of result.profiles) {
            let user = convUsers.find(s => s.userID === el.id && s.nickName === "")
            if(user) {
                massive1.push(`[id${el.id}|${el.first_name} ${el.last_name}]`)
            }
        }

        await msg.send(`✭ Пользователи без ников:\n${massive1.join("\n")}`)
    },
    work: 1,
    tagWork: 'chat',
    rights: 1, // Команда для Админов и выше
    help: '/nicklist',
    desc: 'Узнать ники пользователей'
};
