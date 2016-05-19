import alt from "../alt";

var ConversationsActions = alt.generateActions(
  "conversationsLoaded",
  "conversationLoaded",
  "messageReceived",
  "messageComposing",
  "updateAvailability",
  "updateState",
  "updateNickname",
  "updateEmail",
  "updatePages",
  "updateSystem",
  "updateGeolocation",
  "removeConversation"
);

ConversationsActions.displayName = "ConversationsActions";

module.exports = alt.createActions(ConversationsActions);
