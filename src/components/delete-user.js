import React from "react"
import {Button} from "antd"
import firebase from 'firebase/app'
import errorNotification from "./error-notification"

export default function DeleteUser(props){
    const {onClick, ...other} = props
    return <Button type="link" onClick={async ()=>{
        try {
            await firebase.auth().currentUser.delete()
        } catch(error) {
            errorNotification({operation:"deleting user", error})            
        }

        if(onClick){
            onClick()
        }
    }} {...other}></Button>
}