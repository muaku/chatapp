import React, { Component, PropTypes } from 'react'
import {
  AsyncStorage
} from 'react-native';

import { CURRENT_USER_STORAGE, USERS_STORAGE, POSTS_STORAGE, POST_SCHEMA } from "../config"
import * as _ from "lodash"

/* Get all posts */
export const getAllPosts = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(POSTS_STORAGE)
            .then(postArrayString => {
                console.log("postArrayString: ", postArrayString)
                return resolve(JSON.parse(postArrayString))
            })
            .catch(err => reject(err))
    })
}

/* Save post */
export const savePost = (post) => {
    return new Promise((resolve, reject) => {
        getAllPosts().then(posts => {
            if(!_.isEmpty(posts)) {
                console.log("NOT EMPTY POST")
                //posts.push(post)
                posts.unshift(post)     // Array の先頭に挿入
            }else{
                console.log("EMPTY POST")
                posts = [post]
            }
            AsyncStorage.setItem(POSTS_STORAGE, JSON.stringify(posts))
                .then(() => resolve(posts))
        }).catch(err => reject(err))
    })   
}

/* Delete post */
export const deletePostById = (post_id) => {
    return new Promise((resolve, reject) => {
        getAllPosts().then(posts => {
            if(!_.isEmpty(posts)) {
                var isDeleted = false
                for(var index = 0; index<posts.length; index++) {
                    if(post_id === posts[index]["id"]) {
                        // remove object from userList by its index
                        posts.splice(index, 1)
                        isDeleted = true
                        break
                    }
                }
                if(isDeleted) {
                    AsyncStorage.setItem(POSTS_STORAGE, JSON.stringify(posts))
                        .then(() => { return resolve(posts)} )
                        .catch(err => {return reject(err)})
                }else {
                    return resolve(false)
                }
            }else{
                console.log("EMPTY POST")
                return resolve(false)
            }
        })
    })
}

/* Clear all posts */
export const clearAllPosts = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.removeItem(POSTS_STORAGE).then(() => resolve())
            .catch(err => reject(err))
     })
}



