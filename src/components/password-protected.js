import React, { useContext } from 'react'
import firebase from 'firebase/app'
import { notification } from 'antd'

import errorNotification from "./error-notification"
import UserContext from "./user-context"
import getLogger from "./get-logger"
import SimpleLogin from "./login"

function successfullySentReminderNotification(){
    notification.success({
        message:"Password reminder was successfully sent to your E-mail address",
        description: "Check your mail box!", 
        duration: 10
    }); 
}

async function signInWithEmailAndPassword(action, email, password, remember){
    const auth = firebase.auth(), user = auth.currentUser
    const Persistence = firebase.auth.Auth.Persistence

    await auth.setPersistence(remember ? Persistence.LOCAL : Persistence.NONE)
    
    if (action === "login"){
        await auth.signInWithEmailAndPassword(email, password)
        if (user && user.isAnonymous){
            user.delete()
        }
        return
    }

    if (user){
        const credential = firebase.auth.EmailAuthProvider.credential(email, password)
        await user.linkWithCredential(credential)
        return
    }
    
    await auth.createUserWithEmailAndPassword(email, password)     
}

function loginProcessor(addProperties){
    return async ({action, values})=>{
        const debug = getLogger("auth")    
        debug('%s, form: %o', action, values)
        const {email, password, remember} = values      

        try{
            if (action === "login" || action === "register"){
                await signInWithEmailAndPassword(action, email, password, remember)
            } else if (action === "remind") {
                await firebase.auth().sendPasswordResetEmail(email)
                successfullySentReminderNotification()
            } else{
                throw new Error(`not implemented login action: ${action}`)               
            }
        }catch(error){   
            errorNotification({operation:"during authentication", error})
        }
        addProperties()  
    }
}

export default function PasswordProtected({Login, Placeholder, buttons, handler, children}){
    const {user, addProperties} = useContext(UserContext) || {user:false}   
    if (!Login){
        Login = SimpleLogin
    }

    if (user === false){
        return Placeholder ? <Placeholder/> : null 
    }

    if (user && !user.isAnonymous){
        return <>{children}</>
    }

    const processor = loginProcessor(addProperties)
    const action = handler? ()=> handler(processor, addProperties): processor

    return <Login action={action} buttons={buttons}/>
}