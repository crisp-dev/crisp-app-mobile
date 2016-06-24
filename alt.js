import Alt                    from "alt";
import Config                 from "./config.json";
import {createClient}         from "fetch-plus";
import plusJson               from "fetch-plus-json";
import Amplitude              from "amplitude";

/* Hack to boot socket io */
window.navigator.userAgent = "react-native";
var io = require("socket.io-client/socket.io");

class CrispAlt extends Alt {
  constructor(config = {}) {
    super(config);

    this.amplitude = null;
    this.logged = false;
    this.user_id = null;
    this.current_session_id = "";
    this.client = createClient(Config.CRISP_API, {
      timeout : 4000
    });

    this.client.addMiddleware(plusJson());

    this.socket = io(Config.CRISP_SOCKET_APP, {
      path       : "/",
      transports : ["websocket"],
      jsonp      : false
    });
    this.socket.connect();
  }

  track(data = {}) {
    if (!this.amplitude) {
      let user_id = this.user_id;
      this.amplitude = new Amplitude(Config.AMPLITUDE, {
        user_id : user_id
      });
    }
    this.amplitude.track(data);
  }
}

export default new CrispAlt();
