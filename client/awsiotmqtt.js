/*
 * Copyright 2010-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

//"use strict";

//node.js deps

//npm deps

//app deps
var AWSIoT = require('aws-iot-device-sdk');
var config = require('./awsmqtt-config.json');

var awsmqtt = {};
var device = undefined;

//begin module

awsmqtt.initialize = function(clientID) {
   console.log("initializing");
   //
   // The device module exports an MQTT instance, which will attempt
   // to connect to the AWS IoT endpoint configured in the arguments.
   // Once connected, it will emit events which our application can
   // handle.
   //
   device = AWSIoT.device({
      keyPath: config.keyPath,
      certPath: config.certPath,
      caPath: config.caPath,
      region: config.region,
      clientID: clientID
   });

   device.on('connect', function() {
      console.log('mqtt connect');
   });
   device.on('close', function() {
      console.log('mqtt close');
   });
   device.on('reconnect', function() {
      console.log('mqtt reconnect');
   });
   device.on('offline', function() {
      console.log('mqtt offline');
   });
   device.on('error', function(error) {
      console.log('mqtt error', error);
   });
   // device.on('message', function(topic, payload) {
   //    console.log('message', topic, payload.toString());
   // });
   return device;
}

awsmqtt.device = function() {
   return device;
}

awsmqtt.publish = function(topic, payload) {
   if (typeof payload == "string") {
      console.log("mqtt posting to: ", topic, payload);
      device.publish(topic, payload);
   } else {
      console.log("mqtt posting to: ", topic, JSON.stringify(payload));
      device.publish(topic, JSON.stringify(payload));
   }
   return device;
}

awsmqtt.subscribe = function(topic) {
   console.log("subscribing: ", topic);
   device.subscribe(topic);
   return device;
}

module.exports = awsmqtt;
