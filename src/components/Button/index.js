import React, { Component, PropTypes } from "react"
import {
    Text,
    TouchableOpacity,
    View,
} from "react-native"

import Base, { Default, Danger, Info, Success } from "./styles"

class Button extends Component {

    /* props に対して style を選択する */
    getTheme() {
        const { danger, info, success } = this.props
        if(info) {
            return Info
        }
        if(danger) {
            return Danger
        }
        if(success) {
            return Success
        }
        return Default
    }

    render() {
        const theme = this.getTheme()
        const {
            children,
            onPress,
            style,
            rounded,
        } = this.props

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={[
                    Base.main,
                    theme.main,
                    rounded ? Base.rounded : null,
                    style
                ]}
                onPress={onPress}
            >
                <Text style={[Base.label, theme.label]} >{children}</Text>
            </TouchableOpacity>
        )

    }
}

export default Button