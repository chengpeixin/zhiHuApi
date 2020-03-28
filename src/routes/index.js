import fs from 'fs'
export default (app) => {
    fs.readdirSync(__dirname).forEach(async file => {
        const fileName = file.replace(/([.][^/]+)$/, '')
        if (fileName === 'index') return
        const routes = await require(`./${fileName}`)
        app.use(routes.default.routes()).use(routes.default.allowedMethods());
    })
}