import { StackNavigator, TabNavigator } from "react-navigation"
import Ionicons from 'react-native-vector-icons/Ionicons'

import ChatRoom from "./pages/ChatRoom"
import UserManagement from "./pages/UserManagement"
import Logout from "./pages/Logout"
import Login from "./pages/Login"

/* Logged out の時の StackNavigator */
export const LoggedOut = StackNavigator({
    Login: {
        screen: Login
    }
},{
    headerMode: "none"
})

/* TabNavigator */
export const RootTab = TabNavigator({
    ChatRoom: {
        screen: ChatRoom,
        navigationOptions: {
            title: "チャットルーム",
            tabBarLabel: 'チャットルーム',
        }
    },
    UserManagement: {
        screen: UserManagement,
        navigationOptions: {
            title: "ユーザ管理",
            tabBarLabel: 'ユーザ管理',
            
        }
    },
    Logout: {
        screen: Logout,
        navigationOptions: {
            title: "ログアウト",
            tabBarLabel: 'ログアウト',
        }
    }
},{
    tabBarPosition: "bottom"
})

/* Logged in の時の StackNavigator */
export const LoggedIn = StackNavigator({
    RootTab: {
        screen: RootTab
    }
},{
    headerMode: "screen"
})

/* Root Navigator */
export const createRootNavigator = (isLoggedIn = false) => {
    return StackNavigator({
        LoggedIn: {
            screen: LoggedIn
        },
        LoggedOut: {
            screen: LoggedOut
        }
    }, {
        headerMode: "none",
        mode: "modal",
        initialRouteName: isLoggedIn ? "LoggedIn" : "LoggedOut"
    })
}
