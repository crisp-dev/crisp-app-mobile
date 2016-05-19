import alt                 from "../alt";

class UserStore {

  constructor() {
    this.displayName = "UserStore";
    this.name = "UserStore";
    this.UserActions = alt.getActions("UserActions");
    this.bindActions(this.UserActions);
    this.websites = [];
  }

  websitesLoaded(event) {
    this.websites = event.websites;
  }

  profileLoaded(event) {
    this.profile = event.profile;
  }

  static getWebsites() {
    var { websites } = this.getState();
    return websites;
  }

  static getProfile() {
    var { profile } = this.getState();
    return profile;
  }
}

module.exports = alt.createStore(UserStore, 'UserStore');
