/**
 * @file web-metrics-emitter.js
 * @copyright Matthew Bill
 */
const AwsMetricsEmitter = require('../aws-metrics/aws-metrics-emitter.js');
const ServiceMetricNames = require('../service-metrics/service-metric-names.js');

/**
 * Class representing an AWS cloudwatch metrics emitter with shortcut methods for web specific dimensions and namespaces.
 */
class WebMetricsEmitter extends AwsMetricsEmitter {
  /**
     * Constructor for WebMetricsEmitter
     * @param {number} batchDelay The number of millisencons to wait before sending the metrics data.
     * If set to null or less than 1, then metrics will be emitted individually.
     * @param {bool} autoStart If true, then the emitter autimatically starts emitting mmetrics after the batch delay.
     * @param {string} org The organisation the metrics are for. This is used to determine the namespace.
     * @param {string} environment Tbe environment the metrics are for. This is added as a dimension to all metrics.
     * @param {Logger} logger The winston logger.
     */
  constructor(batchDelay, autoStart, org, environment, cloudWatch, logger) {
    super(batchDelay, autoStart, cloudWatch, logger);
    const self = this;
    self.org = org;
    self.environment = environment;
  }

  /**
     * Adds a count for the request to the application in general, irrespective of the end point.
     * @param {string} appName The name of the application.
     */
  addWebRequestCountMetric(appName) {
    const self = this;
    const namespace = self.getNamespace(appName);
    const dimensions = [
      { Name: 'Environment', Value: self.environment },
    ];
    return self.buffer.addMetricDatum(namespace, ServiceMetricNames.REQUESTS, dimensions, 'Count', 1, true);
  }

  /**
     * Adds a count metric for a web request.
     * @param {string} appName The name of the app.
     * @param {string} method The http method: GET, PUT, etc
     * @param {string} metricName the name of the metric.
     */
  addWebMethodCountMetric(appName, method, metricName) {
    const self = this;
    return self.addWebMetric(appName, method, metricName, 'Count', 1);
  }

  /**
     * Adds a response size metric for a web request.
     * @param {string} appName The name of the app.
     * @param {string} method The http method: GET, PUT, etc
     * @param {number} responseSize the size of the response in bytes.
     */
  addResponseSizeMetric(appName, method, responseSize) {
    const self = this;
    return self.addWebMetric(appName, method, ServiceMetricNames.RESPONSE_SIZE, 'Bytes', responseSize);
  }

  /**
     * Adds a response ellapsed time metric for a web request.
     * @param {string} appName The name of the app.
     * @param {string} method The http method: GET, PUT, etc
     * @param {number} responseTime the ellapsed time in millseconds of the response.
     */
  addResponseTimeMetric(appName, method, responseTime) {
    const self = this;
    return self.addWebMetric(appName, method, ServiceMetricNames.RESPONSE_TIME, 'Milliseconds', responseTime);
  }

  /**
     * Adds a web metric to the emitter buffer.
     * @param {string} appName The name of the app.
     * @param {string} method The http method: GET, PUT, etc
     * @param {string} metricName The name of the metric.
     * @param {string} unit The metric unit.
     * @param {string} value The metric value.
     */
  addWebMetric(appName, method, metricName, unit, value) {
    const self = this;
    const namespace = self.getNamespace(appName);
    const dimensions = [
      { Name: 'Method', Value: method },
      { Name: 'Environment', Value: self.environment },
    ];
    return self.buffer.addMetricDatum(namespace,
      metricName, dimensions, unit, value, true);
  }

  /**
     * Gets the namespace for metric datums based on the org and application name.
     * @param {srting} appName The name of the web application.
     */
  getNamespace(appName) {
    const self = this;
    return `${self.org}/Apps/${appName}`;
  }
}

module.exports = WebMetricsEmitter;
