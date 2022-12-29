const {
  ERR_NONICKNAMEGIVEN,
  ERR_NICKNAMEINUSE
} = require('../replies')
const { debuglog } = require('util')
const debug = debuglog('ircs:commands:nick')

module.exports = function nick({ user, server, parameters: [nickname] }) {
  nickname = nickname.trim()

  debug('NICK', user.mask(), nickname)

  if (!nickname || nickname.length === 0) {
    return user.send(server, ERR_NONICKNAMEGIVEN, ['No nickname given'])
  }

  if (nickname === user.nickname) {
    // ignore
    return
  }

  const lnick = nickname.toLowerCase()
  if (server.users.some((us) => us.nickname &&
    us.nickname.toLowerCase() === lnick &&
    us !== user)) {
    user.send(server, ERR_NICKNAMEINUSE,
      [user.nickname, nickname, ':Nickname is already in use'])

    return false
  }
  user.nickname = nickname
  if (user.authenticated) {
    user.send(server, user, 'NICK', [nickname])
  }
  user.channels.forEach(chan => chan.broadcast(user, 'NICK', [nickname]))

  if (user.username && !user.authenticated) {
    user.authenticate()
  }

  return true
}
