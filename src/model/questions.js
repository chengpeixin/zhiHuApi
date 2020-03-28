/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-01 01:08:35
 * @LastEditTime: 2019-09-01 01:18:29
 * @LastEditors: Please set LastEditors
 */
const mongoose = require('mongoose')

const { Schema,model } = mongoose

const questionSchema = new Schema({
  __v:{type:Number,select:false},
  title:{type:String,required:true},
  description:{type:String},
  questioner:{type:Schema.Types.ObjectId,ref:'User',select:false},
  topics:{
    type:[{type:Schema.Types.ObjectId,ref:'Topics',select:false}],
    select:false
  }
})

export default model('Question',questionSchema)