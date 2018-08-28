#!/usr/bin/env node

const winston = require('winston');

const ServiceMetricsEmitter = require('../src/service-metrics/service-metrics-emitter.js');
const ServiceMetricsEmitterTestDataGenerator = require('../data-generator/service-metrics/service-metrics-data-generator.js');

const emitterBatchDelay = process.env.EMITTER_BATCH_DELAY;
const org = process.env.ORG;
const environment = process.env.NODE_ENV;
const generationDelay = emitterBatchDelay / 2;

const logger = winston.createLogger();

/** Create Server Metrics Emitter */
const serviceMetricsEmitter = new ServiceMetricsEmitter(
  emitterBatchDelay,
  true,
  org,
  environment,
  null,
  logger,
);
logger.info(`ServiceMetricsEmitter created with batchDelay of ${emitterBatchDelay}.`);

/** Create Test Data Generator */
const dataGenerator = new ServiceMetricsEmitterTestDataGenerator(logger);
logger.info(`AwsMetricsBufferTestDataGenerator created with generationDelay of ${generationDelay}.`);

function addData() {
  logger.info('Adding test data to service metrics emitter buffer.');
  dataGenerator.addData(serviceMetricsEmitter);
  logger.info(`Finished adding test data. Delaying generation of data by ${generationDelay}`);
  setTimeout(addData, generationDelay, serviceMetricsEmitter);
}

setTimeout(addData, generationDelay);
