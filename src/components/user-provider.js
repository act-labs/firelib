import React, { useEffect, useState} from 'react'

import firebase from 'firebase/app'
import 'firebase/auth'

import UserContext from "./user-context"
import getLogger from "./get-logger"

function registerFirebase(firebaseConfig){
    if (!firebase.apps.length) {
        return firebase.initializeApp(firebaseConfig) 
    } 
}

function signInAnonymously(){
    if (firebase.auth().currentUser){
        return
    }
    firebase.auth().signInAnonymously().catch(error=>{
        console.error("could not sign in anonymously", error)
        setTimeout(signInAnonymously, 5000)
    })    
}

export default function UserProvider({firebaseConfig, children, anonymous=true}){
    try{
        registerFirebase(firebaseConfig)
    }catch(error){
        console.error("during app registration", error)
    }
 
    const [user, setUser] = useState(false)
    const [properties, setProperties] = useState()
    const debug = getLogger("auth") // use "debug" library to nicely log events 

    useEffect(()=>{
        return firebase.auth().onAuthStateChanged(function(user) {
            debug("auth state change user: %o", user)
            setUser(user)
            if (!user && anonymous){
                signInAnonymously()
            }
        })
    }, [])

    const addProperties = v => setProperties(Object.assign({}, properties, v))    

    const value = Object.freeze(Object.assign({user, addProperties}, properties))
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}