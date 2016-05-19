import React        from 'react-native';
import {Actions}    from 'react-native-router-flux';
import EStyleSheet  from 'react-native-extended-stylesheet';
import ViewPager    from 'react-native-viewpager';
import AuthApi      from '../../api/auth';
import UserApi      from '../../api/user';
import WebsiteUtils from '../../utils/website';
import ImgLogo      from './../initiate/images/logo.png';
import Spinner      from 'react-native-loading-spinner-overlay';

var {
  Text,
  View,
  Dimensions,
  Image,
  TextInput,
  TouchableHighlight,
  Component,
  ScrollView,
  Linking
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
    width: '30%',
    height: 150,
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

class SignupCredentialsPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      error : false,
      loading: false
    };
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

        <Text style={styles.title}>Let's create your account!</Text>

        <TextInput
          ref="email"
          autoCorrect={false}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholder="Provide an e-mail..."
          placeholderTextColor="#8E8E93"
          value={this.state.email}
          onChangeText={email => this.setState({email})}
          onFocus={this.inputFocused.bind(this, 'email')}
        />

        <TextInput
          ref='password'
          autoCapitalize="none"
          secureTextEntry={true}
          autoCorrect={false}
          style={styles.input}
          placeholder="Enter a password..."
          placeholderTextColor="#8E8E93"
          value={this.state.password}
          onChangeText={password => this.setState({password})}
          onFocus={this.inputFocused.bind(this, 'password')}
        />

        <TextInput
          ref='first_name'
          style={styles.input}
          autoCorrect={false}
          placeholder="Enter your Firstname..."
          placeholderTextColor="#8E8E93"
          value={this.state.first_name}
          onChangeText={first_name => this.setState({first_name})}
          onFocus={this.inputFocused.bind(this, 'first_name')}
        />

        <TextInput
          ref='last_name'
          style={styles.input}
          autoCorrect={false}
          placeholder="Enter your Lastname..."
          placeholderTextColor="#8E8E93"
          value={this.state.last_name}
          onChangeText={last_name => this.setState({last_name})}
          onFocus={this.inputFocused.bind(this, 'last_name')}
        />

        <Text style={{color: '#ED4021'}}>{this.state.error ? "An error occured. Did you filled all the inputs?": ""}</Text>

         <TouchableHighlight
          underlayColor='transparent'
          onPress={()=>Linking.openURL("https://crisp.im/terms/")}>
            <Text style={{color: '#4A90E2', fontSize: 18, marginTop: 8}} >Terms and Conditions</Text>
        </TouchableHighlight>

        <TouchableHighlight
          underlayColor='transparent'
          style={styles.button}
          onPress={this._register}>
          <View style={{backgroundColor: "#4A90E2", borderRadius: 3, height: 40, paddingTop: 8, paddingLeft: 50, paddingRight: 50}}>
            <Text style={styles.buttonText}>Next</Text>
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

  _register = () => {
    this.setState({
      loading: true,
      error: false
    });
    const { email, password, first_name, last_name } = this.state;

    UserApi.create(email, password, first_name, last_name).then(() => {
      return AuthApi.login(email, password).then(user_id => {
        this.setState({
          loading: false,
          error: false
        });
        Actions.signup_website({});
      });
    }).catch((e) => {
      this.setState({
        loading: false,
        error: true
      });
    });
  };
}

export default SignupCredentialsPage;
