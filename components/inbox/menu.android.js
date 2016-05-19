import React              from 'react-native';
import Drawer             from 'react-native-drawer';
import InboxPage          from './inbox';
import MenuContent        from './menu-content';
import MiniSignal         from "mini-signals";
import NotificationsUtils from "../../utils/notifications";

var {
  Component
} = React;

export const MenuPageSignal = new MiniSignal();

class MenuPage extends Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.is_open = false;
    this.props = props;
  }

  toggle() {
    if (this.is_open)
      this._drawer.close();
    else
      this._drawer.open();
  }

  componentDidMount() {
    this.binding = MenuPageSignal.add(this.toggle);
    NotificationsUtils.configure();
  }

  componentWillUnmount() {
    this.binding.detach();
  }

  render () {
    return (
      <Drawer
        type="static"
        openDrawerOffset={100}
        styles={{main: {elevation: 8}}}
        tweenHandler={Drawer.tweenPresets.parallax}
        ref={(ref) => this._drawer = ref}
        content={<MenuContent {...this.props}/>}
        onOpen={() => {
          this.is_open = true;
        }}
        onClose={() => {
          this.is_open = false;
        }}
        >
        <InboxPage {...this.props}/>
      </Drawer>
    )
  }
}

export default MenuPage;
