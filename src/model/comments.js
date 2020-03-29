// 评论
const mongoose = require('mongoose')

const { Schema,model } = mongoose

const commentsSchema = new Schema({
  __v:{type:Number,select:false},
  content:{type:String,required:true},
  commentator:{type:Schema.Types.ObjectId,ref:'User',required:true,select:true},
  questionId:{type:String,select:true},
  answerId:{type:Number,required:true,default:0}
})

export default model('Answers',commentsSchema)