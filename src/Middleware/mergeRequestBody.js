/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-01 01:55:08
 * @LastEditTime: 2019-09-01 01:55:08
 * @LastEditors: Please set LastEditors
 */
export default  () => {
    return async function (ctx,next) {
        ctx.params = {
            ...ctx.request.body,
            ...ctx.query
        };
        await next();
    }
}