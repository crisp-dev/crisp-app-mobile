import React        from 'react-native';
import {Actions}    from 'react-native-router-flux';
import EStyleSheet  from 'react-native-extended-stylesheet';
import ViewPager    from 'react-native-viewpager';
import AuthApi      from '../../api/auth';
import WebsiteApi   from '../../api/websites';
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

class SignupWebsitePage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      domain: '',
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

        <Text style={styles.title}>Now, create your first website!</Text>

        <TextInput
          ref="name"
          autoCorrect={false}
          autoCapitalize="none"
          style={styles.input}
          placeholder="Your website name (example)"
          placeholderTextColor="#8E8E93"
          value={this.state.name}
          onChangeText={name => this.setState({name})}
          onFocus={this.inputFocused.bind(this, 'name')}
        />

        <TextInput
          ref="domain"
          autoCorrect={false}
          autoCapitalize="none"
          style={styles.input}
          placeholder="Website domain (example.com)"
          placeholderTextColor="#8E8E93"
          value={this.state.domain}
          onChangeText={domain => this.setState({domain})}
          onFocus={this.inputFocused.bind(this, 'domain')}
        />


        <Text style={{color: '#ED4021'}}>{this.state.error ? "An error occured. Did you filled all the inputs?": ""}</Text>

        <TouchableHighlight
          underlayColor='transparent'
          style={styles.button}
          onPress={this._create}>
          <View style={{backgroundColor: "#4A90E2", borderRadius: 3, height: 40, paddingTop: 9, paddingLeft: 50, paddingRight: 50}}>
            <Text style={styles.buttonText}>Next</Text>
          </View>
        </TouchableHighlight>
        <Spinner visible={this.state.loading} />
      </ScrollView>

    );
  }

  _create = () => {
    this.setState({
      loading: true,
      error: false
    });
    const { name, domain } = this.state;

    WebsiteApi.create(name, domain).then(() => {
      this.setState({
        loading: false,
        error: false
      });
      Actions.signup_done({});
    }).catch((e) => {
      this.setState({
        loading: false,
        error: true
      });
    });
  };
}

export default SignupWebsitePage;
