import UserApi            from "../api/user";
import Store              from "react-native-simple-store";
import PushNotification   from "react-native-push-notification";
import alt                from '../alt';

class NotificationsUtils {
  configure() {
    PushNotification.configure({
      onRegister : (token) => {
        this.is_subscribed().catch(() => {
          let subscription = {
            registration : {
              registrationId : token.token
            },
            type : "mobile",
            os : token.os
          };
          UserApi.addSubscription(subscription);
          Store.save("CrispNotifications", {
            is_subscribed : true,
            subscription
          });
        });
      },
      onNotification : function(notification) {

      },
      senderID : "745709688371",
      popInitialNotification : true
    });
  }

  is_subscribed(website) {
    return Store.get("CrispNotifications").then(notifications => {
      if (notifications && notifications.is_subscribed === true) {
        return Promise.resolve();
      }
      return Promise.reject({});
    });
  }

  notify(event) {
    if (event.session_id != alt.current_session_id) {
      PushNotification.localNotification({
        title : "You received a message",
        message : event.content
      });
    }
  }

}

export default new NotificationsUtils();
