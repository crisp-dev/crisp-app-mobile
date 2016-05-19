import alt from "../alt";

var UserActions = alt.generateActions(
  "websitesLoaded",
  "profileLoaded"
);

UserActions.displayName = "UserActions";

module.exports = alt.createActions(UserActions);
