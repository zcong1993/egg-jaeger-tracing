'use strict';

/**
 * egg-jaeger-tracing default config
 * @member Config#jaegerTracing
 * @property {String} SOME_KEY - some description
 */
exports.jaegerTracing = {
  enable: false,
  tracingKeys: ['x-request-id'],
};
