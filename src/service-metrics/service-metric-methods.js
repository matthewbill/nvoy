/**
 * @file service-metric-methods.js
 * @copyright Matthew Bill
 */
/**
 * Class representing static strings for service metric methods.
 * @class ServiceMetricMethods
 */
class ServiceMetricMethods {
  /**
     * Method for getting a collection of resources
     */
  static get GET() { return 'GET'; }

  /**
     * Method for POST requests.
     */
  static get POST() { return 'POST'; }

  /**
     * Methods for PUT requests.
     */
  static get PUT() { return 'PUT'; }

  /**
     * Method for DELETE requests.
     */
  static get DELETE() { return 'DELETE'; }

  /**
     * Method for getting a singular item.
     */
  static get GET_ITEM() { return 'GET Item'; }

  /**
     * Method for getting a nestred resource of a singular item.
     */
  static get GET_ITEM_RESOURCE() { return 'GET Item Resource'; }
}

module.exports = ServiceMetricMethods;
