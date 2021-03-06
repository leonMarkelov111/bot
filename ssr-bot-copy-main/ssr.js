require('dotenv').config()
const fs = require('fs');
global.userRight = require('./src/configs/globalUserRights.json')
//======================================================================================================================
const logger = require('./src/logger')
const func = require("./src/func");

const {VK} = require('vk-io');
const messages = require("./message.json");
const {checkUserInBlackList} = require("./src/func");
global.vk = new VK({
    token: 'a85e421554a847c2f5f639521088b00e081c8672b0604a73142277af05b23e9918016ff520cb0459aaf7e',
    pollingGroupId: 213308439,
    apiMode: 'parallel'
});

//====================== MongoDB ===========================================================
global.mongoose = require('mongoose');
mongoose.connect('Leon_Markelovv:4wrEAGkK06ohFXAg').then(() => logger.info.info("Подключение к БД - успешно!"))

// Объявляем объект с командами

const cmds = fs
    .readdirSync(`${__dirname}/cmds/`)
    .filter((name) => /\.js$/i.test(name))
    .map((name) => require(`${__dirname}/cmds/${name}`));

const lsCmds = fs
    .readdirSync(`${__dirname}/lsCmds/`)
    .filter((name) => /\.js$/i.test(name))
    .map((name) => require(`${__dirname}/lsCmds/${name}`));

// Консолим успешный запуск
logger.info.info("Бот успешно запустился.")

// (Polling)
vk.updates.start()
    .catch(logger.info.info)

//================== SCENE ===========================
const {SessionManager} = require('@vk-io/session')
const {SceneManager} = require('@vk-io/scenes')

const {
    mainMenuScene,
    adminBotMenu,
    setBotAdmin
} = require('./src/scenes/')

const sessionManager = new SessionManager({
    getStorageKey: (msg) => String(msg.peerId)
});
const sceneManager = new SceneManager()


sceneManager.addScenes(mainMenuScene)
sceneManager.addScenes(adminBotMenu)
sceneManager.addScenes(setBotAdmin)
//================== SCENE END ===========================

vk.updates.on('message_new', sessionManager.middleware)
vk.updates.on('message_new', sceneManager.middleware)
vk.updates.on('message_new', sceneManager.middlewareIntercept)

vk.updates.on(['message_new'], async (msg) => {
    if (msg.isOutbox) {
        return;
    }

    msg.answer = (text = "", params = {}) => {
        const result = `${text}`;
        return msg.send(result, params);
    };
    msg.ok = (text = "", params = {}) => {
        return msg.answer('👍 ' + text, params);
    };
    msg.error = (text = "", params = {}) => {
        return msg.answer('✖ ' + text, params);
    };


    if (msg.peerType === 'chat') {
        logger.trace.trace(`[${msg.peerId}]: ${msg.senderId} | ${msg.text}`)
        let convInfo = await func.getConvInfo(msg.peerId)
        let userProfile
        if(convInfo.status !== undefined) {
            if (convInfo.status === 1) {
                userProfile = await func.convUserAdd(msg, msg.senderId, msg.peerId);
                if(convInfo.silence >= 1 && userProfile.admin < 1) {
                    await msg.deleteMessage({
                        "delete_for_all": 1,
                        "conversation_message_ids": msg.conversationMessageId,
                        "peer_id": msg.peerId
                    })
                }
                if(userProfile.mute) {
                    await msg.deleteMessage({
                        "delete_for_all": 1,
                        "conversation_message_ids": msg.conversationMessageId,
                        "peer_id": msg.peerId
                    })
                    await func.addUserMuteWarn(msg.senderId, msg.peerId)
                    if(userProfile.muteWarning + 1 === 3) {
                        await msg.send(`@id${msg.senderId}(Пользователь) получает 3 из 3 предупреждений за попытку писать в чате, находясь в муте.`)
                        await func.kickUserFromChat(msg.peerId, msg.senderId)
                        await func.deleteUserMuteWarn(msg.peerId, msg.senderId)
                    } else {
                        await msg.send(`@id${msg.senderId}(Нарушитель), если ты будешь пытаться флудить в муте - ты будешь кикнут.\nПредупреждение: ${userProfile.muteWarning + 1} из 3!`)
                    }
                }
            }
        } else {
            return msg.send(`Произошла ошибка. Невозможно определить статус беседы. Попробуйте пригласить ещё раз бота в беседу!`)
        }

        let cmd = cmds.find(cmd => cmd.regexp ? cmd.regexp.test(msg.text) : (new RegExp(`^\\s*(${cmd.tag.join('|')})`, "i")).test(msg.text) && cmd.tagWork === 'user');
        if (!cmd) {
            return true;
        } else {
            try {
                //console.log(userProfile)
                await cmd.func(msg, {cmds, vk, VK, cmd, userProfile, convInfo});
            } catch (e) {
                logger.error.error(`Ошибка:\n${e.message}`);
                msg.error(`Ошибка при выполнении команды '${msg.text}'`);
            }
        }
    } else {
        let cmd = lsCmds.find(cmd => cmd.regexp ? cmd.regexp.test(msg.text) : (new RegExp(`^\\s*(${cmd.tag.join('|')})`, "i")).test(msg.text) && cmd.tagWork === 'user');
        if (!cmd) {
            if (!msg.scene.current) {
                await msg.scene.enter('mainMenuScene')
            }
        } else {
            await msg.scene.leave({
                silent: true,
                canceled: true
            });

            try {
                await cmd.func(msg, {cmds, vk, VK, cmd});
            } catch (e) {
                logger.error.error(`Ошибка:\n${e.message}`);
                msg.error(`Ошибка при выполнении команды '${msg.text}'`);
            }
        }
    }
    //await func.checkConvUserInDB(msg, msg.senderId, msg.peerId, 1);
})


vk.updates.on(['chat_invite_user', 'chat_invite_user_by_link'], async (msg) => {
    //console.log('[DEBUG] Сработал chat_invite_user или chat_invite_user_by_link'.green.bold)
    logger.info.info(`Сработал chat_invite_user или chat_invite_user_by_link`)
    //logger.info(msg)

    if (msg.eventMemberId === -208831405) {
        await func.convDelete(msg.peerId)
        await msg.send(`Привет! Первый шаг ты сделал - теперь тебе нужно активировать бота в этой беседе.\n\nДля начала выдай мне права администратора в беседе, а затем введи команду /botstart`);
        await func.convAdd(msg.peerId)
    } else {
        let convInfo = await func.getConvInfo(msg.peerId)
        if(convInfo === false) return true;

        let userID = msg.eventMemberId
        if (msg.eventType === "chat_invite_user_by_link") {
            userID = msg.senderId
        }

        let userInfo = await checkUserInBlackList(userID)
        if(userInfo) {
            await msg.send(`@id${userID}(Пользователь) находиться в глобальном ЧС!\nПричина занесения в ЧС: ${userInfo.reason}`);
            return await func.kickUserFromChat(msg.peerId, userID);
        }

        let user = await func.convUserAdd(msg, userID, msg.peerId);
        if (user.ban) {
            await msg.send('Пользователь находиться в бане!');
            return await func.kickUserFromChat(msg.peerId, userID);
        }

        //let vkUserInfo = await func.getUserInfo(msg, userID);
        //await func.sendHelloMessage(msg, userInfo);
        //await func.checkUserBan(msg, msg.eventMemberId, await func.getUserBan(msg, msg.eventMemberId))
    }
    //console.log(msg)
})


vk.updates.on(['chat_kick_user'], async (msg) => {
    await func.deleteUserMuteWarn(msg.senderId, msg.peerId)
    return await func.kickUserFromChat(msg.peerId, msg.senderId)
})


// Консолим ошибки
process.on("uncaughtException", e => {
    logger.error.error(e);
});

process.on("unhandledRejection", e => {
    logger.error.error(e);
});

setInterval(async () => {
    await func.muteTimeCheck();
}, 60000);

// setInterval(async () => {
//     let convArray = await func.getConvs();
//
//     console.log(convArray)
//     for (let i = 0; i < convArray.lenght; i++) {
//         console.log(convArray[i])
//         await func.checkConvUsersInDB(convArray[i].convID)
//     }
//
// }, 30000);
