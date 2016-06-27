import React          from 'react-native';
import {Actions}      from 'react-native-router-flux';
import EStyleSheet    from 'react-native-extended-stylesheet';
import ViewPager      from 'react-native-viewpager';
import AuthApi        from '../../api/auth';
import WebsiteUtils   from '../../utils/website';
import ImgLogo        from './../initiate/images/logo.png';
import Spinner        from 'react-native-loading-spinner-overlay';
import alt            from "../../alt";

var {
  Text,
  View,
  Dimensions,
  Image,
  TextInput,
  TouchableHighlight,
  Component,
  ScrollView
} = React;

var styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  logoContainer: {
    backgroundColor: '#468EE5',
    marginBottom: '7%',
    width: '100%',
    alignItems: 'center',
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {
      height: 3,
      width: 0
    },
    elevation: 5
  },
  logo : {
    width: '50%',
    height: 250,
    resizeMode: 'contain'
  },
  title: {
    marginBottom: '4%',
    fontSize: 19
  },
  input : {
    height: 44,
    fontSize: 17,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    textAlign: 'center',
    width: '80%',
    borderRadius: 1,
    marginBottom: 20,
    marginLeft: '10%'
  },
  separator : {
    backgroundColor: '#B9B8BF',
    opacity: 0.5,
    height: 1,
    width: '100%'
  },
  button : {
    marginTop: '3%'
  },
  buttonText : {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600'
  }
});

class LoginPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error : false,
      loading: false
    };
    this.login_retries = 0;
  }

  inputFocused(refName) {
    setTimeout(() => {
      // Note the this.refs.scrollView -- the ScrollView element to be
      // handled must have the ref='scrollView' for this to work.
      let scrollResponder = this.refs.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(this.refs[refName]),
        110, //additionalOffset
        true
      );
    }, 50);
  }

  render() {
    return (
      <ScrollView style={{backgroundColor: 'white'}} contentContainerStyle={styles.container} ref='scrollView' keyboardDismissMode='interactive'>
        <View style={styles.logoContainer}>
          <Image
            source = {ImgLogo}
            style = {styles.logo}
          />
        </View>

        <Text style={styles.title}>Sign in to your Crisp account</Text>

        <TextInput
          ref='email'
          autoCorrect={false}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholder="Enter your e-mail..."
          placeholderTextColor="#8E8E93"
          value={this.state.email}
          onFocus={this.inputFocused.bind(this, 'email')}
          onChangeText={email => this.setState({email})}
        />

        <TextInput
          ref='password'
          autoCapitalize="none"
          secureTextEntry={true}
          autoCorrect={false}
          style={styles.input}
          placeholder="Enter your password..."
          placeholderTextColor="#8E8E93"
          value={this.state.password}
          onChangeText={password => this.setState({password})}
          onFocus={this.inputFocused.bind(this, 'password')}
        />

        <Text style={{color: '#ED4021'}}>{this.state.error ? "Your credentials are invalid": ""}</Text>

        <TouchableHighlight
          underlayColor='transparent'
          style={styles.button}
          onPress={() => {this._login()}}>
          <View style={{backgroundColor: "#4A90E2", borderRadius: 3, height: 40, paddingTop: 9, paddingLeft: 50, paddingRight: 50}}>
            <Text style={styles.buttonText}>Sign in</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor='transparent'
          onPress={()=>Actions.pop({})}>
            <Text style={{color: '#4A90E2', fontSize: 18, marginTop: 15}} >Back</Text>
        </TouchableHighlight>
        <Spinner visible={this.state.loading} />
      </ScrollView>

    );
  }

  _login() {
    this.setState({
      loading: true,
      error: false
    });
    const { email, password } = this.state;

    AuthApi.login(email, password).then(user_id => {
      WebsiteUtils.get_default().then(website => {

        alt.track({
          event_type : "Logged in",
          event_properties : {
            email  : email,
            source : "mobile",
            mode   : "standard"
          },
          user_properties: {
            email      : email,
            last_login : new Date()
          }
        });

        this.setState({
          loading: false,
          error: false
        });

        Actions.navigation({
          title: website.name,
          current_website: website
        });

      });
    }).catch((e) => {
      if (this.login_retries != 2) {
        this.login_retries++;
        this._login();
      }
      else {
        this.setState({
          loading: false,
          error: true
        });
      }
    });
  };
}

export default LoginPage;
