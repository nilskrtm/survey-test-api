![Build](https://github.com/nilskrtm/survey-test-api/actions/workflows/push.yml/badge.svg)

# Survey Rest API

This repository is part of a hobby project for creating, managing, conducting and evaluating surveys.<br/>
The surveys can be managed in a WebApp and are carried out in the [(Android) app](https://github.com/nilskrtm/SurveyTestApp) on tablets, for example. There, a survey runs in a kiosk mode. This allows these devices to be displayed in service outlets, trade fairs or other locations, allowing you to gather customer satisfaction through a simple survey.<br/>
For the questions, there is no answer option in text form, but only through images, which should be selected to match the corresponding answer option.

The project also involves the following two repositories:

- [Survey Web](https://github.com/nilskrtm/survey-test-web)
- [Survey App](https://github.com/nilskrtm/SurveyTestApp)

> This whole project is still a _WIP_ and there are still some [improvements](#todos-and-improvements) I want to make but haven't had the time yet.

## Overview

<b>This module</b> represents the <b>backend</b> of the system in the form of a <b>Rest API</b>. Requests are received and processed by an <b>express</b> web server. A <b>MongoDB</b> is used as the backbone for data management.

## Configuration

There are some properties that have to be set to build and run the Rest API, like the configuration of the database connections and so on. For this, there is a set of environment variables that can be set. The best way is to just use a _.env_ file.

### List of Properties

<b>TODO</b> (or see .env.example [.env.example](https://github.com/nilskrtm/survey-test-api/blob/master/.env.example))

## Running the API

```bash
npm run start
```

Or use docker compose and compose files in directory _deployment/docker_ to run in docker and also start MongoDB instance.

## Todos and Improvements

- improve security of authentication
    - save JWTs in database and add possibility to invalidate them
    - in the current implementation refresh tokens are not really 'refresh tokens'
- add an email-service
    - useful for user-registration and password-reset (password-reset form and e-mail field in user-database is already implemented, but not really used yet)
    - maybe add a reminder for ending-surveys or broadcasting a summary of collected statistics about the users surveys at the end of each day
- ...
