/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-01 01:54:40
 * @LastEditTime: 2019-09-01 22:47:30
 * @LastEditors: Please set LastEditors
 */
import User from './../model/users'
import Jsonwebtoken from 'jsonwebtoken'
import {secret} from './../config'
import Questions from './../model/questions'
import Answer from './../model/answers'
class UsersCtl {
    async findUser(ctx) {
        const {per_page=10,q='',page} = ctx.params
        const currentPage = Math.max(page * 1,1 )-1
        const perPage = Math.max(per_page * 1,1)
        ctx.body = await User.find({
            name:new RegExp(q)
        }).limit(perPage).skip(currentPage*perPage)
    }
     async findByIdUser(ctx) {
         let {fields=';'} = ctx.query
         const selectFields = fields.split(';').filter(f=>f).map(f=>`+${f}`).join(' ')
         const populate = fields.split(';').filter(f=>f).map(f=>{
             switch (f) {
                 case 'employments': return 'employments.company employments.job';
                 case 'educations':return 'educations.school educations.major';
                 default: return f
             }
         }).join(' ')
         const user = await User.findById(ctx.params.id).select(selectFields).populate(populate)
         if  (!user) ctx.throw(404,'用户不存在')
         ctx.body = user
    }
    async createUser(ctx) {
        const {params} = ctx
        ctx.verifyParams({
            name:{
                type:'string',
                required:true
            },
            password:{
                type:"string",
                required:true
            }
        });
        const repeatedUser = await User.findOne({name:params.name})
        if (repeatedUser){
            ctx.throw(409,'用户已存在')
        }
        const user = await new User(params).save()
        ctx.body = user
    }
    async deleteByIdUser(ctx) {
        const {params} = ctx
        ctx.verifyParams({
            userId:{
                type:'string',
                required:true
            }
        })
        const user = await User.findByIdAndRemove(params.userId)
        if (!user) {
            ctx.throw(404,'用户不存在')
        }else{
            ctx.body = 204
        }
    }

    async update(ctx){
        const {params} = ctx
        const {id} = params
        ctx.verifyParams({
            name:{
                type:'string',
                required:false
            },
            password:{
                type:'string',
                required:false
            },
            avatar_url:{
                type:'string',
                required:false
            },
            gender:{type:'string',required:false},
            headline:{type:'string',required:false},
            locations:{type:'array',itemType:'string',required:false},
            business:{type:'string',required:false},
            employments:{type:'array',itemType:'object',required:false},
            educations:{type:'array',itemType:'object',required:false}
        })
        delete ctx.params.id
        const user = await User.findByIdAndUpdate(id,ctx.params);
        if (!user){
            ctx.throw(404)
        }
        ctx.body= user
    }
    async login(ctx){
        ctx.verifyParams({
            name:{
                type:'string',
                required:true
            },
            password:{
                type:'string',
                required:true
            }
        })
        const user = await User.findOne(ctx.params)
        if (!user) ctx.throw(401,'用户名密码错误')
        const {_id,name} = user
        const token = Jsonwebtoken.sign({_id,name},secret,{expiresIn:'1d'});
        ctx.body = {token}
    }
    async listFollowing(ctx){
        const user = await User.findById(ctx.params.id).select('+following').populate('following')
        if(!user){
            ctx.throw(404)
        }else{
            ctx.body= user.following;
        }
    }

    async follow(ctx){
        const me = await User.findById(ctx.state.user._id).select('+following')
        if (!me.following.map(id=>id.toString()).includes(ctx.params.id)){
            me.following.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
    }

    async followTopic(ctx){
        const me = await User.findById(ctx.state.user._id).select('+followingTopics')
        if (!me.followingTopics.map(id=>id.toString()).includes(ctx.params.id)){
            me.followingTopics.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
    }

    async unfollowTopic(ctx){
        const me = await User.findById(ctx.state.user._id).select('+followingTopics')
        const index = me.followingTopics.map(id=>id.toString()).indexOf(ctx.params.id)
        if (index>-1){
            me.followingTopics.splice(index,1)
            me.save()
        }
        ctx.body = 204
    } 

    async listFollowingTopics(ctx){
        const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics')
        if(!user){
            ctx.throw(404,'用户不存在')
        }else{
            ctx.body= user.followingTopics;
        }
    }

    async unfollow(ctx){
        const me = await User.findById(ctx.state.user._id).select('+following')
        const index = me.following.map(id=>id.toString()).indexOf(ctx.params.id)
        if (index>-1){
            me.following.splice(index,1)
            me.save()
        }
        ctx.body = 204
    }

    async listFollowers(ctx){
        // 查找followingID为传入id的数据
        const users = await User.find({
            following:ctx.params.id
        })
        ctx.body = users
    }

    async listQuestions(ctx){
        const questions = await Questions.find({questioner:ctx.params.id})
        ctx.body = questions
    }



    // 赞一个答案
    async likingAnswers(ctx,next){
        const me = await User.findById(ctx.state.user._id).select('+liningAnswers')
        const {id} = ctx.params
        if (!me.liningAnswers.map(id=>id.toString()).includes(id)){
            me.liningAnswers.push(id)
            me.save()
            await Answer.findByIdAndUpdate(id,{
                $inc:{voteCount:1}
            })
        }
        ctx.status = 204
        await next()
    }

    // 取消赞
    async unlikeAnswer(ctx){
        const me = await User.findById(ctx.state.user._id).select('+liningAnswers')
        const index = me.liningAnswers.map(id=>id.toString()).indexOf(ctx.params.id)
        if (index>-1){
            me.liningAnswers.splice(index,1)
            me.save()
            await Answer.findByIdAndUpdate(ctx.params.id,{
                $inc:{voteCount:-1}
            })
        }
        ctx.body = 204
    } 

    // 用户赞过的答案列表
    async listLikingAnswers(ctx){
        const user = await User.findById(ctx.params.id)
        .select('+liningAnswers').populate('dislikingAnswers')
        if(!user){
            ctx.throw(404,'用户不存在')
        }else{
            ctx.body= user.liningAnswers;
        }
    }
    // 踩一个答案
    async disAnswers(ctx,next){
        const me = await User.findById(ctx.state.user._id).select('+disliningAnswers')
        if (!me.disliningAnswers.map(id=>id.toString()).includes(ctx.params.id)){
            me.disliningAnswers.push(ctx.params.id)
            me.save()
            await Answer.findByIdAndUpdate(ctx.params.id,{
                $inc:{voteCount:1}
            })
        }
        ctx.status = 204
        next()
    }

    // 取消踩
    async unDislikeAnswer(ctx){
        const me = await User.findById(ctx.state.user._id).select('+disliningAnswers')
        const index = me.disliningAnswers.map(id=>id.toString()).indexOf(ctx.params.id)
        if (index>-1){
            me.disliningAnswers.splice(index,1)
            me.save()
            await Answer.findByIdAndUpdate(ctx.params.id,{
                $inc:{voteCount:-1}
            })
        }
        ctx.body = 204
    } 

    // 用户踩过的答案列表
    async listDisLikingAnswers(ctx){
        const user = await User.findById(ctx.params.id)
        .select('+disliningAnswers')
        if(!user){
            ctx.throw(404,'用户不存在')
        }else{
            ctx.body= user.disliningAnswers;
        }
    }


    // 收藏一个答案
    async collectingAnswers(ctx,next){
        const me = await User.findById(ctx.state.user._id).select('+collectingAnswers')
        if (!me.collectingAnswers.map(id=>id.toString()).includes(ctx.params.id)){
            me.collectingAnswers.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
        next()
    }

    // 取消收藏
    async unCollectingAnswer(ctx){
        const me = await User.findById(ctx.state.user._id).select('+collectingAnswers')
        const index = me.collectingAnswers.map(id=>id.toString()).indexOf(ctx.params.id)
        if (index>-1){
            me.collectingAnswers.splice(index,1)
            me.save()
            await Answer.findByIdAndUpdate(ctx.params.id,{
                $inc:{voteCount:-1}
            })
        }
        ctx.body = 204
    }

    // 用户收藏过的答案列表
    async listCollectingAnswers(ctx){
        const user = await User.findById(ctx.params.id)
        .select('+collectingAnswers').populate('collectingAnswers')
        if(!user){
            ctx.throw(404,'用户不存在')
        }else{
            ctx.body= user.collectingAnswers;
        }
    }



    
    async checkUserExist(ctx,next){
        const user = await User.findById(ctx.params.id)
        if(!user) {
            ctx.throw(404,'用户不存在')
        }else{
            await next()
        }
    }

    async checkOwner (ctx,next){
        if (ctx.params.id!==ctx.state.user._id){
            ctx.throw(403,'没有权限')
        }
        await next()
    }
}

export default new UsersCtl()