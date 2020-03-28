/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-23 16:59:25
 * @LastEditTime: 2019-09-01 01:54:51
 * @LastEditors: Please set LastEditors
 */
import HomeCtl from './../controllers/home'
import Router from 'koa-router'

const router = new Router()
router.get('/',ctx=>{
  ctx.body = '撒旦请问的撒多为请问'
})
router.post('/info',ctx=>{
  ctx.body = '撒旦请问的撒多为请问'
})
router.post('/upload',HomeCtl.upload)
export default router