/*
 * @Description: 话题控制器
 * @Author: 惜纸
 * @Date: 2019-09-01 01:11:53
 * @LastEditTime: 2019-09-01 01:12:02
 * @LastEditors: Please set LastEditors
 */
import Topic from './../model/topics'
import User from './../model/users'
import Question from './../model/questions'
class TopicCtl {
  async find(ctx){
    const {per_page=10,q='',page} = ctx.params
    const currentPage = Math.max(page * 1,1 )-1
    const perPage = Math.max(per_page * 1,1)
    ctx.body = await Topic.find({
      name:new RegExp(q)
  }).limit(perPage).skip(currentPage*perPage)
  }
  async findById(ctx){
    const {fields=';',id} = ctx.params
    const selectFields = fields.split(';').filter(f=>f).map(f=>`+${f}`).join('');
    const topic = await Topic.findById(id).select(selectFields)
    ctx.body = topic
  }

  async create(ctx){
    ctx.verifyParams({
      name:{
        type:'string',
        required:true
      },
      avatar_url:{
        type:'string',
        required:false
      },
      introduction:{
        type:'string',
        required:false
      }
    })
    const topic = await new Topic(ctx.params).save()
    ctx.body = topic;
  }

  async update(ctx){
    ctx.verifyParams({
      name:{type:'string',required:false},
      avatar_url:{type:'string',required:false},
      introduction:{type:'string',required:false}
    })
    const id = ctx.params.id
    delete ctx.params.id
    const topic = await Topic.findByIdAndUpdate(id,ctx.params)
    ctx.body = topic
  }

  async listFollowingTopic(ctx){
    const users = await User.find({ 
      followingTopics:ctx.params.id
    })
    ctx.body = users
  }

  async checkTopicExist(ctx,next){
    const topic = await Topic.findById(ctx.params.id)
    if (!topic) {
      ctx.throw(404,'话题不存在')
    }
    await next()
  }
  async listQuestions(ctx){
    const questions = await Question.find({topics:ctx.params.id})
    ctx.body = questions
  }
}

export default new TopicCtl()