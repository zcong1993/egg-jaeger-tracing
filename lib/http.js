const { FORMAT_HTTP_HEADERS, Tags } = require('opentracing')

const getTracingHeaders = (
  headers,
  tracingKeys = []
) => {
  const res= {};
  tracingKeys.forEach((key) => {
    const val = headers[key];
    if (val) {
      res[key] = val;
    }
  });
  return res;
};


const curlWithTracing = async (ctx, url, options) => {
  options = options || {}

  const { tracingKeys } = ctx.app.config.jaegerTracing;
  const tracingHeaders = getTracingHeaders(
    ctx.request.headers || {},
    tracingKeys
  );

  options.headers = {
    ...tracingHeaders,
    ...options && options.headers,
  };

  if (!ctx.app.config.jaegerTracing.enable) {
    return ctx.curl(url, options);
  }


  const span = ctx.span
  const tracer = ctx.app.tracer

  const newSpan = tracer.startSpan('curl', { childOf: span.context() })
  const headers = {
    ...options.headers
  }

  newSpan.setTag(Tags.HTTP_URL, url)
  newSpan.setTag(Tags.HTTP_METHOD, (options.method || 'GET').toUpperCase())
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
