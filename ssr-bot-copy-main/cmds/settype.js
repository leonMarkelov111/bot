const {setConvType, getAdminBot} = require("../src/func");
const {convTypes} = require("../src/convType");
const messages = require('../message.json')


module.exports = {
    regexp: /^(а?\/settype\b)/i,
    func: async (msg, { convInfo, cmd }) => {
        if(convInfo.status === 0) return await msg.error(messages.CONV_NOT_ACTIVATED)


        let user = await getAdminBot(msg.senderId)
        if (user.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }

        let types = await convTypes()
        let type = msg.text.split(' ')[1]
        let num = 0

        if(type === undefined) {
            let array = []
            for (let [i, el] of types.entries()) {
                array.push(`${i}. ${el}`)
                num++
            }
            return await msg.error(`Вы не указали тип беседы.\n\nТипы бесед:\n${array.join("\n")}`)
        }
        if(Number.parseInt(type) > 7) return await msg.send(`Укажите корректный тип беседы!`)
        let result = await setConvType(msg.peerId, type)

        return await msg.ok(`Вы установили новый тип беседы - ${types[type]}`)

    },
    work: 1,
    rights: 2, // Команда для Админов и выше
    tagWork: 'chat',
    help: '/settype',
    desc: 'Установить тип беседы'
};
