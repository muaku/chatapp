import React, {Component} from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';

import LoginForm from "../components/forms/LoginForm"

const Login = ({navigation}) => {
    return (
        <LoginForm navigation={navigation} />       // Pass navigation as props
    )
}

export default Login
