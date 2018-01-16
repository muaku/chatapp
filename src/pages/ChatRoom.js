import React, { Component, PropTypes } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  FlatList
} from 'react-native';
import * as _ from "lodash"
import moment from "moment"
import { getCurrentUser, getDateByYearMonthDayFormat, getTimeAsHourAndMinute, randomId } from "../localApis/users"
import { savePost, getAllPosts, deletePostById } from "../localApis/posts"
import {CURRENT_USER_STORAGE, USERS_STORAGE, POST_SCHEMA} from "../config"
import Button from "../components/Button"

class ChatRoom extends Component {
    state = {
        user: {},
        post: {},
        postList: [],
        readyToshow: false,
        postText: "",
        errors: "",
        selected: false
    }

    componentWillMount() {
        getCurrentUser().then(user => {
            this.setState({ user: user })
        })
        getAllPosts().then(postList => {
            this.setState({ postList: postList }, (res) => {
                this.setState({ readyToshow: true})
            })
        })
    }

    _onSubmit = () => {
        var {user, post, postList} = this.state
        var errors = this._inputValidator(this.state.postText)
        if(!_.isEmpty(errors)) {
            this.setState({ errors: errors })
        }else{
            var message = this.state.postText
            var newPost = {
                id: randomId(),
                posted_by: user.id,
                image_url: user.image_url,
                message: message,
                created_at: moment().format()
            }
            if(!_.isEmpty(postList)) {
                postList.unshift(newPost)
            }else{
                postList = [newPost]
            }
            this.setState({postList: postList})
            savePost(newPost).then(posts => console.log("newPosts: ", posts))
            this.setState({ postText: ""})      // textInput をクリア
        }
    }

    _keyExtractor = (item, index) => item.id

    _onDelete = (post_id) => {
        deletePostById(post_id).then(newPostList => {
            if(newPostList) {
                this.setState({ postList: newPostList})
            }
        })
    }

    _onPostTextChange = (text) => {
        this.setState({ postText: text, errors: "" })
    }

    _inputValidator = (postText) => {
        var errors = ""
        if (postText.trim().length < 1) errors="1~300文字文字以上入力ください"
        return errors
    }

    /* 投稿のフォーム */
    renderPostForm = ({image_url, id}) => {
        const { postText, errors } = this.state
        return (
            <View style={styles.postForm} >
                <View style={styles.topForm}>
                    <View style={{alignItems: "center"}}>
                        <Image source={{uri:image_url}} style={{width: 80, height: 80, borderRadius:40}} />
                        <Text >{id}</Text>
                    </View>
                    <View style={{flex:1}} >
                        <TextInput style={styles.texInput} multiline={true} maxLength={300} 
                            onChangeText={this._onPostTextChange} value={postText} />
                    </View>
                </View>
                <View style={styles.bottomForm}>
                    {errors ? <Text>{errors}</Text> : null}
                    <Button info style={styles.btn} onPress={this._onSubmit}>投稿</Button>
                </View>
            </View>
        )
    }

    /* postItem */
    _renderPostItem = ({item}) => {
        return (
            <View style={styles.postComp} >
                <View >
                    <Image source={{uri: item.image_url}} style={{width: 80, height: 80, borderRadius:40}} />
                </View>
                <View style={styles.content} >
                    <View style={styles.header} >
                        <Text style={{flex: 3}}>{item.posted_by}</Text>
                        <Text style={{flex: 1.5}}>{getDateByYearMonthDayFormat(item.created_at)}</Text>
                        <Text style={{flex: 1}}>{getTimeAsHourAndMinute(item.created_at)}</Text>
                    </View>
                    <TextInput style={styles.textShow} multiline={true} maxLength={300} editable={false} value={item.message} />
                    <View style={{flexDirection: "row", justifyContent:"flex-end"}} >
                        {this.state.user.id === item.posted_by ? <Button danger onPress={() => this._onDelete(item.id)} >削除</Button> : null }
                    </View>
                </View>
            </View>
        )
    }

    render () {
        const { user, postList, readyToshow } = this.state
        if(!readyToshow) {
            return null
        }
        return (
            <View style={styles.ChatRoom} >
                {this.renderPostForm({image_url: user.image_url, id: user.id})}
                <ScrollView>
                    { !_.isEmpty(postList) ? <FlatList 
                        data={postList} 
                        renderItem={this._renderPostItem}
                        keyExtractor={this._keyExtractor}
                        extraData={this.state}     /* FlatList rerender when state.selected has changed */
                    /> : (<Text>メッセージありません！</Text>)
                    }
                </ScrollView>
            </View>
        )
    }
}

ChatRoom.propTypes = {
    
}

const styles = StyleSheet.create({
    ChatRoom: {
        flex: 1,
        padding: 5
    },
    postForm: {
        flexDirection: "column",
        borderBottomWidth: .5
    },
    topForm: {
        flexDirection: "row",
    },
    bottomForm: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    texInput: {
        borderWidth: 0.5,
        borderRadius: 3,
        height: 100,
        marginLeft: 3
    },
    texShow: {
        height: "auto",
        marginLeft: 3
    },
    btn: {
        margin: 5
    },
    button: {
        padding:10,
        borderWidth: 1,
        alignItems: "center",
        marginTop: 20,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        color: "black",
        fontWeight: "bold"
    },
    userItem: {
        flex:1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    postComp: {
        flexDirection: "row",
        borderBottomWidth: .5,
        padding: 2,
        marginTop: 3
    },
    content: {
        flex:1,
        flexDirection: "column",
        marginLeft: 3
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    }
})

export default ChatRoom