import alt        from "../alt";

class WebsitesApi {

  constructor() {
    this.joined_websites = [];
  }

  __is_joined(website_id) {
    return (this.joined_websites.indexOf(website_id) > -1);
  }

  join(website_id, user_id, forced = false) {
    if (this.__is_joined() && !forced) {
      return;
    }

    alt.socket.emit("website:join", {
      website_id : website_id,
      user_id    : alt.user_id
    });

    this.joined_websites.push(website_id);
  }

  create(name, domain) {
    return alt.client.add(["website"], {
      body : {
        name,
        domain
      }
    });
  }

  reconnect() {
    this.joined_websites.forEach(joined => {
      this.join(joined, "", true);
    });
  }

}

export default new WebsitesApi();
