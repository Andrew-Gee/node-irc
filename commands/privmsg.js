const {
  ERR_NOSUCHNICK,
  ERR_CANNOTSENDTOCHAN
} = require('../replies')

module.exports = function privmsg({ user, server, parameters: [targetName, content] }) {
  let target
  if (targetName[0] === '#' || targetName[0] === '&') {
    target = server.findChannel(targetName)
    if (target) {
      if ((target.isModerated && !target.hasVoice(user) && !target.hasOp(user))
        || (target.isNoExternalMessages && !target.hasUser(user))) {
        user.send(server, ERR_CANNOTSENDTOCHAN, [user.nickname, targetName, ':Cannot send to channel'])
        return
      }

      target.broadcast(user, 'PRIVMSG', [target.name, `:${content}`])
    }
  } else {
    target = server.findUser(targetName)
    if (target) {
      target.send(user, 'PRIVMSG', [target.nickname, `:${content}`])
    }
  }

  if (!target) {
    user.send(server, ERR_NOSUCHNICK, [user.nickname, targetName, ':No such nick/channel'])
  }
}
