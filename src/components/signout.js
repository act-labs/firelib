import React from "react"
import {Button} from "antd"
import firebase from 'firebase/app'
import errorNotification from "./error-notification"

export default function Signout(props){
    const {onClick, ...other} = props
    return <Button type="link" onClick={async ()=>{        
        try {
            await firebase.auth().signOut()
        } catch(error) {
            errorNotification({operation:"signing out", error})            
        }

        if(onClick){
            onClick()
        }
    }} {...other}></Button>
}