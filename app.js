const { setupTracer } = require('./lib')

module.exports = app => {
  setupTracer(app, {
    serviceName: app.config.name,
    ...app.config.jaegerTracing.config,
  }, app.config.jaegerTracing.options)
}