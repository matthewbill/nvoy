/**
 * @file aws-metric-datum.js
 * @copyright Matthew Bill
 */
/**
 * Class representing a metrics datum inside of AWS cloudwatch.
 */
class AwsMetricDatum {
  constructor(metricName, dimensions, unit, value) {
    const self = this;

    self.MetricName = metricName;
    self.Unit = unit;
    self.Value = value;

    if (dimensions !== null) {
      self.Dimensions = dimensions;
    }
  }
}
module.exports = AwsMetricDatum;
