const MQTTTopics = {
  State: "game/state/",
  StateFormatter: function (gameId) { return `${this.State}${gameId}` },
  gameIdFromStateTopic: function (topic) { return topic.replace(this.State, "") },
  UserPresence: "game/user-presence/",
  UserPresenceFormatter: function (gameId) { return `${this.UserPresence}${gameId}` },
  gameIdFromUserPresenceTopic: function (topic) { return topic.replace(this.UserPresence, "") },
  Chat: "game/chat/",
  ChatFormatter: function (gameId) { return `${this.CHAT}${gameId}` }
}

export default MQTTTopics;