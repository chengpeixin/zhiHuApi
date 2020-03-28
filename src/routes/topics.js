/*
 * @Description: 话题的路由
 * @Author: 惜纸
 * @Date: 2019-09-01 01:13:49
 * @LastEditTime: 2019-09-01 01:13:57
 * @LastEditors: Please set LastEditors
 */
import Router from 'koa-router'
import topicsCtl from './../controllers/topics'
import {secret} from './../config'
import jwt from 'koa-jwt'
const auth = jwt({secret})
const router = new Router({ prefix: '/topics' })


router.get('/', topicsCtl.find)
router.post('/', auth,topicsCtl.create)
router.get('/:id', topicsCtl.checkTopicExist,topicsCtl.findById)
router.patch('/:id',auth,topicsCtl.checkTopicExist,topicsCtl.update)

router.get("/:id/followertopics",topicsCtl.checkTopicExist,topicsCtl.listFollowingTopic)
// 获取话题下的问题
router.get("/:id/questions",topicsCtl.checkTopicExist,topicsCtl.listQuestions)
export default router