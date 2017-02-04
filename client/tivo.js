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

//node.js deps

//npm deps
var AWSIoT = require('aws-iot-device-sdk');

//app deps
var AWSMQTT = require('./awsiotmqtt.js');
var tivosocket = require('./tivosocket');
var config = require('./awsmqtt-config.json');

//code.stephenmorley.org
function Queue(){var a=[],b=0;this.contents=function(){ return {b: b, a: a}};this.getLength=function(){return a.length-b};this.isEmpty=function(){return 0==a.length};this.enqueue=function(b){a.push(b)};this.dequeue=function(){if(0!=a.length){var c=a[b];2*++b>=a.length&&(a=a.slice(b),b=0);return c}};this.peek=function(){return 0<a.length?a[b]:void 0}};

var q = new Queue();
var lastTime = Date.now();
var currentDelay = 0;   // we can send the 1st command immediately
var lastUID = 0;        // we know the 1st message isn't a duplicate

AWSMQTT.initialize('0');
tivosocket.initialize();

//console.log(config.topic + '/' + config.account);
AWSMQTT.subscribe(config.alexaAppId.toString());

// todo: placeholder for sending a command to the tivo
function sendCommand(payload)
{
   var payloadObject = JSON.parse(payload);
   currentDelay = payloadObject.delay;
   console.log('command: ', payloadObject.command.toString(), '(', currentDelay, 'ms delay )');
   tivosocket.write(payloadObject.command.toString()+'\r');
   lastTime = Date.now();
}

// send the command at the front of the queue
// if the queue has remaining elements, set a timer to send new one at the front of the queue
function sendCommandFromQueue() {
   if (q.getLength() >= 1) {
      var qElement = q.dequeue();
      sendCommand(qElement);

      if (q.getLength() > 0) {
         setTimeout(function() {
            sendCommandFromQueue();
         }, currentDelay);
      }
   } else {
      console.log("error in queue length", q.getLength());
   }
}

function ThrottledSendCommand(payload) {
   // console.log(payload);
   // add the new item to the queue
   payload.forEach (function(val) {
      q.enqueue(val);
      console.log(JSON.stringify(val));
   });

   if (q.getLength() >= 1) {
      sendCommandFromQueue();
   }
}

AWSMQTT.device().on('message', function(topic, payload) {
   // console.log('pulled from mqtt server: ', topic, payload.toString());
   var data = JSON.parse(payload);
   if (data.UID != lastUID) {
      lastUID = data.UID;
      ThrottledSendCommand(data.commands);
   }
});

