const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/botstart\b)/i,
    func: async (msg, { convInfo }) => {
       // console.log(convInfo.convInfo.status)
        let user = await func.checkBotAdmins(msg.senderId)
        if(user.admin === undefined) return msg.error(`Извините, но у вас нет прав на активацию бота в беседах!`)
        if (user.admin >= 5) {
            if (convInfo.status === 0) {
                msg.send(`Начинаю подключать беседу к своей базе данных...`)
                await func.checkConvUsersInDB(msg.peerId)
                await func.setActiveChat(msg.peerId)
                msg.send(`Беседа успешно подключена! Приятного использования!\n\nЕсли беседа создана от имени группы - выдайте через сообщения группы владельца кому пожелаете командой /setowner\nP.S. Это может быть даже несколько человек!`)
            } else {
                return msg.error("Беседа уже активирована!")
            }
        } else {
            return msg.error(`Извините, но у вас нет прав на активацию бота в беседах!`)
        }

    },
    tagWork: 'chat',
    rights: 0, // Команда для Админов и выше
    help: '/botstart',
    desc: 'Активировать бота в беседе.'
};
