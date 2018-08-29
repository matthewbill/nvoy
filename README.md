# nvoy #

![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg) 
[![GitHub issues](https://img.shields.io/github/issues/badges/shields.svg)](https://github.com/matthewbill/nvoy/issues)
 ![Travis (.org)](https://img.shields.io/travis/matthewbill/nvoy.svg)
![npm](https://img.shields.io/npm/v/nvoy.svg) ![npm](https://img.shields.io/npm/dt/nvoy.svg)

nvoy is a tool for batching up `AWS CloudWatch Metrics` and sending them to `AWS`. It runs in the background of any node app and emits the metrics after a configurable amount of time has passed. The benefits of this are:

* Reduces AWS costs by reducing the number of PUTs.
* Circumvents AWS limits on the number of metrics that can be sent per second. This is especially useful for high volume applications, which create large amount of metrics.
* Reduces network traffic and other resource needs of applications.

## Install ##

``` shell
npm install nvoy

```

or

``` shell
npm install novy --save

```

## Components ##

There are a number of components that make up nvoy. To get started, all you need is the AwsMetricsEmitter. There are also a number of supporting components that can save you a lot of time.

### Core ###

| Component         | Description                                                                           |
| ----------------- | ------------------------------------------------------------------------------------- |
| AwsMetricsEmitter | This is the main class to create an metrics emmitter and to add metrics to the buffer |
| AwsMetricsBuffer  | Child component of the emitter. Stores the metrics in before they are flused to AWS.  |

### Supporting ###

| Component             | Description                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------ |
| ServiceMetricsEmitter | Inhrerits from AwsMetricsEmitter and contains short cut methods for service based metrics. |
| WebMetricsEmitter | Inhrerits from AwsMetricsEmitter and contains short cut methods for web based metrics.         |

## AWS Credentials ##

You will need to configure your credentials through the aws cli or other means for the emitter to work.

## Logging ##

The aws-metrics-emitter constructor takes a winston logger or signature matchin equivilent for the purposes of logging.

## AWS Metrics Emmitter ##

### Prerequisites ###

The AWS Emitter requires a `winston` logger to be passed in.

``` js
const winston  = require('winston');
```

### Create AWS Emitter ###

When creating an aws emitter, there are a number options that need to be passed into the constructor. There is additionally an option to pass through a cloud watch object to help with testing; but for most cases you will want to pass in null.

Unlike the shortcut classes ServiceMetricsEmitter and WebMetricsEmitter, the namespace used for metrics must be fully specified when adding them.

``` js
const { AwsMetricsEmitter } = require('envoy');

// options
const batchDelay = 60000; // Metrics sent every 60 seconds
const autoStart = false;
const cloudWatch = aws.cloudWatch();
const logger = winston.createLogger();

// create emitter
const awsMetricsEmitter = new AwsMetricsEmitter(batchDelay, autoStart, null, logger);

// start emitter
awsMetricsEmitter.start(); // not needed if autoStart = true

```

### Add Metrics ###

> WARNING: There is a maximum size limit on the request of putting metrics. Be sure to make sure your aggregated metrics do not exceed this. Visit the [AWS CloudWatch limits page](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_limits.html) for more details.

``` js

const namespace = `MyOrg/Services/MyService`;
const dimensions = [
    { Name: 'Method', Value: method },
    { Name: 'Environment', Value: 'test' },
];

awsMetricsEmitter.buffer.addMetricDatum(namespace, metricName, dimensions, unit, value, true);

```

## Service Metrics Emitter ##

The Service Metrics emitter acts as a short cute for adding metrics to a REST based service, such as a microservice. It inherits from the AWS Metrics Emitter.

The namespace used for metrics is `{self.org}/Services/{appName}`.

### Prerequisites ###

These are the same as the AMS Metrics Emitter.

### Create Service Metrics Emitter ###

The Service Metrics Emitter is created in a very similar way to the AWS Metrics emitter, but also requires `org` and `environment` to be passed in.

``` js
const { ServiceMetricsEmitter } = require('envoy');

// options
const batchDelay = 60000; // Metrics sent every 60 seconds
const autoStart = false;
const org = 'MyOrg';
const environment = 'development';
const cloudWatch = aws.cloudWatch();
const logger = winston.createLogger();

// create emitter
const serviceMetricsEmitter = new AwsMetricsEmitter(batchDelay, autoStart, org, environment, null, logger);

// start emitter
awsMetricsEmitter.start(); // not needed if autoStart = true

```

### Add Metrics ###

The folowing example demonstrates the typical metrics you will want to add for every service call:

``` js

// options
const serviceName = 'MyService';

// Add one to the number of requests for the service as a whole.
serviceMetricsEmitter.addRequestCountMetric(serviceName);

// Add one to the number of GET requests to the service.
serviceMetricsEmitter.addServiceMethodCountMetric(serviceName, 'GET', 'Requests');

// Add one to the number for GET requests with an OK response.
serviceMetricsEmitter.addServiceMethodCountMetric(serviceName, 'GET', 'OkResponses');

// Meta data about the Request/Rsponse.
serviceMetricsEmitter.addServiceResponseTimeMetric(serviceName, 'GET', 34);
serviceMetricsEmitter.addServiceResponseSizeMetric(serviceName, 'GET', 10);

```

## Supporting Classes ##

There are a couple of internal classes, which are used by the Service Metrics Emitter. These have been exposed in case they are needed for testing or other purposes.

``` js

const { ServiceMetricNames, ServiceMetricMethods } = require('envoy');

ServiceMetricNames.GET() // returns 'GET'
ServiceMetricMethods.BAD_REQUEST_RESPONSES() // returns 'BadRequestResponses'

```

## Web Metrics Emitter ##

The Web Metrics Emitter is very similar to the Service Metrics Emitter, but is more aimed towards non REST service web applications. The main difference is the namespace used for metrics, which is  `{self.org}/Apps/{appName}`.

### Prerequisites ###

These are the same as the AMS Metrics Emitter.

## Create Web Metrics Emitter ##

The Web Metrics Emitter is created in the same way as the Service Metrics Emitter, but requires a slightly different object.

``` js
const { WebMetricsEmitter } = require('envoy');
```

### Add Metrics ###

The folowing example demonstrates the typical metrics you will want to add for every service call:

``` js

// options
const appName = 'MyWebApp';
const method = 'GET';

// Add one to the number of requests for the web app as a whole.
webMetricsEmitter.addWebRequestCountMetric(serviceName);

// Add one to the number of GET requests to the web app.
webMetricsEmitter.addWebMethodCountMetric(appName, 'GET', 'Requests');

// Add one to the number for GET requests with an OK response.
webMetricsEmitter.addWebMethodCountMetric(appName, 'GET', 'OkResponses');

// Meta data about the Request/Rsponse.
serviceMetricsEmitter.addResponseTimeMetric(appName, 'GET', 34);
serviceMetricsEmitter.addResponseSizeMetric(appName, 'GET', 10);

```

### Supporting Classes ###
The Web Metrics Emitter uses the same internal classes as the ServiceMetricsEmitter.

## Test Applications ##

> WARNING: Running the test applications will use AWS resources and you may be charged.

A number of test applications have been bundled into the package to allow for easy testing of metrics within AWS and to make sure you have set up your credentials correctly. These can be installed globally by running `-npm install -g`. The cli will work on windows, mac and linux.

| command                      | description                        |
| ---------------------------- | ---------------------------------- |
| nvoy-service-metrics-emitter | emmits test service metrics to AWS |

### NPX ###

You can also run the test applications without needing to download or install the package by using npx. For example: `npx nvoy nvoy-service-metrics-emitter`.

## Contributing ##

nvoy is a new project and looking for people to contribute and help make it better. Please see the document on [Contributing](CONTRIBUTING.md).

Please see also our [Code of Conduct](CODE_OF_CONDUCT.md).

## License ##

Copyright (c) Matthew Bill. All rights reserved.

Licensed under the MIT License.