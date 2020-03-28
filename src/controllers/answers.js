/*
 * @Description: 问题控制器
 * @Author: 惜纸
 * @Date: 2019-09-01 01:10:11
 * @LastEditTime: 2019-09-01 16:04:57
 * @LastEditors: Please set LastEditors
 */
import Answers from '../model/answers'
class AnswersCtl {
  async find(ctx){
    const {per_page=10,q='',page,questionId} = ctx.params
    const currentPage = Math.max(page * 1,1 )-1
    const perPage = Math.max(per_page * 1,1)
    ctx.body = await Answers.find({$or:[
      {content:q},
      {questionId}
    ]})
    .limit(perPage).skip(currentPage*perPage)
  }
  async findById(ctx){
    const {fields=';',id} = ctx.params
    const selectFields = fields.split(';').filter(f=>f).map(f=>`+${f}`).join('');
    const answers = await Answers.findById(id).select(selectFields).populate('answerer')
    ctx.body = answers
  }

  async create(ctx){
    ctx.verifyParams({
      content:{type:'string',required:true}
    })
    const answerer = ctx.state.user._id;
    const {questionId} = ctx.params
    const answers = await new Answers({
      ...ctx.params,answerer,questionId
    }).save()
    ctx.body = answers;
  }

  async update(ctx){
    ctx.verifyParams({
      content:{type:'string',required:false}
    })
    delete ctx.params.id
    await ctx.state.answers.update(ctx.params)
    ctx.body = ctx.state.answers;
  }

  async delete(ctx){
    await Answers.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }
  // 是否存在这个答案
  async checkAnswersExist(ctx,next){
    const answers = await Answers.findById(ctx.params.id)
    if (!answers) {
      ctx.throw(404,'答案不存在')
    }
    if (ctx.params.questionId && answers.questionId!==ctx.params.questionId){
      ctx.throw(404,'该问题下没有此答案')
    }
    ctx.state.answers = answers
    await next()
  }

  // 检查回答者是不是自己
  async checkAnswerer (ctx,next){    
    const {user,answers} = ctx.state
    if (answers.answerer.toString()!==user._id){
      ctx.throw(403,'没有权限')
    }
    await next()
  }
}

export default new AnswersCtl()