const { FORMAT_HTTP_HEADERS, Tags } = require('opentracing')
const { getTracer } = require('./tracer')

const curlWithTracing = async (ctx, url, options) => {
  options = options || {}
  const span = ctx.span
  const tracer = getTracer()

  const newSpan = tracer.startSpan('curl', { childOf: span.context() })
  const headers = {
    ...options.headers
  }

  newSpan.setTag(Tags.HTTP_URL, config.url)
  newSpan.setTag(Tags.HTTP_METHOD, config.method)
  newSpan.setTag(Tags.SPAN_KIND, Tags.SPAN_KIND_RPC_CLIENT)
  // Send span context via request headers (parent id etc.)
  tracer.inject(newSpan, FORMAT_HTTP_HEADERS, headers)

  options.headers = headers

  return ctx.curl(url, options)
    .catch(err => {
      newSpan.setTag(Tags.ERROR, true)
      throw err
    })
    .finally(() => {
      newSpan.finish()
    })
}

module.exports = {
  curlWithTracing
}
