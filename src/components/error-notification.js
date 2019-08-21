import { notification } from 'antd'

const errorNotification = ({operation, error})=>{
  const message = `Error ${operation}`
  console.error(message, error)
  const msg = error.message || (error.toSting && error.toSting()) || error
  notification.error({
      message,
      description: msg, 
      duration: 10
    });
}

export default errorNotification