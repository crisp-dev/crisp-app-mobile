import React                 from 'react-native';
import ConversationsApi      from "../../api/conversations";
import {Actions}             from 'react-native-router-flux';
import EStyleSheet           from 'react-native-extended-stylesheet';
import Swipeout              from 'react-native-swipeout';
import imgStatusResolved     from './images/state_resolved.png';
import imgStatusunResolved   from './images/state_unresolved.png';

import AvatarUtil            from '../../utils/avatar';

var {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  Image,
  View,
  Component
} = React;


var styles = EStyleSheet.create({
  containerDefault: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 0,
    paddingTop: 4,
    paddingBottom: 4,
  },
  containerPending : {
    backgroundColor: '#FFFBC5',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 0,
    paddingTop: 4,
    paddingBottom: 10,
  },
  avatarOnline: {
    width: 50,
    height: 50,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 25,
    borderColor: '#77E00C',
    borderWidth: 2,
  },
  avatarOffline: {
    width: 50,
    height: 50,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 25,
    borderColor: '#DADADA',
    borderWidth: 2,
  },
  userContainer: {
    flexDirection: 'row'
  },
  name: {
    color: 'black',
    fontWeight: '600',
    fontSize: 15,
    fontFamily: 'Helvetica Neue'
  },
  text: {
    marginTop: 5,
    fontSize: 14,
    color: '#747474',
    fontFamily: 'Helvetica Neue',
    fontWeight: '500'
  },
  rightContainer: {
    flex: 1,
    padding: 10
  },
  statusDefault: {
    backgroundColor: '#88D13E',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: '#77E00C',
    flex: 0,
    marginRight: 10,
    alignItems: 'center'
  },
  statusUnresolved: {
    backgroundColor: '#ED495D',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: '#77E00C',
    flex: 0,
    marginRight: 10,
    alignItems: 'center'
  },
  statusPending: {
    backgroundColor: '#F5A623',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: '#77E00C',
    flex: 0,
    marginRight: 10,
    alignItems: 'center'
  },
  statusImgClass : {
    width: 15,
    height: 15,
    marginTop: 6,
    resizeMode: 'contain'
  }
});

class ConversationItem extends Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  _goConversation(website_id, session_id, meta) {
    Actions.conversation({
      session_id: session_id,
      website_id: website_id,
      title: meta.nickname
    });
  }

  _deleteConversation(website_id, session_id) {
    ConversationsApi.deleteConversation(
      website_id,
      session_id
    );
  }

  _resolveConversation(website_id, session_id) {
    ConversationsApi.setState(
      website_id,
      session_id,
      'resolved'
    );
  }

  render() {
    var {
      last_message,
      state,
      availability,
      meta,
      session_id,
      website_id
    } = this.props;

    if (!meta)
      meta = {};

    var avatarUrl = AvatarUtil.format("visitor", session_id);
    var containerClass = styles.containerDefault;
    var avatarClass = styles.avatarOffline;
    var statusClass = styles.statusDefault;
    var statusImg = imgStatusResolved;

    if (state == 'pending'){
      containerClass = styles.containerPending;
      statusImg = imgStatusunResolved;
      statusClass = styles.statusPending;
    }
    if (availability == 'online')
      avatarClass = styles.avatarOnline;
    if (state == 'unresolved'){
      statusImg = imgStatusunResolved;
      statusClass = styles.statusUnresolved;
    }

    var swipeoutRightBtns = [
    {
      text: 'Delete',
      autoClose: true,
      backgroundColor: "#F06074",
      onPress: () => {
        this._deleteConversation(website_id, session_id)
      }
    }];

    var swipeoutLeftBtns = [
    {
      text: 'Resolve',
      autoClose: true,
      backgroundColor: "#9BD956",
      onPress: () => {
        this._resolveConversation(website_id, session_id)
      }
    }];

    return (
      <Swipeout
        autoClose={true}
        right={swipeoutRightBtns}
        left={swipeoutLeftBtns}>
        <TouchableNativeFeedback
          underlayColor='transparent'
          onPress={() => {this._goConversation(website_id, session_id, meta)}}>
          <View style={containerClass}>
            <Image source={{uri: avatarUrl}} style={avatarClass} />
            <View style={styles.rightContainer}>
              <View style={styles.userContainer}>
                <Text style={styles.name}>{meta.nickname}</Text>
              </View>
              <Text style={styles.text} numberOfLines={3}>{last_message}</Text>
            </View>
            <View style={statusClass}>
              <Image source={statusImg} style={styles.statusImgClass}/>
            </View>
          </View>
        </TouchableNativeFeedback>
      </Swipeout>
    )
  }
}

export default ConversationItem;
