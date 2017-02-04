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
var config = require('./awsmqtt-config.json');
net = require('net');

//code.stephenmorley.org
function Queue(){var a=[],b=0;this.contents=function(){ return {b: b, a: a}};this.getLength=function(){return a.length-b};this.isEmpty=function(){return 0==a.length};this.enqueue=function(b){a.push(b)};this.dequeue=function(){if(0!=a.length){var c=a[b];2*++b>=a.length&&(a=a.slice(b),b=0);return c}};this.peek=function(){return 0<a.length?a[b]:void 0}};

var tivosocket = {};
var socket = undefined;
var connected = false;
var q = new Queue();

//begin module

tivosocket.initialize = function() {
   console.log("initializing socket");
   //
   // The device module exports an MQTT instance, which will attempt
   // to connect to the AWS IoT endpoint configured in the arguments.
   // Once connected, it will emit events which our application can
   // handle.
   //
   socket = new net.Socket({
      allowHalfOpen: false,
      readable: true,
      writable: true
   });

   socket.connect({
      port: config.tivoport,
      host: config.tivoip
   });

   socket.unref();

   socket.on('connect', function() {
      console.log('socket connect');
      connected = true;
      // if we've queued up data to write -- dump it out
      while (q.getLength() > 0) {
         socket.write(q.dequeue());
      }
   });
   socket.on('close', function() {
      console.log('socket close');
   });
   socket.on('error', function(error) {
      console.log('socket error', error);
   });
   socket.on('timeout', function() {
      console.log('socket timed out');
   });
   socket.on('data', function(data) {
      if (typeof(data) == "string")
         console.log('socket read:', data);
      else
         console.log('socket read:', data.toString());
   });
   return socket;
}

tivosocket.socket = function() {
   return socket;
}

tivosocket.write = function(data) {
   // if we need to wait for the socket to finish connecting - just pput the data in a queue
   if (socket.connecting) {
      console.log('socket queuing data:', data);
      q.enqueue(data);
   }

   if (connected) {
      socket.write(data);
   }
}

tivosocket.close = function() {
   socket.end();
}

module.exports = tivosocket;
