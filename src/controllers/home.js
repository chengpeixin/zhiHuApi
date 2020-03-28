import path from 'path'
class HomeCtl {
  upload(ctx){
    const file = ctx.request.files.file;
    const baseName = path.basename(file.path)
    ctx.body = {url:`${ctx.origin}/uploads/${baseName}`}
  }
}


export default new HomeCtl()