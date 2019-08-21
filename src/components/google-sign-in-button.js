import React, { useContext} from 'react'
import firebase from 'firebase/app'
import {Button} from "antd"

import errorNotification from "./error-notification"
import UserContext from "./user-context"

async function signInWithPopup(user, provider){
    if (user && !user.isAnonymous){
        const linked = user.providerData.some(v=>v.providerId === provider.providerId)
        if (linked){
            return firebase.auth().signInWithPopup(provider)
        } 

        return user.linkWithPopup(provider)
    }
    const result = await firebase.auth().signInWithPopup(provider)
    if (user && user.isAnonymous){
        user.delete() 
    }

    return result
}

export default function GoogleSignInButton(props){
    const {user, addProperties} = useContext(UserContext)
    const {scopes, children, className, ...other} = props    
    const onClick = async ()=>{
        const provider = new firebase.auth.GoogleAuthProvider()
        if (scopes){
            scopes.forEach(scope=>provider.addScope(scope))
        }
        try {
            const result = await signInWithPopup(user, provider)
            const accessToken = result.credential.accessToken
            addProperties({accessToken})
        }catch(error) {
            errorNotification({operation:"during google sign in", error})
        }     
    }
    return (
        <Button
        className={"login-form__button" + (className? className:"")}
        icon="google" onClick={onClick} {...other}>
            { children || "Sign in with Google!"}
        </Button>
    )
}