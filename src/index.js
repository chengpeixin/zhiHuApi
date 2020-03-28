import Koa from 'koa'
import koaBody from 'koa-body'  
import requestBody from './Middleware/mergeRequestBody'
import error from 'koa-json-error'
import routing from './routes/index'
import connect from './dataBase/index'
import parameter from 'koa-parameter'
import path from 'path'
import Static from 'koa-static'
var app = new Koa();
app.use(Static(path.join(__dirname,'public'))).use(koaBody({
  multipart:true,
  formidable:{
    uploadDir:path.join(__dirname,'/public/uploads'),
    keepExtensions:true
  }
})).use(requestBody()).use(error({
  postFormat:(e,{
    stack,...rest
  })=>process.env.NODE_ENV==='production'?rest:{stack,...rest}
})).use(parameter(app))
routing(app)
connect()
app.listen(3000, () => console.log('启动'))