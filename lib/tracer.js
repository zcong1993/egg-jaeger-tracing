const fromParentSpan = (ctx, name, options) => {
  const newSpan = ctx.app.tracer.startSpan(name, {
    childOf: ctx.span.context(),
    ...options
  })

  return newSpan
}

module.exports = {
  fromParentSpan
}
