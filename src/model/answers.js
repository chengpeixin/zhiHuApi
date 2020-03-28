/*
 * @Description: 答案model设计
 * @Author: 惜纸
 * @Date: 2019-09-01 01:08:35
 * @LastEditTime: 2019-09-01 13:43:27
 * @LastEditors: Please set LastEditors
 */
const mongoose = require('mongoose')

const { Schema,model } = mongoose

const answersSchema = new Schema({
  __v:{type:Number,select:false},
  content:{type:String,required:true},
  answerer:{type:Schema.Types.ObjectId,ref:'User',required:true,select:true},
  questionId:{type:String,select:true},
  voteCount:{type:Number,required:true,default:0}
})

export default model('Answers',answersSchema)