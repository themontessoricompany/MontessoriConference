// @flow

// An All Components Screen is a great way to dev and quick-test components
import React from 'react'
import {
  Platform, View, ListView, Text, Image, RefreshControl,
  TouchableOpacity, TextInput,
} from 'react-native'
import InfiniteScrollView from 'react-native-infinite-scroll-view'
import { Images } from '../Themes'
import styles from './Styles/BreakoutSessionsListScreenStyle'
import { connect } from 'react-redux'
import BreakoutSessionListActions, { breakoutSessionListState } from '../Redux/BreakoutSessionListRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import I18n from 'react-native-i18n'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Metrics } from '../Themes/'

class BreakoutSessionsScreen extends React.Component {

  state: {
    dataSource: Object
  }

  constructor (props) {
    super(props)
    const rowHasChanged = (r1, r2) => r1.id !== r2.id
    const ds = new ListView.DataSource({rowHasChanged})
    this.state = {
      dataSource: ds.cloneWithRows(props.breakoutSessions),
      searchParams: {}
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.breakoutSessions) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(newProps.breakoutSessions)
      })
    }
  }

  async componentWillMount() {
    this.props.loadBreakoutSessionList();
  }

  renderAndroidWarning () {
    if (Platform.OS === 'android') {
      return (
        <Text style={styles.sectionText}>
        Android only: Animations are slow? You are probably running the app in debug mode.
          It will run more smoothly once your app will be built.
          </Text>
      )
    }
    return null
  }

  renderRow(rowData) {

    handlePressRow = () => {
      NavigationActions.breakoutSession({
        breakoutSessionId: rowData.id, title: 'Breakout Detail'
      });
    }

    return (
      <TouchableOpacity onPress={ handlePressRow }>
        <View style={styles.rowContainer}>
          <View style={styles.detailContainer}>
            <Text style={[styles.time]}>
              {rowData.day} 
              <Text style={{color: '#009ee2'}}> · </Text> 
              <Text style={{fontWeight: 'normal'}}>
                {rowData.start_time} - {rowData.end_time}
              </Text>
            </Text>
            <Text style={[styles.name]}>{rowData.name}</Text>
            <Text style={[styles.description]}>{rowData.description}</Text>
          </View>
        </View>
        <View style={[styles.separator]}></View>
      </TouchableOpacity>
    )
  }

  noRowData () {
    return this.state.dataSource.getRowCount() === 0
  }

  _renderRefreshControl() {
    const reloadWithSearchParams = () => {
      this.props.reloadBreakoutSessionList(this.state.searchParams)
    }

    return (
      <RefreshControl
        refreshing={ this.props.isFetching }
        onRefresh={ reloadWithSearchParams.bind(this) }
      />
    );
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          enableEmptySections={true}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    breakoutSessions: breakoutSessionListState(state).breakoutSessionList,
    isFetching: breakoutSessionListState(state).fetching,
    canLoadMore: breakoutSessionListState(state).canLoadMore,
    lastPageFetched: breakoutSessionListState(state).lastPageFetched
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadBreakoutSessionList: (page, params) => {
      dispatch(BreakoutSessionListActions.breakoutSessionListRequest(page, params))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BreakoutSessionsScreen)
