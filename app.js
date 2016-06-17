'use strict';

import React                      from 'react-native';
import EStyleSheet                from 'react-native-extended-stylesheet';
import {Actions, Scene, Router}   from 'react-native-router-flux';

import LoaderPage                 from './components/loader/loader';
import InitiatePage               from './components/initiate/initiate';
import LoginPage                  from './components/login/login';
import MenuPage                   from './components/inbox/menu';
import ConversationPage           from './components/conversation/conversation';
import InfosUserPage              from './components/infos-user/infos-user';
import SignupCredentialsPage      from './components/signup/signup_credentials';
import SignupWebsitePage          from './components/signup/signup_website';
import SignupDonePage             from './components/signup/signup_done';

import ShowMenuImg                from './components/inbox/images/show_menu.png';
import ShowSearchImg              from './components/inbox/images/show_search.png';
import BackMenuImg                from './components/inbox/images/back_menu.png';
import UserDetailImg              from './components/conversation/images/user_details.png';

import alt                        from './alt';
import ConversationActions        from './actions/conversations';
import ConversationStore          from './stores/conversations';
import UserActions                from './actions/user';
import UserStore                  from './stores/user';

import {MenuPageSignal}           from './components/inbox/menu';
import {ConversationPageSignal}   from './components/conversation/conversation';

var {AppRegistry, Navigator, StyleSheet, View} = React;

var styles = EStyleSheet.create({
  AppBar: {
    backgroundColor: "#468EE5",
    elevation: 8,
    '@media android': {
      shadowColor: "#000000",
      shadowOpacity: 0.4,
      shadowRadius: 5,
      shadowOffset: {
        height: 5,
        width: 0
      }
    }
  },
  AppBarTitle: {
    color: 'white'
  },
  AppBarShowMenu : {
    width: 20,
    height: 13,
    marginLeft: 10
  },
  AppBarBackMenu : {
    marginLeft: 10
  },
  AppBarShowSearch : {
    width: 20,
    height: 20,
    marginRight: 6
  },
  AppBarUserDetail : {
    width: 20,
    height: 20,
    marginRight: 6,
    resizeMode: 'contain'
  },
  AppBarText: {
    color: '#1A3066'
  }
});

EStyleSheet.build(styles);

class Crisp extends React.Component {

    constructor () {
      super();
    }

    render() {
        return (
          <Router >
            <Scene key="root">
                <Scene
                  key = "loader"
                  component = {LoaderPage}
                  hideNavBar={true}
                  initial = {true}
                />
                <Scene
                  type = "reset"
                  key = "initiate"
                  component = {InitiatePage}
                  hideNavBar={true}
                />
                <Scene
                  key = "login"
                  title = "Sign in"
                  hideNavBar={true}
                  component = {LoginPage}
                  navigationBarStyle = {styles.AppBar}
                  rightButtonTextStyle = {styles.AppBarText}
                  backButtonImage = {BackMenuImg}
                  titleStyle = {styles.AppBarTitle}
                  rightTitle="Forgot"
                  onRight={()=>Actions.conversation({})}
                />
                <Scene
                  key = "navigation"
                  type = "reset"
                  title = "Crisp"
                  component = {MenuPage}
                  navigationBarStyle = {styles.AppBar}
                  titleStyle = {styles.AppBarTitle}
                  leftButtonImage = {ShowMenuImg}
                  leftButtonIconStyle = {styles.AppBarShowMenu}
                  onLeft={()=>MenuPageSignal.dispatch()}
                />
                <Scene
                  key = "conversation"
                  title = "Crisp"
                  component = {ConversationPage}
                  navigationBarStyle = {styles.AppBar}
                  titleStyle = {styles.AppBarTitle}
                  backButtonImage = {BackMenuImg}
                  rightButtonImage = {UserDetailImg}
                  rightButtonIconStyle = {styles.AppBarUserDetail}
                  onRight={()=>ConversationPageSignal.dispatch()}
                />
                <Scene
                  key = "infos_user"
                  title = "Infos User"
                  component = {InfosUserPage}
                  navigationBarStyle = {styles.AppBar}
                  titleStyle = {styles.AppBarTitle}
                  backButtonImage = {BackMenuImg}
                />
                <Scene
                  key = "signup_credentials"
                  title = "Signup"
                  component = {SignupCredentialsPage}
                  hideNavBar={true}
                />
                <Scene
                  key = "signup_website"
                  title = "Signup"
                  component = {SignupWebsitePage}
                  hideNavBar={true}
                />
                <Scene
                  key = "signup_done"
                  title = "Signup"
                  component = {SignupDonePage}
                  hideNavBar={true}
                />
            </Scene>
        </Router>
      );
    }
}

export default Crisp;
