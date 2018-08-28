
/**
 * @file metrics-emitter.js
 * @copyright Matthew Bill
 */
const AWS = require('aws-sdk');
const AwsMetricsBuffer = require('./aws-metrics-buffer');

/**
 * Class representing an AWS CloudWatch metrics emitter.
 * @class AwsMetricsEmitter
 */
class AwsMetricsEmitter {
  /**
     * Gets the metrics data
     */
  get buffer() {
    return this._buffer;
  }

  /**
     * Sets the metrics data
     */
  set buffer(value) {
    this._buffer = value;
  }

  /**
     * Gets the timestamp for when the metrics were last emitted
     */
  get lastEmit() {
    return this._lastEmit;
  }

  /**
     * Constructor for MetricsEmitter
     * @param {number} batchDelay The number of millisencons to wait before sending the metrics data. If set to null or less than 1, then metrics will be emitted individually.
     * @param {bool} autoStart If true, then the emitter autimatically starts emitting mmetrics after the batch delay.
     * @param {CloudWatch} cloudWatch The CloudWatch export of the aws-sdk module. Automatically created if not defined. Mainly used for unit tests.
     * @param {Logger} logger The winston logger.
     */
  constructor(batchDelay, autoStart, cloudWatch, logger) {
    const self = this;
    self._buffer = new AwsMetricsBuffer();
    self._lastEmit = null;
    self.batchDelay = batchDelay || 60000;
    self.cloudWatch = cloudWatch || new AWS.CloudWatch({ apiVersion: '2010-08-01' });
    self.enabled = false;
    self.logger = logger;
    if (autoStart) {
      self.start();
    }
  }

  /**
     * Starts emitting metrics after the delay period.
     */
  start() {
    const self = this;
    self.logger.debug('Starting emitter.');
    self.enabled = true;
    AwsMetricsEmitter.flushBuffer(self);
  }

  /**
     * Stops emitting metrics immediately after this call, even if the batch delay has not been reached.
     */
  stop() {
    const self = this;
    self.logger.debug('Stopping emitter.');
    self.enabled = false;
  }

  /**
     * Flushes the buffer of all metrics and sets a timer based on the batchDelay
     * @param {AwsMetricsEmitter} awsMetricsEmitter The aws metrics emitter that called the flush. Needed as self is not always the class the method belongs to.
     */
  static flushBuffer(awsMetricsEmitter) {
    // Note: self is not always the class, but the calling timeout. Not safe to use self.
    awsMetricsEmitter.logger.debug('Flushing buffer.');
    if (awsMetricsEmitter.enabled) {
      awsMetricsEmitter.logger.debug('Emitter: ENABLED.');
      awsMetricsEmitter.emitBuffer().then(() => {
        awsMetricsEmitter.logger.debug(`Restarting delay timer of ${awsMetricsEmitter.batchDelay} for flush.`);
        setTimeout(AwsMetricsEmitter.flushBuffer,
          awsMetricsEmitter.batchDelay, awsMetricsEmitter);
      });
    } else {
      awsMetricsEmitter.logger.verbose('Emitter DISABLED when flushing buffer.', awsMetricsEmitter.buffer);
      awsMetricsEmitter.logger.debug(`Restarting delay timer of ${awsMetricsEmitter.batchDelay} for flush after detecting emitter DISABLED.`);
      setTimeout(AwsMetricsEmitter.flushBuffer,
        awsMetricsEmitter.batchDelay, awsMetricsEmitter);
    }
  }

  /**
     * Emits all metrics.
     */
  emitBuffer() {
    const self = this;
    self.logger.debug('Emitting metrics.');
    return new Promise((resolve) => {
      const namespaceMetricCollections = Object.values(self.buffer.buffer);
      self.logger.debug(`Namespaces Count: ${namespaceMetricCollections.length}`);
      const flushPromises = [];
      namespaceMetricCollections.forEach((namespaceMerticCollection) => {
        self.logger.debug(`Namespace Metric Collections Count: ${namespaceMerticCollection.length}`);
        const emitPromises = namespaceMerticCollection.map(
          namespaceMetrics => self.emitNamespaceMetrics(namespaceMetrics),
        );
        flushPromises.push(emitPromises);
      });
      if (flushPromises.length < 1) {
        self.logger.verbose('Metrics buffer emitted when no metrics withn the buffer');
        resolve();
      } else {
        self.logger.debug(`Number of metrics to put to CloudWatch: ${flushPromises.length}`);
        Promise.all(flushPromises).then(() => {
          self.logger.debug('All metrics with buffer emitted to CloudWatch.');
          self._lastEmit = Date.now();
          self.buffer.clearBuffer();
          resolve();
        });
      }
    });
  }

  /**
     * Emits a set of metrics for a specific namespace.
     * @param {object} metrics Metrics belonging to a single namespace.
     */
  emitNamespaceMetrics(namespaceMetrics) {
    const self = this;
    return new Promise((resolve) => {
      self.cloudWatch.putMetricData(namespaceMetrics, (err, data) => {
        if (err) {
          self.logger.error(`Error emitting metrics ${err}`, err.stack);
          // always resolves so that promise.all does not fast fail and it tries to log all metrics in batch.
          resolve();
        } else {
          self.logger.debug('Metrics Emitted Successfully.', data);
          resolve();
        }
      });
    });
  }
}

module.exports = AwsMetricsEmitter;
