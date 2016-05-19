import alt                  from "../../alt";
import ConversationsApi     from "../../api/conversations";
import AvatarUtil           from "../../utils/avatar";
import GiftedMessenger      from "react-native-gifted-messenger";
import ResolveBar           from "./resolve-bar";
import MiniSignal           from 'mini-signals';
import {Actions}            from "react-native-router-flux";
import ExtraDimensions      from "react-native-extra-dimensions-android";
import React, {
  Linking,
  Platform,
  ActionSheetIOS,
  Dimensions,
  View,
  Text,
  Navigator,
  Component
} from 'react-native';

export const ConversationPageSignal = new MiniSignal();

class ConversationPage extends Component {

  constructor(props) {
    super(props);

    this.session_id = props.session_id;
    this.website_id = props.website_id;

    alt.current_session_id = props.session_id;

    this._isMounted = false;

    this.UserActions          = alt.getActions('UserActions');
    this.UserStore            = alt.getStore('UserStore');

    this.ConversationsActions = alt.getActions('ConversationsActions');
    this.ConversationsStore   = alt.getStore('ConversationsStore');

    this.state = this._getStateFromStores();
  }

  componentDidMount() {
    this._isMounted = true;
    ConversationsApi.getOne(this.website_id, this.session_id);
    this.ConversationsStore.listen( this._onChange.bind(this) );
    this.binding = ConversationPageSignal.add(this.goToUserInformations.bind(this));
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.ConversationsStore.unlisten( this._onChange.bind(this) );
    this.binding.detach();
  }

  _onChange() {
    this.setState(this._getStateFromStores());
  }

  _getStateFromStores() {
    let conversation =
      alt.getStore('ConversationsStore')
        .getConversation(this.website_id, this.session_id);
    if (!conversation.messages)
      return {
        messages: []
      };

    let typingMessage = "";
    let messages = [];
    let index = 0;
    let max_index = conversation.messages.length - 1;

    conversation.messages.forEach((_raw_message) => {
      let message = {};
      if (typeof _raw_message.content === 'string')
        message.text = _raw_message.content;
      else if (_raw_message.type === 'file')
        message.text = _raw_message.content.url;
      message.name = conversation.meta.nickname;
      message.position = _raw_message.from === 'operator' ? 'right' : 'left';
      if (message.timestamp)
        message.date =  new Date(message.timestamp);
      else
        message.date = Date.now();
      if (message.fingerprint)
        message.uniqueId = Math.abs(message.fingerprint);
      else
        message.uniqueId = Math.round(Math.random() * 10000);
      if (_raw_message.from !== 'operator' && index == max_index)
        message.image = {uri: AvatarUtil.format("visitor", this.session_id)};
      messages.push(message);
      index++;
    });

    alt.getStore('ConversationsStore')
      .markAsRead(this.website_id, this.session_id);

    if (conversation.composing)
      typingMessage = conversation.excerpt;
    return {
      messages: messages,
      typingMessage: typingMessage,
      state : conversation.state,
      meta : conversation.meta
    };
  }

  setMessages(messages) {
    this._messages = messages;

    // append the message
    this.setState({
      messages: messages,
    });
  }

  handleSend(message = {}) {
    let me = alt.getStore('UserStore').getProfile();
    // Generate message
    let raw_message = {
      type        : "text",
      origin      : "chat",
      from        : "operator",

      content     : message.text,

      user        : {
        nickname   :  me.first_name,
        avatar_url :  AvatarUtil.format("operator", me.user_id)
      },

      timestamp   : Date.now(),
      fingerprint : ConversationsApi.getFingerprint()
    };

    // Send the task
    ConversationsApi.sendMessage(
      this.website_id, this.session_id, raw_message
    );

    alt.getStore('ConversationsStore')
      .getConversation(this.website_id, this.session_id)
      .state = 'unresolved';
  }

  goToUserInformations() {
    Actions.infos_user({
      title      : this.state.meta.nickname,
      session_id : this.session_id,
      website_id : this.website_id
    });
  }

  render() {
    return (
      <View style={{marginTop: Navigator.NavigationBar.Styles.General.NavBarHeight + 9}}>
        <ResolveBar {...this.props} />
        <GiftedMessenger
          ref={(c) => this._GiftedMessenger = c}
          styles={{
            bubbleLeft: {
              backgroundColor: '#F1F1F1',
            },
            bubbleRight: {
              marginLeft: 70,
              backgroundColor: '#3395E8',
            }
          }}

          loadEarlierMessagesButton={false}
          autoFocus={true}
          messages={this.state.messages}
          handleSend={this.handleSend.bind(this)}
          maxHeight={Dimensions.get('window').height - Navigator.NavigationBar.Styles.General.NavBarHeight - 70 - ExtraDimensions.get('STATUS_BAR_HEIGHT')}
          senderImage={null}
          displayNames={true}
          parseText={true}
          handlePhonePress={this.handlePhonePress}
          handleUrlPress={this.handleUrlPress}
          handleEmailPress={this.handleEmailPress}
          typingMessage={this.state.typingMessage}
        />
      </View>
    );
  }

  handleUrlPress(url) {
    Linking.openURL(url);
  }

  // TODO
  // make this compatible with Android
  handlePhonePress(phone) {

  }

  handleEmailPress(email) {

  }

}

export default ConversationPage;
