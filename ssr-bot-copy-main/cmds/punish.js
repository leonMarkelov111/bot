const func = require('../src/func');
const messages = require('../message.json')

module.exports = {
    regexp: /^(а?\/punish\b)/i,
    func: async (msg, {cmd, userProfile}) => {
        if (userProfile.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }

        let { userID } = await func.getUserIdForPunishment(msg)

        if (!userID || userID < 0 || isNaN(userID)) return msg.error('Укажите правильный айди'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.

        let target = await func.getUserPunish(userID, msg.peerId)
        let punish = []

        //console.log(target)
        for (let i = 0; i < 10; i++) {
            //console.log(i)
            if (target[i] === undefined) break
            let type = 'неизвестное наказание, но суровое'
            if (target[i].type === 'warn') type = 'объявлен выговор'
            else if(target[i].type === 'unwarn') type = 'амнистирован выговор'
            else if(target[i].type === 'ban') type = 'забанен'
            else if(target[i].type === 'unban') type = 'разбанен'
            else if(target[i].type === 'mute') type = 'выдана затычка'
            else if(target[i].type === 'unmute') type = 'снята затычка'
            else if(target[i].type === 'kick') type = 'был кикнут'

            let reason
            if (target[i].reason === '') {
                reason = ''
            } else {
                reason = `Причина: ${target[i].reason}`
            }
            punish.push(`${target[i].date} ${target[i].time} - ${type} @id${target[i].giveID}(администратором беседы). ${reason}`)
        }
        let targetInfo = await func.getUserInfo(msg, userID)

        if(punish.length > 0) {
            return await msg.ok(`Выписка из личного дела @id${userID}(${targetInfo[0].first_name} ${targetInfo[0].last_name})\n\n${punish.join("\n")}`)
        } else {
            return await msg.ok(`Выписка из личного дела @id${userID}(${targetInfo[0].first_name} ${targetInfo[0].last_name})\n\nНаказания отсутствуют. Пользователь законопослушный!`)
        }
    },
    work: 1,
    rights: 1, // Команда для Админов и выше
    tagWork: 'chat',
    help: '/punish @user',
    desc: 'Узнать наказания пользователя'
};
