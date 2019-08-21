import React, {useState} from "react"
import {useAsync} from "react-use"

import { Form, Icon, Input, Button, Checkbox, Card } from 'antd'
import "./login.less"

const MODE_REMIND = "remind"
const MODE_LOGIN = "login"
const MODE_REGISTER = "register"

const Password = (props)=>{
  const {mode, getFieldDecorator} = props
  if (mode===MODE_REMIND){
    return null
  }
  return (
    <Form.Item>
    {getFieldDecorator('password', {
      rules: [{ required: true, message: 'Please input your Password!' }],
    })(
      <Input
        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
        type="password"
        placeholder="Password"
        autoComplete="current-password"
      />,
    )}
  </Form.Item>
  )
}

const actionNames = {
  [MODE_LOGIN]: "Log in",
  [MODE_REGISTER]: "Register",
  [MODE_REMIND]: "Reminder E-mail"
}

const Action = (props)=>{
  const {mode, busy} = props
  return (
    <Button type="primary" loading={busy} htmlType="submit" className="login-form__button">
      {actionNames[mode]}
    </Button>
  )
}

const RegisterButton = ({changeMode})=> <Button type="link" onClick={changeMode(MODE_REGISTER)}>register now!</Button>
const LoginButton = ({changeMode, mode})=> (
  <Button type="link" onClick={changeMode(MODE_LOGIN)}>{mode === MODE_REGISTER ? "log in!":"Log in"}</Button>
)


const Otherwise = (props)=> {
  const {mode} = props
  const FirstOption = (props) => mode === MODE_REMIND? 
    (<><LoginButton {...props}/><span>or</span></>) 
    : <span>Or</span>
  const SecondOption = mode === MODE_REGISTER ? LoginButton : RegisterButton 
  return (
    <>
    <FirstOption{...props}/>
    <SecondOption {...props}/>
    </>
  )
}

const ForgotButton = ( {changeMode})=> (
    <Button className="login-form__forgot" type="link" onClick={changeMode(MODE_REMIND)} >
      Forgot password
    </Button>
  )

const Buttons = (props)=>{
  const {mode, getFieldDecorator, buttons} = props
  return (
  <Form.Item>
    {mode !== MODE_REMIND && getFieldDecorator('remember', {
      valuePropName: 'checked',
      initialValue: true,
    })(<Checkbox>Remember me</Checkbox>)}

    {mode !== MODE_REMIND && <ForgotButton  {...props}/>}
    <Action {...props}/>
    {buttons && buttons.map((Component, i)=><Component key={i}/>)}
    <Otherwise {...props}/>
  </Form.Item>
  )
}

function NormalLoginForm(props){
  const {form, action} = props
  const { getFieldDecorator } = form

  const [mode, setMode] = useState(MODE_LOGIN)
  const [request, makeRequest] = useState()
  const auth = useAsync( async ()=>{
    if (!request){
      return
    }
    return await action(request)
  }, [request])
  const busy = request && auth.loading  

  const handleSubmit = async e => {
    e.preventDefault()
    form.validateFields(async (err, values) => {
      if (!err && !busy) {
        makeRequest({action:mode, values})
      }
    })
  }

  const changeMode = v => {
    return (e)=>{
      e.preventDefault()
      setMode(v)
    }
  }

  const childrenContext = {...props, mode, changeMode, getFieldDecorator, busy}
  return (
    <Form onSubmit={handleSubmit} className="login-form__form">
      <Form.Item>
        {getFieldDecorator('email', {
          rules: [
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },              
            { required: true, message: 'Please input your E-mail!' }
          ],
        })(
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Email"
            autoComplete="username"
          />,
        )}
      </Form.Item>
      <Password {...childrenContext}/>
      <Buttons {...childrenContext}/>
    </Form>
  )
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default function Login(props){
  const {style, ...other} = props
    return (
      <Card className="login-form__card" style={style}>
        <WrappedNormalLoginForm {...other}/>
      </Card>
    )
}