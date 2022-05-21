const {StepScene} = require('@vk-io/scenes')
const {Keyboard} = require('vk-io')
const keys = require('../keys')
const func = require('../func')
const logger = require('../logger')

module.exports = [new StepScene('adminBotMenu', [
    async (msg) => {
        let user = await func.getAdminBot(msg.senderId)
        if(user.admin < userRight.headOfProject.lvl) {
            msg.send(`Ваш уровень доступа не позвляет зайти в это меню.`)
            return msg.scene.enter('mainMenuScene')
        }

        let keyboard = Keyboard.keyboard([[keys.getBotAdmins(), keys.setBotAdmin()], keys.backToMainMenu()]) //keys.highLevelMenu()
        if (msg.scene.step.firstTime || !msg.text) {
            return msg.send({
                message: 'Для начала работы вам нужно выбрать пункт, с чем вы хотите начать работать.',
                keyboard: keyboard
            })
        }

        if (msg.messagePayload.command === 'getBotAdmins') {
            let result = await func.getAdmins()
            let massive = []

            for (const [i, el] of result.entries()) {
                let userInfo = await func.getUserInfo(msg, el.userID)
                massive.push(`${i+1}. @id${el.userID}(${userInfo[0].first_name} ${userInfo[0].last_name}) - ${el.admin} уровень доступа.`)
            }
            return await msg.send(`Администраторы бота:\n\n${massive.join("\n")}`)
        }

        let {keys: scenesList} = msg.scene.repository

        if (!msg.messagePayload.command) return msg.send('Извините, я вас не очень понял...')
        if (!scenesList.includes(msg.messagePayload.command)) return msg.send('Извините, произошла техническая ошибка...')

        return msg.scene.enter(msg.messagePayload.command)
    }
])]
