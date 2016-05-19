import EStyleSheet          from 'react-native-extended-stylesheet';
import imgStatusResolved    from '../inbox/images/state_resolved.png';
import alt                  from "../../alt";
import ConversationsApi     from "../../api/conversations";

import React, {
  View,
  Text,
  Component,
  Image,
  TouchableHighlight
} from "react-native";


var styles = EStyleSheet.create({
  unresolved_container : {
    height: 50,
    backgroundColor: '#ED495D',
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  resolved_container : {
    height: 50,
    backgroundColor: '#88D13E',
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  pending_container : {
    height: 50,
    backgroundColor: '#F6A622',
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  separator: {
    height: 1,
    backgroundColor: '#EEEEEE'
  },
  text: {
    marginTop: 2,
    color: 'white',
    fontSize: 15
  }
});

class ResolveBar extends Component {

  constructor(props) {
    super(props);
    this.website_id = this.props.website_id;
    this.session_id = this.props.session_id;

    this.ConversationsActions = alt.getActions('ConversationsActions');
    this.ConversationsStore   = alt.getStore('ConversationsStore');

    this.state = this._getStateFromStores();
  }

  componentDidMount() {
    this._isMounted = true;
    this.ConversationsStore.listen( this._onChange.bind(this) );
  }

  componentWillUnmount() {
    this._isMounted = false;
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
      state: conversation.state
    };
  }

  _updateStatus(state) {
    alt.getStore('ConversationsStore').getConversation(
      this.website_id, this.session_id).state = state;

    ConversationsApi.setState(
      this.website_id, this.session_id, state
    );

    alt.getStore('ConversationsStore')
      .markAsRead(this.website_id, this.session_id);
  }

  render() {
    let unresolved = (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={() => {this._updateStatus('resolved')}}>
        <View>
          <View style={styles.unresolved_container}>
            <Text style={styles.text}>MARK RESOLVED</Text>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
    let resolved = (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={() => {this._updateStatus('unresolved')}}>
        <View>
          <View style={styles.resolved_container}>
            <Text style={styles.text}>THIS CONVERSATION HAD BEEN RESOLVED</Text>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
    let pending = (
      <View>
        <View style={styles.pending_container}>
          <Text style={styles.text}>THIS CONVERSATION IS PENDING</Text>
        </View>
        <View style={styles.separator}/>
      </View>
    );

    if (this.state.state == 'resolved')
      return resolved;
    else if (this.state.state == 'pending')
      return pending;
    else
      return unresolved;
  }

}


module.exports = ResolveBar;
