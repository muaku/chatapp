import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native';
import moment from "moment"
import Login from "./src/pages/Login"
import {createRootNavigator} from "./src/navigator"
import {loggedInCheck} from "./src/localApis/auth"
import { USERS_STORAGE } from "./src/config"
import { clearAllPosts } from "./src/localApis/posts"

export default class App extends Component<{}> {
  state = {
    isLoggedIn: false,
    checkedLogin: false
  }

  async componentWillMount() {
    /* ユーザ */
    const defaultUser = [
        {
            id: "id",
            password: "password",
            image_url: "https://www.howtocookthat.net/public_html/wp-content/uploads/2013/07/IMG_5481-550x412.jpg",
            created_at: moment().format()
        }
    ]
    try {
        await AsyncStorage.setItem(USERS_STORAGE, JSON.stringify(defaultUser))
    }catch(err) {
        console.log(err)
    }

    /* ログイン中のユーザがいるかを確認 */
    loggedInCheck().then(res => {
      console.log("res: ", res)
      if(res) {
        this.setState({ isLoggedIn: true, checkedLogin: true })
      }else{
        this.setState({ isLoggedIn: false, checkedLogin: true })
      }
    }).catch(err => console.log(err))
  }

  render() {
    const { isLoggedIn, checkedLogin } = this.state
    const RootPage = createRootNavigator(isLoggedIn)
    const instructions = Platform.select({
      ios: <RootPage />
      ,
      android: <RootPage />
    });

    return (
      <View style={styles.container}>
        {checkedLogin ? instructions : <Text>Loading...</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
