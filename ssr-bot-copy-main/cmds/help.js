module.exports = {
  regexp: /^(а?\/help\b)/i,
  func: async(msg, { cmds }) => {
    let result = [
      `👀 Команды для пользователей 👀`,
      cmds
      .filter(cmd => cmd.rights === 0)
      .map(cmd => `✯ ${cmd.help} -- ${cmd.desc}`).join('\n') || '✯ Нет команд для пользователей',
      ``,
      `👀 Команды для Модератора беседы 👀`,
      cmds
      .filter(cmd => cmd.rights === 1)
      .map(cmd => `✯ ${cmd.help} -- ${cmd.desc}`).join('\n') || '✯ Нет команд для Модераторов беседы',
      ``,
      `👀 Команды для Администратора беседы 👀`,
      cmds
      .filter(cmd => cmd.rights === 2)
      .map(cmd => `✯ ${cmd.help} -- ${cmd.desc}`).join('\n') || '✯ Нет команд для Администратора беседы',
      ``,
      `👀 Команды Руководства проекта 👀`,
      cmds
          .filter(cmd => cmd.rights === 3)
          .map(cmd => `✯ ${cmd.help} -- ${cmd.desc}`).join('\n') || '✯ Нет команд для Руководства проекта'
    ].join('\n');
    await msg.send(`${result}\n\nРоли, выше Администратора беседы выдаются специальными людьми в секретном месте!`);
  },
  tagWork: 'chat',
  rights: 0,
  help: '/help',
  desc: 'Список доступных команд'
};
