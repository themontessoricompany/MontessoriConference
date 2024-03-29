import React, { Component } from 'react'
import { Scene, Router } from 'react-native-router-flux'
import Styles from './Styles/NavigationContainerStyles'
import NavigationDrawer from './NavigationDrawer'
import NavItems from './NavItems'

// screens identified by the router
import PresentationScreen from '../Containers/PresentationScreen';
import MontessoriDirectoryScreen from '../Containers/MontessoriDirectoryScreen';
import DirectoryProfileScreen from '../Containers/DirectoryProfileScreen';
import BreakoutSessionListScreen from '../Containers/BreakoutSessionListScreen';
import ConferencePhotosScreen from '../Containers/ConferencePhotosScreen';
import BreakoutSessionScreen from '../Containers/BreakoutSessionScreen';
import RegisterScreen from '../Containers/RegisterScreen';
import LoginScreen from '../Containers/LoginScreen';
import AboutUsScreen from '../Containers/AboutUsScreen';
import CameraScreen from '../Containers/CameraScreen';
import PictureConfirmScreen from '../Containers/PictureConfirmScreen';

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
  render () {
    return (
      <Router>
        <Scene key='drawer' component={NavigationDrawer} open={false}>
          <Scene key='drawerChildrenWrapper' navigationBarStyle={Styles.navBar} titleStyle={Styles.title} leftButtonIconStyle={Styles.leftButton} rightButtonTextStyle={Styles.rightButton}>
            <Scene initial key='presentationScreen' component={PresentationScreen} title='Home' renderLeftButton={NavItems.hamburgerButton} />
            <Scene key='montessoriDirectory' component={MontessoriDirectoryScreen} title='Directory' />
            <Scene key='breakoutSessionList' component={BreakoutSessionListScreen} title='Breakout Sessions' />
            <Scene key='conferencePhotos' component={ConferencePhotosScreen} title='Photo Feed' />
            <Scene key='breakoutSession' component={BreakoutSessionScreen} />
            <Scene key='directoryProfile' component={DirectoryProfileScreen} />
            <Scene key='register' component={RegisterScreen} title='Register' />
            <Scene key='login' component={LoginScreen} title='Login' hideNavBar />
            <Scene key='aboutUs' component={AboutUsScreen} title='About' />
            <Scene key='camera' component={CameraScreen} hideNavBar />
            <Scene key='pictureConfirm' component={PictureConfirmScreen} hideNavBar />
          </Scene>
        </Scene>
      </Router>
    )
  }
}

export default NavigationRouter
