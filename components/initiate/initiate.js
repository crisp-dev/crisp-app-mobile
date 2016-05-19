import React        from 'react-native';
import {Actions}    from 'react-native-router-flux';
import EStyleSheet  from 'react-native-extended-stylesheet';
import ViewPager    from 'react-native-viewpager';

import ImgLogo      from './images/logo.png';
import Item1        from './images/item_1.png';
import Item2        from './images/item_2.png';
import Item3        from './images/item_3.png';

import Animatable   from 'react-native-animatable';

var {
  Text,
  View,
  Dimensions,
  Image,
  TouchableHighlight
} = React;

var deviceWidth = Dimensions.get('window').width;

var pages = [
  {
    headline: 'Help clients on the go',
    subline: 'Crisp is available on all your devices',
    img: Item1
  },
  {
    headline: 'It\'s time to talk to your customers!',
    subline: 'All the features, right in your hand',
    img: Item2
  },
  {
    headline: 'Your availability schedule',
    subline: 'Appear offline when you don\'t want to work',
    img: Item3
  },
  {
    headline: 'Here we go',
    subline: 'No account? Let\'s create one',
    final: true
  }
];

var styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#468EE5',
  },
  page: {
    width: deviceWidth,
    flex: 0.7,
    alignItems: 'center',
  },
  logo_container: {
    alignItems: 'center'
  },
  logo : {
    marginTop: '2%',
    width: '50%',
    height: 200,
    resizeMode: 'contain'
  },
  img_explainer : {
    flex: 0.4,
    width: '70%',
    height: 300,
    resizeMode: 'contain'
  },
  headline: {
    flex: 0.1,
    alignItems: 'center',
    marginTop: '5%',
    fontSize: 20,
    color: 'white',
    fontWeight: '300'
  },
  subline: {
    marginBottom: '7%',
    fontSize: 17,
    color: 'white',
    fontWeight: '300',
    opacity: 0.8
  },
  final_headline: {
    flex: 0.1,
    marginTop: 100,
    fontSize: 28,
    color: 'white',
    fontWeight: '300'
  },
  final_subline: {
    marginBottom: '10%',
    fontSize: 18,
    color: 'white',
    fontWeight: '300',
    opacity: 0.8
  },
  button : {
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 50,
    paddingRight: 50,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 2
  },
  buttonText : {
    fontSize: 17,
    color: '#468EE5'
  }
});

var InitiatePage = React.createClass({
  getInitialState: function() {
    var dataSource = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2,
    });

    return {
      dataSource: dataSource.cloneWithPages(pages),
    };
  },

  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.logo_container}>
          <Image
            source={ImgLogo}
            style={styles.logo}
          />
        </View>
        <ViewPager
          ref={(viewpager) => {this.viewpager = viewpager}}
          style={this.props.style}
          dataSource={this.state.dataSource}
          renderPage={this._renderPage}
          isLoop={false}
          autoPlay={false}/>
      </View>

    );
  },

  _renderPage: function(data: Object,pageID: number | string)
    {
      let default_page = (
        <View style={styles.page}>
          <Animatable.Text animation="fadeInUp" style={styles.headline} >{data.headline}</Animatable.Text>
          <Animatable.Image
            source={data.img}
            animation="fadeIn"
            style={styles.img_explainer}
          />
          <Text style={styles.subline} >{data.subline}</Text>
        </View>
      );
      let final_page = (
        <View style={styles.page}>
          <Animatable.Text animation="bounce" iterationCount={'infinite'} style={styles.final_headline} >{data.headline}</Animatable.Text>
          <TouchableHighlight
            underlayColor='transparent'
            style={styles.button}
            onPress={()=>Actions.login({})}>
            <View>
              <Text style={styles.buttonText}>Sign in</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
          underlayColor='transparent'
          onPress={()=>Actions.signup_credentials({})}>
            <Text style={styles.final_subline} >{data.subline}</Text>
          </TouchableHighlight>
        </View>
      );
      if (!data.final)
        return default_page;
      else
        return final_page;
  },
});

export default InitiatePage;
