/**
 * @file service-metrics-emitter.js
 * @copyright Matthew Bill
 */
const AwsMetricsEmitter = require('../aws-metrics/aws-metrics-emitter.js');
const ServiceMetricNames = require('./service-metric-names');

/**
 * Class representing an AWS cloudwatch metrics emitter with shortcut methods for service specific dimensions and namespaces.
 */
class ServiceMetricsEmitter extends AwsMetricsEmitter {
  /**
     * Constructor for ServiceMetricsEmitter
     * @param {number} batchDelay The number of millisencons to wait before sending the metrics data. If set to null or less than 1, then metrics will be emitted individually.
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
     * Adds a count for the request to the service in general, irrespective of the end point.
     * @param {string} serviceName The name of the service; usually the resource name in plural that the service is for.
     */
  addRequestCountMetric(serviceName) {
    const self = this;
    const namespace = self.getNamespace(serviceName);
    const dimensions = [
      { Name: 'Environment', Value: self.environment },
    ];
    return self.buffer.addMetricDatum(namespace, ServiceMetricNames.REQUESTS, dimensions, 'Count', 1, true);
  }

  /**
     * Adds a count metric for a resource service request.
     * @param {string} serviceName The name of the service; usually the resource name in plural that the service is for.
     * @param {string} method The http method: GET, PUT, etc
     * @param {string} metricName the name of the metric.
     */
  addServiceMethodCountMetric(serviceName, method, metricName) {
    const self = this;
    return self.addServiceMetric(serviceName, method, metricName, 'Count', 1);
  }

  /**
     * Adds a response size metric for a resource service request.
     * @param {string} serviceName The name of the service; usually the resource name in plural that the service is for.
     * @param {string} method The http method: GET, PUT, etc
     * @param {number} responseSize the size of the response in bytes.
     */
  addServiceResponseSizeMetric(serviceName, method, responseSize) {
    const self = this;
    return self.addServiceMetric(serviceName, method, ServiceMetricNames.RESPONSE_SIZE, 'Bytes', responseSize);
  }

  /**
     * Adds a response ellapsed time metric for a resource service request.
     * @param {string} serviceName The name of the service; usually the resource name in plural that the service is for.
     * @param {string} method The http method: GET, PUT, etc
     * @param {number} responseTime the ellapsed time in millseconds of the response.
     */
  addServiceResponseTimeMetric(serviceName, method, responseTime) {
    const self = this;
    return self.addServiceMetric(serviceName, method, ServiceMetricNames.RESPONSE_TIME, 'Milliseconds', responseTime);
  }

  /**
     * Adds a service metric to the emitter buffer.
     * @param {string} serviceName The name of the service; usually the resource name in plural that the service is for.
     * @param {string} method The http method: GET, PUT, etc
     * @param {string} metricName The name of the metric.
     * @param {string} unit The metric unit.
     * @param {string} value The metric value.
     */
  addServiceMetric(serviceName, method, metricName, unit, value) {
    const self = this;
    const namespace = self.getNamespace(serviceName);
    const dimensions = [
      { Name: 'Method', Value: method },
      { Name: 'Environment', Value: self.environment },
    ];
    return self.buffer.addMetricDatum(namespace, metricName, dimensions, unit, value, true);
  }

  /**
     * Gets the namespace for metric datums based on the org and service names.
     * @param {srting} serviceName The name of the service; usually the resource name in plural that the service is for.
     */
  getNamespace(serviceName) {
    const self = this;
    return `${self.org}/Services/${serviceName}`;
  }
}

module.exports = ServiceMetricsEmitter;
