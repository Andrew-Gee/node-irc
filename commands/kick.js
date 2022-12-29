const {
  ERR_NEEDMOREPARAMS,
  ERR_NOSUCHCHANNEL,
  ERR_CHANOPRIVSNEEDED,
  ERR_BADCHANMASK,
  ERR_NOTONCHANNEL,
} = require('../replies');

/**
 * @docs https://tools.ietf.org/html/rfc1459#section-4.2.8
 * Parameters: <channel> <user> [<comment>]
 */
const kick = ({ user, server, parameters: [ channelName, targetNickname, reason ] }) => {
  
  if (!channelName || !user) {
    user.send(server, ERR_NEEDMOREPARAMS, [ 'KICK', ':Not enough parameters' ])
    return
  }

  const channel = server.findChannel(channelName)
  if (!channel) {
    user.send(user, ERR_NOSUCHCHANNEL, [ channelName, ':No such channel' ])
    return
  }

  const targetUser = server.findUser(targetNickname)
  
  if (!targetUser || !channel.hasUser(targetUser)) {
    user.send(user, ERR_NOTONCHANNEL, [ channelName, ':No such user' ])
    return
  }
  
  if (!channel.hasOp(user)) {
    user.send(user, ERR_CHANOPRIVSNEEDED, [ user.nickname, channelName, ':You\'re not channel operator' ])
    return
  }

  channel.send(user, 'KICK', [ channelName, targetNickname, reason && ":" + reason ])
  channel.part(targetUser)
};

module.exports = kick;