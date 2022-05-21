const {StepScene} = require('@vk-io/scenes')
const {Keyboard} = require('vk-io')
const keys = require('../keys')
const logger = require('../logger')

module.exports = [new StepScene('mainMenuScene', [
    async (msg) => {
        let keyboard = Keyboard.keyboard([keys.adminBotMenu(), keys.sendSomeCommand()])
        if (msg.scene.step.firstTime || !msg.text) {
            return msg.send({
                message: 'Для начала работы вам нужно выбрать пункт, с чем вы хотите начать работать.',
                keyboard: keyboard
            })
        }

        if(msg.messagePayload.command === 'sendSomeCommand') {
            let exitKeyboard = Keyboard.keyboard([])
            await msg.send({
                message: 'Вы перешли в режим ввода команды.',
                keyboard: exitKeyboard
            })
            return await msg.scene.leave({
                silent: true,
                canceled: true
            });
        }

        let {keys: scenesList} = msg.scene.repository

        if (!msg.messagePayload.command) return msg.send('Извините, я вас не очень понял...')
        if (!scenesList.includes(msg.messagePayload.command)) return msg.send('Извините, произошла техническая ошибка...')

        return msg.scene.enter(msg.messagePayload.command)
    }
])]
