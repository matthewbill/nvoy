# Contributing #

nvoy is a new project and looking for people to contribute and help make it better.

# Credentials #

AWS_PROFILE is used in the scripts to specify what profile to use for aws. This profile can be setup using [AWS CLI tools](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).


# Scripts #

> WARNING: Running the test applications will use AWS resources and you may be charged.

| Name | Description |
| ---- | ----------- |
| lint | runs es lint |
| docs | generages documentation using jsdoc |
| test | runs the jest unit tests |
| int-test | runs the jest integration tests. | 

## Test Applications ##

| Name | Description |
| ---- | ----------- |
| service-metrics-emitter | runs the service metrics emitter test app |