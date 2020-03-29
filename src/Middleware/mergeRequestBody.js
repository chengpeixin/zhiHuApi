export default  () => {
    return async function (ctx,next) {
        ctx.params = {
            ...ctx.request.body,
            ...ctx.query
        };
        await next();
    }
}