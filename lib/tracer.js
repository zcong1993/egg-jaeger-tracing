const { initTracer } = require('jaeger-client')
const { FORMAT_HTTP_HEADERS, Tags } = require('opentracing')

let tracer

const setupTracer = (app, config, options) => {
  tracer = initTracer(config, options)

  app.use(async (ctx, next) => {
    const parentSpanContext = tracer.extract(
      FORMAT_HTTP_HEADERS,
      ctx.request.headers
    )
    const span = tracer.startSpan('egg-tracing-mw', {
      childOf: parentSpanContext,
      tags: { [Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER }
    })

    ctx.rootSpan = span
    ctx.span = span

    try {
      await next()
      span.setTag(Tags.HTTP_STATUS_CODE, ctx.status || 200)
    } catch (err) {
      span.setTag(Tags.ERROR, true)
      span.setTag(Tags.HTTP_STATUS_CODE, err.statusCode || 500)
      throw err
    } finally {
      const matchedRoute = ctx._matchedRoute || '__no_matched'
      const routerName = ctx.routerName || matchedRoute
      span.setTag('route', routerName)
      span.finish()
    }
  })

  return tracer
}

const getTracer = () => {
  if (!tracer) {
    throw new Error('call setupTracer first')
  }
  return tracer
}

module.exports = {
  setupTracer,
  getTracer
}
