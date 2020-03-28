/*
 * @Description: 答案路由
 * @Author: 惜纸
 * @Date: 2019-09-01 01:46:05
 * @LastEditTime: 2019-09-01 01:48:04
 * @LastEditors: Please set LastEditors
 */
import Router from 'koa-router'
import AnswersCtl from '../controllers/answers'
import {secret} from '../config'
import jwt from 'koa-jwt'

const auth = jwt({secret})
const router = new Router({ prefix: '/questions/:questionId/answers' })


router.get('/', AnswersCtl.find)
router.post('/', auth,AnswersCtl.create)
router.get('/:id', AnswersCtl.checkAnswersExist,AnswersCtl.findById)
router.patch('/:id',auth,AnswersCtl.checkAnswersExist,AnswersCtl.update)
router.delete('/:id',auth,AnswersCtl.checkAnswersExist,AnswersCtl.checkAnswerer,AnswersCtl.delete)

export default router