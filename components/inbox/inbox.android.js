import React                   from 'react-native';
import ConversationItem        from './item';
import EStyleSheet             from 'react-native-extended-stylesheet';
import TimerMixin              from 'react-timer-mixin';
import RefreshInfiniteListView from '@remobile/react-native-refresh-infinite-listview';
import Spinner                 from 'react-native-loading-spinner-overlay';
import MiniSignal              from 'mini-signals';

import alt                     from '../../alt';
import ConversationsApi        from '../../api/conversations';
import WebsitesApi             from '../../api/websites';

var {
  View,
  Text,
  StyleSheet,
  ListView,
  Component,
  RefreshControl
} = React;

var data_store = new ListView.DataSource(
  {rowHasChanged: (r1, r2) => r1 !== r2}
);

var styles = EStyleSheet.create({
  list: {
    alignSelf:'stretch'
  },
  separator: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  'separator:last-child': {
    height: 1,
    backgroundColor: '#EEEEEE',
    elevation: 6
  },
  emptyRow: {
    height: '100%',
    justifyContent:'center',
    alignItems:'center'
  },
  emptyText: {
    fontSize: 30,
    opacity: 0.7
  }
});

export const InboxPageSignal = new MiniSignal();

let InboxPage = React.createClass({

  conversations: [],

  is_loading: true,

  page: 0,

  website_id: null,

  _getStateFromStores() {
    this.is_loading = false;
    this.setState({
      refreshing : false
    });
    let conversations = this.ConversationsStore
        .getConversations(this.current_website.id);
    return {
      conversations: conversations,
      conversations_list: data_store.cloneWithRows(conversations),
    };
  },

  _onChange() {
    this.setState(this._getStateFromStores());
  },

  getInitialState() {
    alt.current_session_id = "";
    this.current_website = this.props.current_website;
    WebsitesApi.join(this.current_website.id);
    this.ConversationsActions  = alt.getActions('ConversationsActions');
    this.ConversationsStore   = alt.getStore('ConversationsStore');
    return this._getStateFromStores();
  },

  loadConversations() {
    let search_query = {};

    let search_text = this.state.search_text;
    if (search_text && search_text.length > 0) {
      search_query = {
        search_query : search_text,
        search_type : "text"
      };
    }
    ConversationsApi.getAll(this.current_website.id, this.page, search_query);
  },

  updateWebsiteId(new_website_id) {
    this.current_website = new_website_id;
    WebsitesApi.join(this.current_website.id);
    this.is_loading = true;
    this.onRefresh();
  },

  componentDidMount() {
    this.loadConversations();
    this.ConversationsStore.listen(this._onChange);
    this.binding = InboxPageSignal.add(this.updateWebsiteId);
  },

  componentWillUnmount() {
    this.ConversationsStore.unlisten(this._onChange);
    this.binding.detach();
  },

  onRefresh() {
    this.page = 0;
    this.loadConversations();
  },
  onInfinite() {
    this.page++;
    this.loadConversations();
  },
  onSearch() {
    this.onRefresh();
  },
  onSearchStopped() {
    this.setState({
      search_text: ''
    });
    this.page = 0;
    this.loadConversations();
  },
  loadedAllData() {
    return false;
  },
  renderRow(conversationData) {
    return (
      <ConversationItem {...conversationData} />
    )
  },
  renderSeparator(sectionID, rowID) {
    let index = parseInt(rowID);
    return (
      <View style={EStyleSheet.child(styles, 'separator', index, this.state.conversations.length)} key={sectionID+rowID}/>
    );
  },
  renderEmptyRow: () => {
    return (
      <View style = {styles.emptyRow}>
        <Text style={styles.emptyText}>
          No conversations...
        </Text>
      </View>
    )
  },
  render() {
    return (
      <View style={{marginTop: 60, flex:1, backgroundColor: '#EEEEEE'}}>
          <ListView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
            ref = {(list) => {this.list = list}}
            dataSource={this.state.conversations_list}
            renderRow={this.renderRow}
            renderEmptyRow={this.renderEmptyRow}
            renderSeparator={this.renderSeparator}
            scrollEventThrottle={10}
            style={{backgroundColor:'transparent'}}
            onRefresh = {this.onRefresh}
            onEndReached = {this.onInfinite}
            onEndReachedThreshold = {100}
            initialListSize={0}
            >
          </ListView>
        <Spinner visible={this.is_loading} />
      </View>
    )
  }
});

export default InboxPage;
