/*
 * @Description: 话题model定义
 * @Author: 惜纸
 * @Date: 2019-09-01 01:18:09
 * @LastEditTime: 2019-09-01 01:18:23
 * @LastEditors: Please set LastEditors
 */
import Mongoose from 'mongoose'

const { Schema, model } = Mongoose

const topicsSchema = new Schema({
    __v:{
        type:Number,
        select:false
    },
    name:{
      type:String,
      required:true
    },
    avatar_url:{
      type:String
    },
    introduction:{
      type:String,
      select:false
    }
})

const topicsModel = model('Topics', topicsSchema)

export default topicsModel