// 连接数据库文件
import { pwd, account, authSource,mongodbUrl } from './../config'
import {connect,connection} from 'mongoose'
export default ()=>{
  connect(mongodbUrl, { useNewUrlParser: true,user:account,pass:pwd,authSource,useUnifiedTopology:true}, () => console.log('mongoose connect success'))
  connection.on('error', console.error)
}