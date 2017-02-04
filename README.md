# AlexaTivoMQTT
A skill to voice control your TiVo DVRs through Alexa-enabled devices like the Amazon Echo or Dot.

- - -
## Overview

This is based on JRadwan's alexa_tivo_control. However, that implentation relies on a local node server to provide a web service that the Alexa skill can POST to.  I didn't want to have a local web server for a number of reasons.

Instead, my architecture uses only local clients in my network.  To do this, it relys on the Alexa skill to invoke a lambda function.  This lambda function will the post a message containing the tivo commands to Amazon's IoT MQTT broker.

Locally I have a small node client running on a very cheap IoT board that subscribes to the MQTT topic.  When it gets notified of a post, it then sends it to the tivo.  A little longer pipeline, but this avoids having a local server.

The board I'm currently using is a "NEXT THING CHIP" $9 board, although an "Onion Omega" or "Particle Electron" (wth some changes) would probably work also.  I haven't tried it yet, but I think the board can be powered from the Tivo Bolt's USB ports.

- - -
## Requirements

* [Node.js](https://nodejs.org/en/blog/release/v0.10.36/)
* [Alexa-App](https://github.com/matt-kruse/alexa-app)

- - -
## Installation Instructions

See the [wiki page](https://github.com/jradwan/alexa_tivo_control/wiki/Installation-Instructions).  This will tell you how to create the intents and sample utterances.  The Alexa-app-server isn't used in production.

- - -
## Contact

Keith Andress

- https://github.com/kmandress

- - -
## References

This project was forked from and inspired by https://github.com/jradwan/alexa_tivo_control which in turn was derived from https://github.com/grgisme/alexa_tivo_control

[Hosting a Custom Skill as a Web Service](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-web-service) (Amazon)

[Step-by-Step Guide to Build a Fact Skill](https://developer.amazon.com/public/community/post/Tx3DVGG0K0TPUGQ/New-Alexa-Skills-Kit-Template:-Step-by-Step-Guide-to-Build-a-Fact-Skill) (Amazon)

[Developing Alexa Skills Locally with Node.js: Setting Up Your Local Environment](https://www.bignerdranch.com/blog/developing-alexa-skills-locally-with-nodejs-setting-up-your-local-environment/) (Big Nerd Ranch)

[Tivo Network Remote Documentation](http://www.tivo.com/assets/images/abouttivo/resources/downloads/brochures/TiVo_TCP_Network_Remote_Control_Protocol.pdf) (TiVo)
