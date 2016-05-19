import EStyleSheet          from 'react-native-extended-stylesheet';
import alt                  from "../../alt";
import ConversationsApi     from "../../api/conversations";
import AvatarUtil           from "../../utils/avatar";
import LocationImg          from "./images/location.png"

import React, {
  View,
  Text,
  Component,
  Image
} from 'react-native';


var styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  avatarContainer: {
    marginTop: 50,
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 50,
    borderColor: '#DADADA',
    borderWidth: 2,
  },
  name: {
    fontSize: 18,
    marginTop: 7
  },
  email: {
    fontSize: 16,
    marginTop: 7,
    color: '#8E8E93'
  },
  itemContainer: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10
  },
  browserName: {
    fontSize: 18,
    flex: 1,
    marginTop: 1
  },
  browserImage: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    marginLeft: 20,
    marginRight: 20
  },
  visitedName: {
    fontSize: 18,
    flex: 1,
    marginTop: 1,
    marginLeft: 60
  },
  separator : {
    backgroundColor: '#B9B8BF',
    opacity: 0.5,
    height: 1,
    width: '100%'
  }
});

class InfosUserPage extends Component {

  constructor(props) {
    super(props);

    this.session_id = props.session_id;
    this.website_id = props.website_id;

    this.ConversationsActions = alt.getActions('ConversationsActions');
    this.ConversationsStore   = alt.getStore('ConversationsStore');

    this.state = this._getStateFromStores();
  }

  componentDidMount() {
    this.ConversationsStore.listen( this._onChange.bind(this) );
  }

  componentWillUnmount() {
    this.ConversationsStore.unlisten( this._onChange.bind(this) );
  }

  _onChange() {
    this.setState(this._getStateFromStores());
  }

  _getStateFromStores() {
    let conversation =
      alt.getStore('ConversationsStore')
        .getConversation(this.website_id, this.session_id);

    return {
      conversation: conversation
    };
  }

  render() {
    var avatarUrl = AvatarUtil.format("visitor", this.session_id);
    var avatarClass = styles.avatar;
    var browsing = {};

    var nickname = "";
    var email = "";
    var browserName = "";
    var browserVersion = "";
    var osName = "";
    var osVersion = "";
    var city = "";
    var country = "";
    var pages = 0;

    if (this.state.conversation && this.state.conversation.meta &&
      this.state.conversation.meta.nickname) {
      nickname = this.state.conversation.meta.nickname;
    }
    if (this.state.conversation && this.state.conversation.meta &&
      this.state.conversation.meta.email) {
      email = this.state.conversation.meta.email;
    }
    if (this.state.conversation && this.state.conversation.meta &&
      this.state.conversation.meta.browsing_informations) {
      browsing = this.state.conversation.meta.browsing_informations;
    }

    if (browsing.system &&
      browsing.system.browser &&
      browsing.system.browser.name) {
      browserName = browsing.system.browser.name;
    }
    if (browsing.system &&
      browsing.system.browser &&
      browsing.system.browser.major) {
      browserVersion = browsing.system.browser.major;
    }
    if (browsing.system &&
      browsing.system.os &&
      browsing.system.os.name) {
      osName = browsing.system.os.name;
    }
    if (browsing.system &&
      browsing.system.os &&
      browsing.system.os.name) {
      osVersion = browsing.system.os.version;
    }
    if (browsing.geolocation && browsing.geolocation.country) {
      country = browsing.geolocation.country;
    }
    if (browsing.geolocation && browsing.geolocation.city) {
      city = browsing.geolocation.city;
    }
    if (this.state.conversation.meta.pages) {
      pages = this.state.conversation.meta.pages.length;
    }

    var browserImage = require('./images/default.png');
    if (browserName.toLowerCase().indexOf('chrome') >= 0)
      browserImage = require('./images/chrome.png');
    if (browserName.toLowerCase().indexOf('firefox') >= 0)
      browserImage = require('./images/firefox.png');
    if (browserName.toLowerCase().indexOf('edge') >= 0)
      browserImage = require('./images/edge.png');
    if (browserName.toLowerCase().indexOf('internet-explorer') >= 0)
      browserImage = require('./images/internet-explorer.png');
    if (browserName.toLowerCase().indexOf('opera') >= 0)
      browserImage = require('./images/opera.png');
    if (browserName.toLowerCase().indexOf('safari') >= 0)
      browserImage = require('./images/safari.png');
    return (
      <View style={{marginTop: 60}}>
        <View style={styles.avatarContainer}>
          <Image source={{uri: avatarUrl}} style={avatarClass} />
          <Text style={styles.name}>{nickname}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <View style={{marginTop: 20}} />
        <View style={styles.separator}/>
        <View style={styles.itemContainer}>
          <Image source={browserImage} style={styles.browserImage} />
          <Text style={styles.browserName}>
          {browserName} {browserVersion} , {osName} {osVersion}</Text>
        </View>
        <View style={styles.separator}/>
        <View style={styles.itemContainer}>
          <Image source={LocationImg} style={styles.browserImage} />
          <Text style={styles.browserName}>{city} {country}</Text>
        </View>
        <View style={styles.separator}/>
        <View style={{marginTop: 20}} />
        <View style={styles.separator}/>
        <View style={styles.itemContainer}>
          <Text style={styles.visitedName}>{pages} pages visited</Text>
        </View>
        <View style={styles.separator}/>
      </View>
    );
  }
}


module.exports = InfosUserPage;
