import alt        from "../alt";

class UserApi {

  getWebsites() {
    return alt.client.request(["user", "account", "websites"])
    .then(res => {
      alt.getActions("UserActions")
        .websitesLoaded({
          websites : res.data
        });
      return Promise.resolve(res.data);
    }).catch(e => {
      return Promise.reject({});
    });
  }

  getProfile() {
    return alt.client.request(["user", "account", "profile"])
    .then(res => {
      alt.getActions("UserActions")
        .profileLoaded({
          profile : res.data
        });
      return Promise.resolve(res.data);
    });
  }

  syncNotificationId(notification_id) {
    alt.socket.emit("user:sync_notification_id", {
      notification_id  : notification_id
    });
  }

  create(email, password, first_name, last_name) {
    return alt.client.add(["user", "account", ""], {
      body : {
        email,
        password,
        first_name,
        last_name
      }
    });
  }
}

export default new UserApi();
