const func = require('../src/func');
const convsType = require("../src/convType")
const messages = require("../message.json");
const {getAdminBot} = require("../src/func");

module.exports = {
    regexp: /^(а?\/gettype\b)/i,
    func: async (msg, {cmd}) => {

        let user = await getAdminBot(msg.senderId)
        if (user.admin < cmd.rights) {
            return msg.error(messages.CANT_ACCESS_TO_COMMAND);
        }

        let types = await convsType.convTypes()
        let convInfo = await func.getConvInfo(msg.peerId)

        return await msg.ok(`У этой беседы обнаружен статус - ${types[convInfo.type]}`)
    },
    work: 1,
    rights: 1, // Команда для Админов и выше
    tagWork: 'chat',
    help: '/gettype',
    desc: 'Узнать тип беседы'
};
