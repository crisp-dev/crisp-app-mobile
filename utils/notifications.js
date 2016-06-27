import UserApi            from "../api/user";
import Store              from "react-native-simple-store";
import PushNotification   from "react-native-push-notification";
import OneSignal          from 'react-native-onesignal';
import alt                from "../alt";
import Sound              from "react-native-sound";

class NotificationsUtils {
  configure() {

    this.sound = new Sound(
      'chat_message_receive.mp3',
      Sound.MAIN_BUNDLE,
      () => {}
    );

    OneSignal.idsAvailable((idsAvailable) => {
      UserApi.syncNotificationId(idsAvailable.userId);
    });

    OneSignal.enableSound(true);
    OneSignal.enableVibrate(true);
    OneSignal.requestPermissions({
      alert : true,
      badge : true,
      sound : true
    });

    OneSignal.registerForPushNotifications();
  }

  notify(event) {
    if (this.sound) {
      this.sound.play();
    }

    if (event.session_id != alt.current_session_id) {
      PushNotification.localNotification({
        title : "You received a message",
        message : event.content
      });
    }
  }

}

export default new NotificationsUtils();
