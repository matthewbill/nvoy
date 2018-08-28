/**
 * @file aws-metrics-buffer.js
 * @copyright Matthew Bill
 */
const AwsMetricDatum = require('./aws-metric-datum.js');

class AwsMetricsBuffer {
  /**
     * Constructor for AwsMetricsBuffer.
     * @param {Logger} logger The winston logger.
     */
  constructor(logger) {
    const self = this;
    self.logger = logger;
    self.buffer = {};
  }

  /**
     * Clears the buffer of all metrics.
     */
  clearBuffer() {
    const self = this;
    self.buffer = {};
  }

  /**
     * Adds a collection of metrics for a specific namespace.
     * If the collection already exists, then it is ignored.
     * @param {string} namespace The namespace which the collection of metrics belongs to.
     */
  addNamespaceMetricsCollection(namespace) {
    const self = this;
    if (self.buffer[namespace] === undefined) {
      self.buffer[namespace] = [];
    }
  }

  /**
     * Adds a collection of metric datums to the buffer under the specified namespace.
     * @param {string} namespace The namespace that the metrics should belong to.
     */
  addNamespaceMetrics(namespace) {
    const self = this;
    const namespaceMetrics = {
      MetricData: [],
      Namespace: namespace,
    };
    if (self.buffer[namespace] === undefined) {
      self.addNamespaceMetricsCollection(namespace);
    }
    self.buffer[namespace].push(namespaceMetrics);
    return namespaceMetrics;
  }

  /**
     * Adds a metric datum to the buffer, aggregating it if possible.
     * @param {string} namespace The namespace for the metrics.
     * @param {string} metricName The name of the metric.
     * @param {json} dimensions The dimensions for the metric.
     * @param {string} unit The unit for the metric.
     * @param {string} value The value for the metric.
     * @param {bool} aggregate If set to true, then the metric datum values will be aggregated.
     * If there is already a matching metric datum with the same dimensions and namespace.
     */
  addMetricDatum(namespace, metricName, dimensions, unit, value, aggregate) {
    const self = this;
    if (aggregate) {
      const metricDatum = self.findMetricDatum(namespace,
        metricName, dimensions);
      if (metricDatum === null) {
        self.addNewMetricDatum(namespace, metricName, dimensions, unit, value);
      } else {
        AwsMetricsBuffer.aggregateMetricDatum(metricDatum, value);
      }
    } else {
      self.addNewMetricDatum(namespace, metricName, dimensions, unit, value);
    }
  }

  /**
     * Adds a new metric datum to the buffer.
     * This is done even if a matching one already exists within the buffer.
     * @param {string} namespace The namespace for the metrics.
     * @param {string} metricName The name of the metric.
     * @param {json} dimensions The dimensions for the metric.
     * @param {string} unit The unit for the metric.
     * @param {string} value The value for the metric.
     */
  addNewMetricDatum(namespace, metricName, dimensions, unit, value) {
    const self = this;

    if (self.buffer[namespace] === undefined) {
      self.addNamespaceMetricsCollection(namespace);
    }
    let namespaceMetrics = null;
    const namespaceMetricsCollection = self.buffer[namespace];
    if (namespaceMetricsCollection.length === 0) {
      namespaceMetrics = self.addNamespaceMetrics(namespace);
    } else {
      const index = namespaceMetricsCollection.length - 1;
      namespaceMetrics = namespaceMetricsCollection[index];
      if (namespaceMetrics.MetricData.length === 20) {
        // Add new metrics namespace as aws limit reached.
        namespaceMetrics = self.addNamespaceMetrics(namespace);
      }
    }
    const metricDatum = new AwsMetricDatum(metricName, dimensions, unit, value);
    namespaceMetrics.MetricData.push(metricDatum);
  }

  /**
     * Finds a metric datum with the specified dimensions and namespace within the buffer.
     * Null is returend if no metric datum exists with the specified crieria.
     * @param {string} namespace The namespace that the metric datum belongs to.
     * @param {string} metricName The name of the metric.
     * @param {*} dimensions The dimensions of the mertic.
     */
  findMetricDatum(namespace, metricName, dimensions) {
    const self = this;
    let metricDatum = null;
    if (self.buffer[namespace] === undefined) {
      return metricDatum;
    }
    self.buffer[namespace].forEach((namespaceMetrics) => {
      namespaceMetrics.MetricData.forEach((metricsDatum) => {
        if (metricsDatum.MetricName === metricName
            && AwsMetricsBuffer.dimensionsAreEqual(metricsDatum.Dimensions,
              dimensions)) {
          metricDatum = metricsDatum;
        }
      });
    });
    return metricDatum;
  }

  /**
     * Aggregates the value to the statistic set of the metric datum passed in. If there is currently not a statistic set, then one is created.
     * @param {AwsMetricDatum} metricDatum The metric datum.
     * @param {string} value The value to aggregate the metric datum by.
     */
  static aggregateMetricDatum(metricDatum, value) {
    const aggregatedMetricDatum = metricDatum;
    if (aggregatedMetricDatum.StatisticValues !== undefined) {
      if (aggregatedMetricDatum.StatisticValues.Maximum < value) {
        aggregatedMetricDatum.StatisticValues.Maximum = value;
      }
      if (aggregatedMetricDatum.StatisticValues.Minimum > value) {
        aggregatedMetricDatum.StatisticValues.Minimum = value;
      }
      aggregatedMetricDatum.StatisticValues.SampleCount += 1;
      aggregatedMetricDatum.StatisticValues.Sum += value;
    } else {
      aggregatedMetricDatum.StatisticValues = {
        Maximum: value,
        Minimum: value,
        SampleCount: 2,
        Sum: value + aggregatedMetricDatum.Value,
      };
      // Remove value as statisticValues now used instead.
      delete aggregatedMetricDatum.Value;
    }
  }

  /**
     * Compares two dimensions objects to see if they are equivilant to each other.
     * @param {*} a
     * @param {*} b
     */
  static dimensionsAreEqual(a, b) {
    if ((a === null || a === undefined) && (b === null || b === undefined)) {
      return true;
    }
    const aString = JSON.stringify(a);
    const bString = JSON.stringify(b);
    return aString === bString;
  }
}

module.exports = AwsMetricsBuffer;
