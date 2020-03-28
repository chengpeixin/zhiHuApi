/*
 * @Description: 问题控制器
 * @Author: 惜纸
 * @Date: 2019-09-01 01:10:11
 * @LastEditTime: 2019-09-01 01:10:24
 * @LastEditors: Please set LastEditors
 */
import Question from './../model/questions'
class QuestionCtl {
  async find(ctx){
    const {per_page=10,q='',page} = ctx.params
    const currentPage = Math.max(page * 1,1 )-1
    const perPage = Math.max(per_page * 1,1)
    ctx.body = await Question.find({
     $or:[{ title:new RegExp(q)},{ description:new RegExp(q)}]
  }).limit(perPage).skip(currentPage*perPage)
  }
  async findById(ctx){
    const {fields=';',id} = ctx.params
    const selectFields = fields.split(';').filter(f=>f).map(f=>`+${f}`).join('');
    const question = await Question.findById(id).select(selectFields).populate('questioner topics')
    ctx.body = question
  }

  async create(ctx){
    ctx.verifyParams({
      title:{type:'string',required:true},
      description:{type:'string',required:false} 
    })
    const question = await new Question({...ctx.params,questioner:ctx.state.user._id}).save()
    ctx.body = question;
  }

  async update(ctx){
    ctx.verifyParams({
      title:{type:'string',required:false},
      description:{type:'string',required:false}
    })
    delete ctx.params.id
    await ctx.state.question.update(ctx.params)
    ctx.body = ctx.state.question;
  }

  async delete(ctx){
    await Question.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
}

  async checkQuestionExist(ctx,next){
    const question = await Question.findById(ctx.params.id).select('+questioner')
    if (!question) {
      ctx.throw(404,'问题不存在')
    }
    ctx.state.question = question
    await next()
  }

  async checkQuestioner (ctx,next){
    const {question} = ctx.state
    if (question.questioner.toString()!==ctx.state.user._id){
      ctx.throw(403,'没有权限')
    }
    await next()
  }
}

export default new QuestionCtl()