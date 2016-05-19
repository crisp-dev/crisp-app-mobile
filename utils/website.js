import UserApi        from "../api/user";
import Store          from "react-native-simple-store";

class WebsiteUtils {
  get_default() {
    return new Promise((resolve, reject) => {
      Store.get("CrispDefaultWebsite").then(default_website => {
        if (!default_website) {
          return Promise.reject({});
        }
        return resolve(default_website);
      }).catch(() => {
        return UserApi.getWebsites().then(websites => {
          this.set_default(websites[0]);
          return resolve(websites[0]);
        }).catch(e => {
          return reject({});
        });
      });
    });
  }

  set_default(website) {
    return Store.save("CrispDefaultWebsite", website);
  }
}

export default new WebsiteUtils();
