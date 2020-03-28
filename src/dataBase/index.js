import { pwd, user, authSource,mongodbUrl } from './../config'
import {connect,connection} from 'mongoose'
 
export default ()=>{
  connect(mongodbUrl, { useNewUrlParser: true,user,pass:pwd,authSource }, () => console.log('mongoose connect success'))
  connection.on('error', console.error)
}