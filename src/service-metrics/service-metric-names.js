/**
 * @file service-metric-names.js
 * @copyright Matthew Bill
 */
/**
 * Class representing static strings for service metric names.
 * @class ServiceMetricNames
 */
class ServiceMetricNames {
  static get REQUESTS() { return 'Requests'; }

  static get INTERNAL_SERVER_EXCEPTION_RESPONSES() { return 'InternalServerExceptionResponses'; }

  static get BAD_REQUEST_RESPONSES() { return 'BadRequestResponses'; }

  static get UNAUTHORIZED_RESPONSES() { return 'UnauthorizedResponses'; }

  static get NOT_FOUND_RESPONSES() { return 'NotFoundResponses'; }

  static get FORBIDDEN_RESPONSES() { return 'ForbiddenResponses'; }

  static get OK_RESPONSES() { return 'OkResponses'; }

  static get CREATED_RESPONSES() { return 'CreatedResponses'; }

  static get NO_CONTENT_RESPONSES() { return 'NoContentResponses'; }

  static get RESPONSE_TIME() { return 'ResponseTime'; }

  static get RESPONSE_SIZE() { return 'ResponseSize'; }
}

module.exports = ServiceMetricNames;
