const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/setnick\b)/i,
    func: async (msg, { cmd, userProfile}) => {
        if (userProfile.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }

        let { userID, status } = await func.getUserIdForPunishment(msg)
        //console.log(`${ID} + ${status}`)

        let text = (status ? msg.text.split(' ').slice(1).join(' ') : msg.text.split(' ').slice(2).join(' ')).replace(/\n/g, " ");
        if (!userID || userID < 0 || isNaN(userID)) return msg.error('Укажите правильный айди'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.
        if (!text || text.length > 50) return msg.error('Укажите ник пользователя не более 50 символов');

        let result =await func.setUserNick(msg.peerId, userID, text)
        if(result.nickName === text) {
            await msg.ok(`@id${userID}(Пользователю) был выдан никнейм ${text}`);
        }

    },
    tagWork: 'user',
    rights: 5, // Команда для Админов и выше
    help: '/setnick @user',
    desc: 'Установить ник пользователю'
};
