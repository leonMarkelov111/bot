const {StepScene} = require('@vk-io/scenes')
const {Keyboard} = require('vk-io')
const keys = require('../keys')
const func = require('../func')

module.exports = [new StepScene('setBotAdmin', [
    async (msg) => {
        let user = await func.getAdminBot(msg.senderId)
        if(user.admin < userRight.headOfProject.lvl) {
            await msg.send(`Ваш уровень доступа не позвляет зайти в это меню.`)
            return msg.scene.enter('mainMenuScene')
        }

        let keyboard = Keyboard.keyboard([keys.backToMainMenu()]) //keys.highLevelMenu()
        if (msg.scene.step.firstTime || !msg.text) {
            return msg.send({
                message: 'Отправьте ответным сообщением ссылку на VK, кому вы хотите выдать доступ к боту',
                keyboard: keyboard
            })
        }

        if(msg.messagePayload && msg.messagePayload.command) {
            let {keys: scenesList} = msg.scene.repository

            if(!scenesList.includes(msg.messagePayload.command)) return msg.send('Извините, произошла техническая ошибка...')

            return msg.scene.enter(msg.messagePayload.command)
        }

        let userID = await func.getUserIdForScenes(msg)
        if (!userID || userID < 0 || isNaN(userID)) return msg.send('Укажите правильный айди');

        msg.scene.state.id = userID
        msg.scene.state.userAdmin = user.admin

        return msg.scene.step.next();
    },
    async (msg) => {
        let keyboard = Keyboard.keyboard(keys.adminRights()) //keys.highLevelMenu()
        if (msg.scene.step.firstTime || !msg.text) {
            return msg.send({
                message: 'Выберите уровень доступа, который вы хотите выдать пользователю',
                keyboard: keyboard
            })
        }

        if(msg.scene.state.userAdmin < msg.messagePayload.lvl) return msg.send(`Ты не можешь выдать этот уровень, так как он выше твоего!`)
        msg.scene.state.lvl = msg.messagePayload.lvl

        return msg.scene.step.next();
    },
    async (msg) => {
        let result = await func.setBotAdmin(msg.scene.state.id, msg.scene.state.lvl)
        let userInfo = await func.getUserInfo(msg, msg.scene.state.id)

        if(result.admin === msg.scene.state.lvl) {
            if (msg.scene.state.lvl === 0) {
                await msg.send(`Вы успешно сняли пользователю @id${msg.scene.state.id}(${userInfo[0].first_name} ${userInfo[0].last_name}) доступ к боту!`)

            } else {
                await msg.send(`Вы успешно выдали пользователю @id${msg.scene.state.id}(${userInfo[0].first_name} ${userInfo[0].last_name}) ${msg.scene.state.lvl} уровень доступа к боту!`)
            }
        }

        return msg.scene.enter('mainMenuScene')
    }
])]
