const func = require('../src/func');
const messages = require('../message.json');

module.exports = {
    regexp: /^(а?\/gkick\b)/i,
    func: async (msg, { cmd, convInfo }) => {
        let user =  await func.getAdminBot(msg.senderId)
        if (user.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }

        let { userID, status } = await func.getUserIdForPunishment(msg)
        let type = msg.text.split(' ')[1]
        console.log(type)
        if(type !== 'all' && type !== 'admin' && type !== 'leader' && type !== 'helper') return msg.error('Укажите тип бесед, откуда кикнуть пользователя.\n\nТипы бесед: all, admin, leader, helper')
        let reason = (status ? msg.text.split(' ').slice(2).join(' ') : msg.text.split(' ').slice(3).join(' ')).replace(/\n/g, " ");
        if (!userID || userID < 0 || isNaN(userID)) return msg.error('Укажите правильный индентификатор пользователя!'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.
        if (!reason || reason.length > 50) return msg.error('Укажите причину кика не больше 50 символов');

        //if(status1) return await msg.error(`Извини, но данное действие будет стыдно совершить!`)


        let target = await func.getUserFromMongo(userID, msg.peerId)
        if(user.admin <= target.admin  && msg.senderId !== owner.member_id) {
            return msg.error(messages.ERROR_MESSAGE_1);
        }

        let convs = []
        if(type === 'all') {
            convs = await func.getUserConvsFromMongo(msg.senderId, convInfo.server, 1)
        } else if (type === 'admin') {
            convs = await func.getUserConvsFromMongo(msg.senderId, convInfo.server, 2)
        } else if (type === 'helper') {
            convs = await func.getUserConvsFromMongo(msg.senderId, convInfo.server, 3)
        } else if (type === 'leader') {
            convs = await func.getUserConvsFromMongo(msg.senderId, convInfo.server, 4)
        } else {
            return msg.error('Произошла ошибка с выбором типа беседы')
        }

        if(convs === false) return true

        let rankName = await func.getRankName(user);
        for (let el of convs) {
            let result = await func.kickUserFromChat(el.convID, userID)
            if (result) {
                await vk.api.messages.send({
                    random_id: 0,
                    peer_id: el.convID,
                    message: `&#128128; @id${userID}(Пользователь) успешно кикнут с беседы!\nПричина: ${reason}\nПриговор вынес: @id${msg.senderId}(${rankName})`
                });
                await func.setChatModerator(el.convID, userID, 0)
                await func.setPunishHistory(userID, msg.senderId, el.convID, 'gkick', reason)
            }
        }
        return true
    },
    tagWork: 'chat',
    rights: 2, // Команда для Админов и выше
    help: '/gkick @type @user причина',
    desc: 'Выгнать пользователя с определенных бесед'
};
