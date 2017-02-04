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

"use strict";

//app deps
var AWS = require('aws-sdk');
var config = require('./awsmqtt-config.json');
var async = require('async');

var awsmqtt = {};
var iotdata = undefined;

var fullPayload;

//begin module

awsmqtt.initialize = function() {
   console.log("initializing: ", config.host);

   iotdata = new AWS.IotData({endpoint: config.host});
   // console.log("iotdata:", JSON.stringify(iotdata));
}

awsmqtt.publish = function(topic, payload) {
   var stringPayload;

   if (typeof payload == "string") {
      stringPayload = payload;
   } else {
      stringPayload = JSON.stringify(payload);
   }

   var fullPayload = 
      {
         topic: topic,
         payload: stringPayload,
         qos: 1
      };

   // var async_results;
   async.series([
      function(callback) {
         console.log("posting: ", JSON.stringify(fullPayload));
         iotdata.publish(fullPayload, function(err, data) {
            callback(null);
         });
      }
   ]);
}

module.exports = awsmqtt;
