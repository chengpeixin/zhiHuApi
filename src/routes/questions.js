import Router from 'koa-router'
import questionsCtl from './../controllers/questions'
import {secret} from './../config'
import jwt from 'koa-jwt'

const auth = jwt({secret})
const router = new Router({ prefix: '/questions' })


router.get('/', questionsCtl.find)
router.post('/', auth,questionsCtl.create)
router.get('/:id', questionsCtl.checkQuestionExist,questionsCtl.findById)
router.patch('/:id',auth,questionsCtl.checkQuestionExist,questionsCtl.update)
router.delete('/:id',auth,questionsCtl.checkQuestionExist,questionsCtl.checkQuestioner,questionsCtl.delete)

export default router