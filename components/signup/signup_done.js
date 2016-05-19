import React        from 'react-native';
import {Actions}    from 'react-native-router-flux';
import EStyleSheet  from 'react-native-extended-stylesheet';
import ViewPager    from 'react-native-viewpager';
import WebsiteUtils from '../../utils/website';
import ImgLogo      from './../initiate/images/logo.png';
import DoneLogo     from './../signup/images/check.png';

var {
  Text,
  View,
  Dimensions,
  Image,
  TextInput,
  TouchableHighlight,
  Component
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
  done : {
    height: 90,
    resizeMode: 'contain'
  },
  title: {
    marginBottom: '4%',
    fontSize: 15,
    padding: 10,
    textAlign: 'center'
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
    marginTop: '5%'
  },
  buttonText : {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600'
  }
});

class SignupDonePage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      error : false,
      loading: false
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source = {ImgLogo}
            style = {styles.logo}
          />
        </View>

        <Text style={styles.title}>
        It's done.

        You received your website code on in your mailbox :)</Text>
        <Image
          source = {DoneLogo}
          style = {styles.done}
          />
        <TouchableHighlight
          underlayColor='transparent'
          style={styles.button}
          onPress={this._show}>
          <View style={{backgroundColor: "#4A90E2", borderRadius: 3, height: 40, paddingTop: 9, paddingLeft: 50, paddingRight: 50}}>
            <Text style={styles.buttonText}>Show my inbox</Text>
          </View>
        </TouchableHighlight>
      </View>

    );
  }

  _show = () => {
    this.setState({
      loading: true,
      error: false
    });
    const { name, domain } = this.state;

    WebsiteUtils.get_default().then(website => {
      this.setState({
        loading: false,
        error: false
      });
      Actions.navigation({
        title: website.name,
        current_website: website
      });
    });
  };
}

export default SignupDonePage;
