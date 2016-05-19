import alt            from "../alt";

import websites       from "./websites";
import Store          from "react-native-simple-store";
import base64         from "base-64";

class AuthApi {

  auto_login() {
    return Store.get("CrispCredentials").then(user_session => {
      if (!user_session || !user_session.identifier || !user_session.key) {
        return Promise.reject({});
      }
      let auth_data = base64.encode(
        user_session.identifier + ":" + user_session.key);
      alt.client.addMiddleware(
        (request) => {
          request.options.headers.Authorization = "Basic " + auth_data;
        });
      alt.socket.connect();
      this.do_heartbeat();
      alt.socket.emit("authentication", {
        username : user_session.identifier,
        password : user_session.key
      });
      alt.logged = true;
      alt.user_id = user_session.identifier;
      alt.socket.on("reconnect", () => {
        this.auto_login();
        websites.reconnect();
      });
      return Promise.resolve();
    });
  }

  do_heartbeat() {
    setInterval(() => {
      alt.socket.emit("user:availability", {
        user_id      : alt.user_id,

        availability : {
          type : "online",

          time : {
            for : 120
          }
        }
      });
    }, 60000);
  }

  login(email, password) {
    console.log("login API");
    return alt.client.add(["user", "session", "login"],
    {
      body : {
        email : email,
        password : password
      }
    }).then(res => {
      return this.store_credentials(res.data.identifier, res.data.key);
    })
    .then(() => {
      return this.auto_login();
    }).catch(e => {
      return Promise.reject(e);
    });
  }

  logout() {
    return Store.delete("CrispCredentials").then(() => {
      return Store.delete("CrispDefaultWebsite");
    });
  }

  store_credentials(identifier, key) {
    return Store.save("CrispCredentials", {
      identifier  : identifier,
      key         : key
    });
  }
}

export default new AuthApi();
