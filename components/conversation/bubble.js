import React from 'react';
import { Text, View, Image, StyleSheet, Linking, TouchableHighlight } from 'react-native';

import ParsedText     from 'react-native-parsed-text';
import DateUtil       from "../../utils/date";
import imgReadWhite   from './images/read_white.png';

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 3,
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 5,
    paddingTop: 8,
  },
  triangleCorner: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderRightColor: 'transparent',
    borderBottomColor: '#e6e6eb'
  },
  text: {
    color: '#000',
  },
  textLeft: {
  },
  textRight: {
    color: '#fff',
  },
  timestamp: {
    color: '#000',
    opacity: 0.5,
    fontSize: 12
  },
  timestampLeft: {
    textAlign: 'left'
  },
  timestampRight: {
    color: '#fff',
    textAlign: 'right'
  },
  bubbleLeft: {
    marginRight: 70,
    backgroundColor: '#F1F1F1',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0
  },
  bubbleRight: {
    marginLeft: 70,
    backgroundColor: '#3395E8',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0
  },
  read : {
    alignSelf: 'flex-start',
    opacity: 0.5,
    marginTop: 4,
    marginRight: 4,
    width: 6,
    height: 7
  },
  fileLeft : {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#4A4A4A',
    borderRadius: 2,
    textAlign: 'center'
  },
  fileRight : {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 2,
    textAlign: 'center'
  }
});

export default class Bubble extends React.Component {

  componentWillMount() {
    Object.assign(styles, this.props.styles);
  }

  renderRead(read, position) {
    if (read === true && position === 'right') {
      return (
        <Image source={imgReadWhite} style={styles.read} />
      );
    }
    else {
      return null;
    }
  }

  handleUrlPress(url) {
    Linking.openURL(url);
  }

  handleEmailPress(email) {
    Linking.openURL(url);
  }

  handlePhonePress(phone) {
    Linking.openURL("tel:" + phone);
  }

  renderText(content, position) {
    return (
      <ParsedText
      style={[styles.text, (position === 'left' ? styles.textLeft : styles.textRight)]}
      parse={[
        {
          type: 'url',
          style: {
            textDecorationLine: 'underline',
          },
          onPress: this.handleUrlPress,
        },
        {
          type: 'phone',
          style: {
            textDecorationLine: 'underline',
          },
          onPress: this.handlePhonePress,
        },
        {
          type: 'email',
          style: {
            textDecorationLine: 'underline',
          },
          onPress: this.handleEmailPress,
        },
      ]}>
        {content}
      </ParsedText>
    );
  }

  renderFile(content, position) {
    let name = "";
    let display_image = false;
    let image_types = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];

    if (JSON.stringify(image_types).indexOf(content.type) !== -1) {
      display_image = true;
      content.mini_url = `https://image.crisp.im/process/resize/?url=${encodeURI(content.url)}&width=140&height=74`;
    }
    if (content.name)
      name = content.name;

    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Text style={[styles.text, (position === 'left' ? styles.textLeft : styles.textRight)]}>
          {name}
        </Text>
        {display_image ?
          <TouchableHighlight onPress={() => {Linking.openURL(content.url)}}>
            <Image style={{height: 74,width: 140, resizeMode: 'cover', marginTop: 4, marginBottom: 4}} source={{uri: content.mini_url}} />
          </TouchableHighlight>
        : <TouchableHighlight style={(position === 'left' ? styles.fileLeft : styles.fileRight)} onPress={() => {Linking.openURL(content.url)}}>
            <Text style={[[styles.text, (position === 'left' ? styles.textLeft : styles.textRight)], {marginTop: 4, marginBottom: 4, marginLeft: 10, marginRight: 10}]}>
              Download file
            </Text>
          </TouchableHighlight>
        }
      </View>
    );
  }

  renderContent(content, type, date, read, position) {
    return (
      <View>
        {type === 'file' ? this.renderFile(content, position) : this.renderText(content, position)}
        <View style={{flex: 1, flexDirection: 'row'}}>
          {this.renderRead(read, position)}
          <Text style={[styles.timestamp, (position === 'left' ? styles.timestampLeft : styles.timestampRight)]}>
            {DateUtil.format(date)}
          </Text>
        </View>
      </View>
    );
  }

  renderTriangle(position) {
    let triangleStyles = {
      left: {
        borderBottomColor: (styles.bubbleLeft.backgroundColor  || '#F1F1F1'),
        left: -10,
        top: 0,
        transform: [
          {rotate: '180deg'}
        ]
      },
      right: {
        borderBottomColor: (styles.bubbleRight.backgroundColor || '#3395E8'),
        right: -10,
        top: 0,
        transform: [
          {rotate: '90deg'}
        ]
      }
    }
    return (
      <View style={[styles.triangleCorner, triangleStyles[position]]}/>
    );
  }

  render() {
    const flexStyle = {};
    flexStyle.flex = 1;

    return (
      <View style={[flexStyle]}>
        {this.props.position === 'left' ? this.renderTriangle('left') : null}
        <View style={[styles.bubble,
          (this.props.position === 'left' ? styles.bubbleLeft : this.props.position === 'right' ? styles.bubbleRight : styles.bubbleCenter),
          (this.props.status === 'ErrorButton' ? styles.bubbleError : null),
          flexStyle]}
          >
          {this.renderContent(
            this.props.content,
            this.props.type,
            this.props.date,
            this.props.read,
            this.props.position
          )}
        </View>
        {this.props.position === 'right' ? this.renderTriangle('right') : null}
        </View>
  );
  }
}

Bubble.propTypes = {
  position: React.PropTypes.oneOf(['left', 'right']),
  text: React.PropTypes.string,
  type: React.PropTypes.string,
  date: React.PropTypes.number,
  styles: React.PropTypes.object,
  content: React.PropTypes.oneOf([React.PropTypes.string, React.PropTypes.object]),
  read: React.PropTypes.bool
};
