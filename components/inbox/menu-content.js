import React                from 'react-native';
import EStyleSheet          from 'react-native-extended-stylesheet';
import {Actions}            from 'react-native-router-flux';

import UserApi              from '../../api/user';
import AvatarUtil           from '../../utils/avatar';
import WebsiteUtils         from '../../utils/website';
import alt                  from '../../alt';
import AuthApi              from '../../api/auth';

var {
  Component,
  View,
  ListView,
  Text,
  Image,
  TouchableHighlight
} = React;

import {InboxPageSignal} from './inbox';
import {MenuPageSignal} from './menu';


var styles = EStyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    borderBottomWidth: 1,
    borderColor: 0,
    paddingTop: 4,
    paddingBottom: 4,
  },
  sectionText : {
    fontSize: 16,
    marginBottom: 6,
    color: 'black',
    opacity: 0.87,
    fontWeight: '300',
    marginLeft: 15
  },
  websiteLogo: {
    width: 36,
    height: 36,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 18,
  },
  websiteText: {
    marginTop: 4,
    fontSize: 16,
    color: 'black',
    fontFamily: 'Helvetica Neue',
    fontWeight: '500'
  }
});

var  data_store    =
  new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class MenuContent extends Component {

  constructor (props) {
    super(props);
    this.websites_list = data_store.cloneWithRows([]);
    this.UserActions   = alt.getActions('UserActions');
    this.UserStore     = alt.getStore('UserStore');

    this.current_website = props.current_website;

    this.state = this._getStateFromStores();
  }

  componentDidMount() {
    UserApi.getWebsites();
    UserApi.getProfile();
    this.UserStore.listen( this._onChange.bind(this) );
  }

  componentWillUnmount() {
    this.UserStore.unlisten( this._onChange.bind(this) );
  }

  _getStateFromStores() {
    let websites = [];
    let me = {};
    try {
      websites = alt.getStore('UserStore').getWebsites();
      me       = alt.getStore('UserStore').getProfile();
    }
    catch (e) {

    }
    return {
      websites      : websites,
      websites_list : data_store.cloneWithRows(websites),
      me            : me
    };
  }

  _onChange() {
    this.setState(this._getStateFromStores());
  }

  _changeWebsite(new_website) {
    InboxPageSignal.dispatch(new_website);
    MenuPageSignal.dispatch();
    this.current_website = new_website;
    WebsiteUtils.set_default(new_website);
    Actions.refresh({
      title: new_website.name
    });
  }

  _logout() {
    AuthApi.logout().then(() => {
      Actions.loader();
    });
  }

  render () {
    return (
      <View style={{marginTop: 90}}>
        <Text style={styles.sectionText}>My Websites</Text>
        <ListView
          dataSource={this.state.websites_list}
          scrollEnabled={false}
          style={{marginBottom: 10}}
          renderRow={
            (website) =>
              <TouchableHighlight
              underlayColor='transparent'
              onPress={() => {this._changeWebsite(website)}}>
                <View style={styles.itemContainer}>
                  <Image source={{uri: AvatarUtil.format("website", website.id)}} style={styles.websiteLogo} />
                  <Text style={styles.websiteText}>{website.name}</Text>
                </View>
              </TouchableHighlight>
          }
        />
        <TouchableHighlight
          underlayColor='transparent'
          onPress={() => {this._logout()}}>
          <Text style={styles.sectionText}>Logout</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

export default MenuContent;
