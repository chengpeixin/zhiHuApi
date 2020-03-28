/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-01 16:48:30
 * @LastEditTime: 2019-09-01 22:34:20
 * @LastEditors: Please set LastEditors
 */
import Router from 'koa-router'
import UsersCtl from './../controllers/users'
import TopicCtl from './../controllers/topics'
import {secret} from './../config'
// import Jsonwebtoken from 'jsonwebtoken'
import jwt from 'koa-jwt'
import Answers from './../controllers/answers'
const router = new Router({ prefix: '/users' })

const auth = jwt({secret})


router.get('/', UsersCtl.findUser)
router.post('/', UsersCtl.createUser)
router.get('/:id', UsersCtl.findByIdUser)
router.patch('/:id',auth,UsersCtl.checkOwner,UsersCtl.update)
router.delete('/delete/:userId',auth, UsersCtl.checkOwner,UsersCtl.deleteByIdUser)
router.post('/login',UsersCtl.login)

router.get('/:id/following',UsersCtl.listFollowing)
// 关注用户
router.put('/following/:id',auth,UsersCtl.checkUserExist,UsersCtl.follow);
router.delete('/following/:id',auth,UsersCtl.checkUserExist,UsersCtl.unfollow)
router.get('/:id/followers',auth,UsersCtl.checkUserExist,UsersCtl.listFollowers)

// 关注话题
router.get('/:id/followingTopics',auth,UsersCtl.listFollowingTopics)
router.put('/followingTopic/:id',auth,TopicCtl.checkTopicExist,UsersCtl.followTopic);
router.delete('/followingTopic/:id',auth,TopicCtl.checkTopicExist,UsersCtl.unfollowTopic)

// 用户提问的问题
router.get('/:id/questions',UsersCtl.listQuestions)

// 用户答案 赞
router.get('/:id/likingAnswers',auth,UsersCtl.listLikingAnswers)
router.put('/likingAnswers/:id',auth,Answers.checkAnswersExist,UsersCtl.likingAnswers,UsersCtl.unDislikeAnswer);
router.delete('/likingAnswers/:id',auth,Answers.checkAnswersExist,UsersCtl.unlikeAnswer)
// 用户答案 踩
router.get('/:id/dislikingAnswers',auth,UsersCtl.listDisLikingAnswers)
router.put('/dislikingAnswers/:id',auth,Answers.checkAnswersExist,UsersCtl.disAnswers,UsersCtl.unlikeAnswer);
router.delete('/dislikingAnswers/:id',auth,Answers.checkAnswersExist,UsersCtl.unDislikeAnswer)

// 用户答案 收藏
router.get('/:id/collectingAnswers',auth,UsersCtl.listCollectingAnswers)
router.put('/collectingAnswers/:id',auth,Answers.checkAnswersExist,UsersCtl.collectingAnswers);
router.delete('/collectingAnswers/:id',auth,Answers.checkAnswersExist,UsersCtl.unCollectingAnswer)
export default router