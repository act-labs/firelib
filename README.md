# React components for firebase projects

Components to simplify authentication in Firebase. To install:

`npm install firelib`

## Login/authentication

For demo/description see [blog post](https://act-labs.github.io/posts/firebase-auth/). Add `<UserProvider>` near the root of components hierarchy.    

```javascript
  function App({children}){
      return (
        <UserProvider firebaseConfig={firebaseConfig}>
              {children}
        </UserProvider>
      )
  }
```

Later UserContext to access/update user and authentication information:

```javascript
export default function Component(props){
    const {user, addProperties, accessToken} = useContext(UserContext)
    // ...
}
```

Restrict access to private user page sections:

```javascript
// password-protected-page-section.js
<PasswordProtected
    Login={Login}
    Placeholder={Skeleton}
    buttons={[GoogleSignInButton]}
>
    <Signout>Signout</Signout>
    <DeleteUser>Delete account</DeleteUser>
    <GoogleSignInButton style={googleLoginStyle}/>
    <GoogleSignInButton
    style = {googleLoginStyle}
    scopes = {["https://www.googleapis.com/auth/drive.readonly"]}
    >
        Google Drive
    </GoogleSignInButton>
    <GoogleDriveFilesList/>
</PasswordProtected>  
```

## Contributions

Library out of the box is able to address the most common authentication problems: anonymous users, email/password authentication and email password reminders. As authentication is a very application specific subject you may wish to grab repo code and make your modifications. If you do, you are welcome to contribute back. Just initiate a pull request.
