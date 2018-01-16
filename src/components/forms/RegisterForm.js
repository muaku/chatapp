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
import moment from "moment"

import Button from "../Button"
import { isAlreadyHasThisUserId, addUserToStorage } from "../../localApis/auth"
import { USER_SCHEMA } from "../../config"

class RegisterForm extends Component {
    state = {
        user: USER_SCHEMA,
        errors: {
            id: "",
            password: "",
            image_url: ""
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

    _onImageUrlChange = (text) => {
        this.setState({
            user: {...this.state.user, image_url: text},
            errors: {...this.state.errors, image_url: ""}    // リセット password エラー表示
        })
    }

    /* 登録ボタンが押された時 */
    _onPress = () => {
        const errors = this._inputValidator(this.state.user)
        if(_.isEmpty(errors)) {
            /* ユーザがすでに存在しているかの確認 */
            isAlreadyHasThisUserId(this.state.user.id).then(res => {
                console.log("ISHAS_USER: ", res)
                if(res) {
                    // idが重なっている場合
                    this.setState({
                        errors: {...this.state.errors, id: "このidが登録されているので、別のidを利用ください。"}
                    })
                }else{
                    // idが重なっていない場合
                    this.setState({
                        user: {...this.state.user, created_at: moment().format()}
                    },() => {
                        /* ユーザをAsyncStorageに保存する */
                        addUserToStorage(this.state.user).then(() => {
                            var newUser = this.state.user
                            this.setState({     // Form をクリア
                                user: USER_SCHEMA
                            })      
                            return this.props.register(newUser)
                        }).catch(err => console.log(err))
                    })
                }
            }).catch(err => console.log(err))
        }else{
            console.log(errors)
            this.setState({...this.state.errors, errors})   // state を update
        }
    }

    /* 入力の確認 */
    _inputValidator = (user) => {
        const errors = {}
        if(user.id.trim().length < 2 || user.id.trim().length > 20) errors.id = "idは2~20文字まで入力ください!"
        if(user.password.trim().length < 4 || user.password.trim().length > 20) errors.password = "パスワードは4~20文字まで入力ください!"
        if(user.image_url.trim().length < 8 || user.image_url.trim().length > 250) errors.image_url = "画像URLは8~250文字まで入力ください!"
        return errors
    }

    /* レンダー処理 */
    render () {
        const {user, errors} = this.state

        return (
            <View>
                <View style={styles.container} >

                    <TextInput style={styles.idInput}
                        name="id"
                        placeholder="id"
                        onChangeText={this._onIdChange}
                        value={user.id}
                    />
                    {errors.id ? <Text style={styles.error} >{errors.id}</Text> : null}

                    <TextInput style={styles.idInput}
                        name="password"
                        placeholder="password"
                        secureTextEntry={true}
                        onChangeText={this._onPasswordChange}
                        value={user.password}
                    />
                    {errors.password ? <Text style={styles.error} >{errors.password}</Text> : null}

                    <TextInput style={styles.idInput}
                        name="image_url"
                        placeholder="image_url"
                        onChangeText={this._onImageUrlChange}
                        value={user.image_url}
                    />
                    {errors.image_url ? <Text style={styles.error}>{errors.image_url}</Text> : null}
                </View>
                <Button info style={styles.btn} onPress={this._onPress} >登録</Button>
            </View>
            
        )
    }
}

RegisterForm.propTypes = {

}

/* Style */
const styles = StyleSheet.create({
    idInput: {
        borderBottomColor: '#000000',
        borderBottomWidth: .5,
        height: 30,
        marginTop: 20,
    }, 
    btn: {
        width: 50,
        margin: 5,
        marginLeft: "auto",
        marginRight: "auto"
    },
    error: {
        color: "red"
    }
})

export default RegisterForm