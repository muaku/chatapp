import React, { Component, PropTypes } from 'react'
import {
  AsyncStorage
} from 'react-native';
import {CURRENT_USER_STORAGE, USERS_STORAGE} from "../config"
import * as _ from "lodash"

/* ログイン中のユーザの確認 */
export const loggedInCheck = () => {
    return new Promise((resolve, reject) => {
        var isLoggedIn = false,
            user = { }
        AsyncStorage.getItem(CURRENT_USER_STORAGE)
            .then(userId => {
                if(_.isEmpty(userId)){
                    return resolve(false)
                }else{
                    return resolve(true)
                }
            })
            .catch(err => {
                reject(err)
            })
    })
}

/* ログアウト */
export const logout =  () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.removeItem(CURRENT_USER_STORAGE)
            .then(res => {return resolve(res)})
            .catch(err => { return reject(err)})
    })
}

/* ユーザIDがすでに登録されているかの確認 */
export const isAlreadyHasThisUserId = (id) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(USERS_STORAGE)
            .then(users => {
                var parsedUsers = JSON.parse(users) 
                var isIdMatched = false       
                if(!_.isEmpty(parsedUsers)) {
                    for(var userObject of parsedUsers) {
                        if(id === userObject["id"]) {
                            isIdMatched = true
                            break
                        }
                    }
                    if(isIdMatched) {
                        return resolve(true)
                    }else {
                        return resolve(false)
                    }
                }else {
                    return resolve(false)
                }
            })
            .catch(err => { return reject(err)})
    })
}

/* USERS_STORAGE にユーザを追加 */
export const addUserToStorage = (user) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(USERS_STORAGE)
            .then(users => { 
                var parsedUsers = JSON.parse(users) 
                var newUsers = []     
                if(!_.isEmpty(parsedUsers)) {
                    console.log("NOT Empty")
                    // newUsers = parsedUsers.push(user)
                    parsedUsers[parsedUsers.length] = user
                    newUsers = parsedUsers
                }else{
                    console.log("empty")
                    newUsers = [user]
                }
                AsyncStorage.setItem(USERS_STORAGE, JSON.stringify(newUsers))
                    .then(res => { return resolve(res)})
                    .catch(err => { return reject(err)})
            })
            .catch(err => { return reject(err)})
    })
}