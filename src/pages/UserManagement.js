import React, { Component, PropTypes } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  ScrollView,
  FlatList
} from 'react-native';

import RegisterForm from "../components/forms/RegisterForm"
import { USERS_STORAGE } from "../config"
import { isAlreadyHasThisUserId, addUserToStorage } from "../localApis/auth"
import { getUserList, deleteUserById, getDateByYearMonthDayFormat } from "../localApis/users"
import Button from "../components/Button"
const userIcon = require("../image/user.png")

class UserManagement extends Component {

    state = {
        userList: [],
        addedNewUser: false,
        errors: "",
        selected: true
    }

    componentWillMount() {
        getUserList().then(userList => {
            // console.log("userList: ", userList)
            this.setState({userList: userList})
        }).catch(err => console.log(err))
    }

    _register = (user) => {
        // console.log("user: ", user)
        const { userList } = this.state
        userList.unshift(user)
        this.setState({
            userList: userList
        })     
    }

    _onDeleteUserItemPressed = (id) => {
        const { userList } = this.state
        deleteUserById(userList, id).then(newUserList => {
            if(newUserList){
                this.setState({userList: newUserList})
            }else{
                this.setState({errors: "ユーザを削除できません!"})
            }
        }).catch(err => console.log(err))
    }

     _keyExtractor = (item, index) => item.id

    _renderUserItem = ({item}) => {
        return (
            <View style={styles.userItem} >
                <Image source={{uri:item.image_url}} style={{width: 80, height: 80, borderRadius:40}} />
                <Text>{item.id}</Text>
                <Text>{getDateByYearMonthDayFormat(item.created_at)}</Text>
                <Button danger onPress={() => this._onDeleteUserItemPressed(item.id)} >削除</Button>
            </View>
        )
    }

    render () {
        const { userList } = this.state

        return (
            <View style={styles.MainView} >
                <RegisterForm register={this._register} />
                <Text>ユーザ一覧</Text>
                <ScrollView>
                    {
                        userList ? 
                        <FlatList 
                            data={userList} 
                            renderItem={this._renderUserItem}
                            // keyExtractor={this._keyExtractor}
                            extraData={this.state}     /* FlatList rerender when state.selected has changed */
                        /> : (<Text>ユーザなし</Text>)
                    }
                </ScrollView>
            </View>
            
        )
    }
}

UserManagement.propTypes = {

}

const styles = StyleSheet.create({
    MainView: {
        padding: 5
    },
    userItem: {
        flex:1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    }
})

export default UserManagement
