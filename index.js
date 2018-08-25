/**
 * @file index.js
 * @copyright Matthew Bill
 */

// Aws Metrics
const AwsMetricDatum = require('./src/aws-metrics/aws-metric-datum');
const AwsMetricsBuffer = require('./src/aws-metrics/aws-metrics-buffer');
const AwsMetricsEmitter = require('./src/aws-metrics/aws-metrics-emitter');

// Service Metrics
const ServiceMetricMethods = require('./src/service-metrics/service-metric-methods');
const ServiceMetricNames = require('./src/service-metrics/service-metric-names');
const ServiceMetricsEmitter = require('./src/service-metrics/service-metrics-emitter');

// Web Metrics
const WebMetricsEmitter = require('./src/web-metrics/web-metrics-emitter');

module.exports = {
  AwsMetricDatum,
  AwsMetricsBuffer,
  AwsMetricsEmitter,
  ServiceMetricMethods,
  ServiceMetricNames,
  ServiceMetricsEmitter,
  WebMetricsEmitter,
};
