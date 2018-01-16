import { StyleSheet } from "react-native"

/* Common style */
const BaseStyles = StyleSheet.create({
    main: {
        padding: 10,
        borderRadius: 3,
        borderWidth: 1,
        textAlign: "center"
    },
    label: {
        color: "#000",
    },
    rounded: {
        borderRadius: 20,
    }
})

const Danger = StyleSheet.create({
    main: {
        borderColor: "#e74c3c"
    },
})

const Info = StyleSheet.create({
    main: {
        borderColor: "#3498db"
    }
})

const Success = StyleSheet.create({
    main: {
        borderColor: "#1abc9c"
    }
})

const Default = StyleSheet.create({
    main: {
        backgroundColor: "rgba(0,0,0,0)",
    },
    label: {
        color: "#333"
    }
})

export default BaseStyles
export {
    Danger,
    Info,
    Success,
    Default
}
