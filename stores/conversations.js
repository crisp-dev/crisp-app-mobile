import alt                 from "../alt";
import NotificationsUtils  from "../utils/notifications";
import ConversationsApi    from "../api/conversations";

class ConversationsStore {

  constructor() {
    this.displayName = "ConversationsStore";
    this.name        = "ConversationsStore";
    this.ConversationsActions = alt.getActions("ConversationsActions");
    this.bindActions(this.ConversationsActions);
    this.conversations = {};
  }

  conversationsLoaded(event) {
    if (!this.conversations[event.website_id] ||
      event.page === 0) {
      this.conversations[event.website_id] = [];
    }
    event.conversations.forEach(conversation => {
      conversation.website_id = event.website_id;
      this.conversations[event.website_id].push(conversation);
    });
  }

  conversationLoaded(event) {
    if (!this.conversations[event.website_id]) {
      this.conversations[event.website_id] = [];
    }
    for (let index in this.conversations[event.website_id]) {
      if (this.conversations[event.website_id][index].session_id ==
        event.session_id) {
        this.conversations[event.website_id][index] = event.conversation;
        this.conversations[event.website_id][index].website_id =
          event.website_id;
        return;
      }
    }
  }

  messageReceived(event) {

    if (event.from == "user") {
      NotificationsUtils.notify(event);
    }

    if (!this.conversations[event.website_id]) {
      this.conversations[event.website_id] = [];
    }
    for (let index in this.conversations[event.website_id]) {
      if (this.conversations[event.website_id][index].session_id ==
        event.session_id) {
        if (!this.conversations[event.website_id][index].messages) {
          this.conversations[event.website_id][index].messages = [];
        }
        this.conversations[event.website_id][index].messages.push(event);
        if (typeof event.content === "string") {
          this.conversations[event.website_id][index].last_message =
            event.content;
        } else {
          this.conversations[event.website_id][index].last_message = "file";
        }
        return;
      }
    }
    this.conversations[event.website_id].unshift({
      session_id : event.session_id,
      website_id : event.website_id,
      meta : {
        nickname : "visitor"
      },
      last_message : event.content,
      status : 0,
      state : "pending"
    });
    setTimeout(function() {
      ConversationsApi.getOne(event.website_id, event.session_id);
    }, 500);
  }

  messageComposing(event) {
    if (!this.conversations[event.website_id]) {
      this.conversations[event.website_id] = [];
    }
    for (let index in this.conversations[event.website_id]) {
      if (this.conversations[event.website_id][index].session_id ==
        event.session_id) {
        if (event.type == "stop") {
          this.conversations[event.website_id][index].composing = false;
        } else {
          if (event.excerpt) {
            event.excerpt = event.excerpt.trim().replace(/(?:\r\n|\r|\n)/g, "");
            this.conversations[event.website_id][index].excerpt = event.excerpt;
            this.conversations[event.website_id][index].last_message =
              event.excerpt;
          }
          this.conversations[event.website_id][index].composing = true;
        }
        return;
      }
    }
  }

  updateState(event) {
    let state = event.state;
    let status = 0;
    switch (state) {
      case "resolved": {
        status = 2;
        break;
      }
      case "unresolved": {
        status = 1;
        break;
      }
      default: {
        status = 0;
      }
    }

    if (!this.conversations[event.website_id]) {
      this.conversations[event.website_id] = [];
    }
    for (let index in this.conversations[event.website_id]) {
      if (this.conversations[event.website_id][index].session_id ==
        event.session_id) {
        this.conversations[event.website_id][index].state = state;
        this.conversations[event.website_id][index].status = status;
        return;
      }
    }
  }


  updateAvailability(event) {
    if (!this.conversations[event.website_id]) {
      this.conversations[event.website_id] = [];
    }
    for (let index in this.conversations[event.website_id]) {
      if (this.conversations[event.website_id][index].session_id ==
        event.session_id) {
        this.conversations[event.website_id][index].availability =
          event.availability;
        return;
      }
    }
  }

  updateNickname(event) {
    if (!this.conversations[event.website_id]) {
      this.conversations[event.website_id] = [];
    }
    for (let index in this.conversations[event.website_id]) {
      if (this.conversations[event.website_id][index].session_id ==
        event.session_id) {
        this.conversations[event.website_id][index].meta.nickname =
          event.nickname;
        return;
      }
    }
  }

  updateEmail(event) {
    if (!this.conversations[event.website_id]) {
      this.conversations[event.website_id] = [];
    }
    for (let index in this.conversations[event.website_id]) {
      if (this.conversations[event.website_id][index].session_id ==
        event.session_id) {
        this.conversations[event.website_id][index].meta.email =
          event.email;
        return;
      }
    }
  }

  updateGeolocation(event) {
    if (!this.conversations[event.website_id]) {
      this.conversations[event.website_id] = [];
    }
    for (let index in this.conversations[event.website_id]) {
      if (this.conversations[event.website_id][index].session_id ==
        event.session_id) {
        if (!this.conversations[event.website_id][index]
          .meta.browsing_informations) {
          this.conversations[event.website_id][index]
          .meta.browsing_informations = {};
        }
        this.conversations[event.website_id][index]
          .meta.browsing_informations.geolocation = event.geolocation;
        return;
      }
    }
  }

  updateSystem(event) {
    if (!this.conversations[event.website_id]) {
      this.conversations[event.website_id] = [];
    }
    for (let index in this.conversations[event.website_id]) {
      if (this.conversations[event.website_id][index].session_id ==
        event.session_id) {
        if (!this.conversations[event.website_id][index]
          .meta.browsing_informations) {
          this.conversations[event.website_id][index]
          .meta.browsing_informations = {};
        }
        this.conversations[event.website_id][index]
          .meta.browsing_informations.system = event.system;
        return;
      }
    }
  }

  updatePages(event) {
    if (!this.conversations[event.website_id]) {
      this.conversations[event.website_id] = [];
    }
    for (let index in this.conversations[event.website_id]) {
      if (this.conversations[event.website_id][index].session_id ==
        event.session_id) {
        if (!this.conversations[event.website_id][index]
          .meta) {
          this.conversations[event.website_id][index]
          .meta.pages = [];
        }
        event.pages.forEach(page => {
          this.conversations[event.website_id][index]
          .meta.pages.push(page);
        });
        return;
      }
    }
  }

  removeConversation(event) {
    if (!this.conversations[event.website_id]) {
      this.conversations[event.website_id] = [];
    }
    for (let index in this.conversations[event.website_id]) {
      if (this.conversations[event.website_id][index].session_id ==
        event.session_id) {
        this.conversations[event.website_id]
          .splice(index, 1);
        return;
      }
    }
  }

  static getConversations(website_id) {
    let { conversations } = this.getState();
    if (!conversations[website_id]) {
      conversations[website_id] = [];
    }
    return conversations[website_id];
  }

  static getConversation(website_id, session_id) {
    let { conversations } = this.getState();
    if (!conversations[website_id]) {
      conversations[website_id] = [];
    }
    for (let index in conversations[website_id]) {
      if (conversations[website_id][index].session_id == session_id) {
        return conversations[website_id][index];
      }
    }
    ConversationsApi.getOne(website_id, session_id);
    return {};
  }

  static clear(website_id) {
    let { conversations } = this.getState();
    conversations[website_id] = [];
    this.emitChange();
  }

  static markAsRead(website_id, session_id) {
    let fingerprints      = [];
    let { conversations } = this.getState();
    let conversation = this.getConversation(website_id, session_id);

    if (!conversation || !conversation.messages) {
      return ;
    }

    for (let index in conversation.messages) {
      if (!conversation.messages[index].read &&
        conversation.messages[index].from === "user") {

        if (conversation.messages[index].fingerprint) {
          fingerprints.push(conversation.messages[index].fingerprint);
        }
      }
    }
    ConversationsApi.markAsRead(website_id, session_id, fingerprints);
  }
}

module.exports = alt.createStore(ConversationsStore, 'ConversationsStore');
