import React        from 'react-native';
import {Actions}    from 'react-native-router-flux';
import EStyleSheet  from 'react-native-extended-stylesheet';
import ViewPager    from 'react-native-viewpager';
import Spinner      from 'react-native-loading-spinner-overlay';

import ImgLogo      from '../initiate/images/logo.png';
import AuthApi      from '../../api/auth';
import WebsiteUtils from '../../utils/website';

var {
  Component,
  Text,
  View,
  Dimensions,
  Image
} = React;

var styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#468EE5',
    alignItems:'center'
  },
  logo_container: {
    alignItems: 'center'
  },
  logo : {
    width: '50%',
    height: 200,
    resizeMode: 'contain'
  }
});

class LoaderPage extends Component {

  constructor(props) {
    super();
    this.state = {
      visible: true
    };
  }
  componentDidMount() {
    setTimeout(() => {
      AuthApi.auto_login().then(() => {
        return WebsiteUtils.get_default().then(website => {
          this.setState({
            visible: false
          });
          Actions.navigation({
            title: website.name,
            current_website: website
          });
          //return Promise.resolve();
        });
      }).catch((e) => {
        this.setState({
          visible: false
        });
        Actions.initiate({});
      });
    }, 500);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logo_container}>
          <Image
            source={ImgLogo}
            style={styles.logo}
          />
        </View>
       <Spinner visible={this.state.visible} />
      </View>
    );
  }
}

export default LoaderPage;
