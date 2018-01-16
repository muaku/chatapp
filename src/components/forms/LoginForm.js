import React, { Component, PropTypes } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';
import * as _ from "lodash"

import { USERS_STORAGE, CURRENT_USER_STORAGE, USER_SCHEMA } from "../../config"
import Button from "../Button"

class LoginForm extends Component {
    state = {
        user: USER_SCHEMA,
        loading: false,
        errors: {
            id: "",
            password: ""
        }
    }

    _onIdChange = (text) => {
        this.setState({
            user: {...this.state.user,"id": text},
            errors: {...this.state.errors, id:""}       // リセット id エラー表示
        })
    }

    _onPasswordChange = (text) => {
        this.setState({
            user: {...this.state.user, password: text},
            errors: {...this.state.errors, password: ""}    // リセット password エラー表示
        })
    }

    _onPress = () => {
        const errors = this._inputValidator(this.state.user)
        if(_.isEmpty(errors)) {
            /* TODO: Login 処理 */
            console.log(this.state.user)
            this._login(this.state.user)
        }else{
            console.log(errors)
            this.setState({...this.state.errors, errors})   // state を update
        }
    }

    _inputValidator = (user) => {
        const errors = {}
        if(_.isEmpty(user.id)) errors.id = "idを入力ください!"
        if(_.isEmpty(user.password)) errors.password = "パスワードを入力ください!"
        return errors
    }

    async _login (user){        
        /* ユザー認証 */
        this.state.loading = true           // 認証中
        var isIdMatched = false,
            isPasswordMatched = false 
        try {
            var users = await AsyncStorage.getItem(USERS_STORAGE)
            var parsedUsers = JSON.parse(users)         
            if(!_.isEmpty(parsedUsers)) {
                for(var userObject of parsedUsers) {
                    if(user.id === userObject["id"]) {
                        isIdMatched = true
                        if(user.password === userObject["password"]) {
                            // password が正しい場合
                            isPasswordMatched = true
                            user = userObject
                            break
                        }else{
                            // password が正しくない場合
                            isPasswordMatched = false
                            break
                        }
                    }
                }

                if(!isIdMatched) {
                    console.log("このidが存在しない!")
                    return this.setState({
                        errors: {...this.state.errors, id: "このidが存在しない!"},
                        loading: false
                    })
                }
                if(!isPasswordMatched) {
                    console.log("password が正しくない!")
                    return this.setState({
                        errors: {...this.state.errors, password: "パスワードが正しくないです!"},
                        loading: false
                    })
                        
                }

                /* id & password が正しい場合 */
                this.setState({
                    errors: { },    // errors をクリア
                    loading: false,
                })    
                
                var current_user = JSON.stringify(user)
                AsyncStorage.setItem(CURRENT_USER_STORAGE, current_user)
                    .then(res => {
                        this.props.navigation.navigate("LoggedIn")
                    })
                    .catch(err => console.log(err))
                
            }else{
                this.setState({
                    errors:{...this.state.errors, id: "データが存在していない！"},
                    loading: false
                })
            }  
        }catch(err){
            console.log(err)
        }
    }

    render () {
        const {user,loading,errors} = this.state
        return (
            <View style={styles.container}>
                <TextInput style={styles.input}
                    name="id"
                    placeholder="id"
                    onChangeText={this._onIdChange}
                />
                {errors.id ? <Text style={styles.error} >{errors.id}</Text> : null}

                <TextInput style={styles.input}
                    name="password"
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={this._onPasswordChange}
                />
                {errors.password ? <Text style={styles.error} >{errors.password}</Text> : null}

                <Button info style={styles.btn} onPress={this._onPress}>Login</Button>
                {loading ? <Text>loading...</Text> : null}
            </View>
        )
    }
}

LoginForm.propTypes = {

}

/* Style */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        alignItems: "center",
        backgroundColor: '#F5FCFF',
    },
    input: {
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        width: 250,
        height: 30,
        marginTop: 20,
    }, 
    btn: {
        margin: 10
    },
    error: {
        color: "red",
    }
})

export default LoginForm