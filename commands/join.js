const {
  RPL_TOPIC,
  RPL_NOTOPIC,
  ERR_NEEDMOREPARAMS,
  ERR_CHANNELISFULL
} = require('../replies')

const names = require('./names')

function join(opts) {
  const { user, server, parameters: [channelNames] } = opts

  if (!channelNames) {
    return user.send(server, ERR_NEEDMOREPARAMS, ['JOIN', ':Not enough parameters'])
  }

  for (const channelName of channelNames.split(',')) {
    const channel = server.getChannel(channelName)

    if (channel.users.length >= channel.modes.paramModes["l"] ?? 0) {
      user.send(server, ERR_CHANNELISFULL, [user.nickname, channelName, ':Cannot join channel (+l)'])
      continue
    }

    channel.join(user)

    channel.send(user, 'JOIN', [channel.name, user.username, `:${user.realname}`])

    names(Object.assign(
      {},
      opts,
      { parameters: [channelName] }
    ))

    // Topic
    if (channel.topic) {
      user.send(server, RPL_TOPIC, [user.nickname, channel.name, `:${channel.topic}`])
    } else {
      user.send(server, RPL_NOTOPIC, [user.nickname, channel.name, ':No topic is set.'])
    }
  }
}

module.exports = join