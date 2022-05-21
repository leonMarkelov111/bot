const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/staff\b)/i,
    func: async (msg, {cmd, userProfile}) => {
        if (userProfile.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }
        let adminsArray = await func.getAdminsChat(msg.peerId)
        //console.log(adminsArray)
        //if (!banStatus.ban_isBan) return msg.error('Этот пользователь не находиться в бане!');

        let massive1 = []
        let massive2 = []
        let massive3 = []
        //console.log(adminsArray[0])
        for (let i = 0; i < adminsArray.length; i++) {
            //console.log(adminsArray[i].userID)
            if(adminsArray[i].userID - 0 < 0) continue
            let smile
            let rankName = ""
            if(adminsArray[i].nickName.length > 1) rankName = `- ${adminsArray[i].nickName}`
            if(adminsArray[i].admin === 1) {
                smile = '✭'
                let userInfo = await func.getUserInfo(msg, adminsArray[i].userID)
                massive1.push(`[id${adminsArray[i].userID}|${userInfo[0].first_name} ${userInfo[0].last_name}] ${rankName}`)
            }
            if(adminsArray[i].admin === 2) {
                smile = '✮'
                let userInfo = await func.getUserInfo(msg, adminsArray[i].userID)
                massive2.push(`[id${adminsArray[i].userID}|${userInfo[0].first_name} ${userInfo[0].last_name}] ${rankName}`)
            }
            if(adminsArray[i].admin === 3) {
                smile = '✯'
                let userInfo = await func.getUserInfo(msg, adminsArray[i].userID)
                massive3.push(`[id${adminsArray[i].userID}|${userInfo[0].first_name} ${userInfo[0].last_name}] ${rankName}`)
            }
        }

        if(massive1.length < 1) massive1.push('Пусто')
        if(massive2.length < 1) massive2.push('Пусто')
        if(massive3.length < 1) massive3.push('Пусто')
        msg.send(`🌟 Владелец беседы:\n${massive3.join("\n")}\n\n⭐ Администратор беседы:\n${massive2.join("\n")}\n\n✭ Модератор беседы:\n${massive1.join("\n")}`)
    },
    work: 1,
    tagWork: 'chat',
    rights: 1, // Команда для Админов и выше
    help: '/staff',
    desc: 'Узнать админов беседы'
};
