import React, { Component, PropTypes } from 'react'
import {
  AsyncStorage
} from 'react-native';

import { CURRENT_USER_STORAGE, USERS_STORAGE } from "../config"
import * as _ from "lodash"

/* ユーザリストを取得する */
export const getUserList = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(USERS_STORAGE)
            .then(users => {
                var sortedUserList = sortUserListByDate(JSON.parse(users))
                return resolve(sortedUserList)
            })
            .catch(err => reject(err))
    })
}

/* ユーザをidで削除 */
export const deleteUserById = (userList, id) => {
    return new Promise((resolve, reject) => {
        if(!_.isEmpty(userList)) {
            var isDeleted = false
            for(var index = 0; index<userList.length; index++) {
                if(id === userList[index]["id"]) {
                    // remove object from userList by its index
                    userList.splice(index, 1)
                    isDeleted = true
                    break
                }
            }
            if(isDeleted) {
                console.log("DeletedUserList: ", userList)
                // Resave userList
                saveUserList(userList).then(() => {
                    return resolve(userList)
                }).catch(err => {return reject(err)})
            }else {
                return resolve(false)
            }
        }else {
            return resolve(false)
        }
    })
}

/* Store userList to Storage */
export const saveUserList = (userList) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.setItem(USERS_STORAGE, JSON.stringify(userList))
            .then(() => {
                return resolve()
            })
            .catch(err => reject(err))
     })
}

/* Get Current user */
export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(CURRENT_USER_STORAGE).then((userString) => {
            return resolve(JSON.parse(userString))
        }).catch(err => reject(err))
    })
}

/* Get YYYY/MM/DD format
  注意: date が ISOString であること
*/
export const getDateByYearMonthDayFormat = (date) => {
    return (date.replace("-","/").split("T")[0].replace("-","/"))
}

/* Get time by hh:mm format */
export const getTimeAsHourAndMinute = (date) => {
    var timeTemp = date.split("T")[1].split("+")[0]
    return (timeTemp.split(":")[0] + ":" + timeTemp.split(":")[1])
}

/* Sort Array by date */
export const sortUserListByDate = (array) => {
    array.sort((a,b) => {
        return (new Date(b.created_at) - new Date(a.created_at))
    })
    return array
}

/* Random id */
export const randomId = (array) => {
    return (String(Date.now()) + Math.floor(Math.random()*1000))
}
