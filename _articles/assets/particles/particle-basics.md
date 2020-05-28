---
title: Particle Basics
author: kritth
steamId: 76561198055627364
date: 05.02.2015
---

<p>
So I was asked by many people about particle creation and work flow since the tutorial provided by the steam (or someone that is put on the Valve developer site) seems to stop at one point. Since I can't do too much of complicated work today, I will write some tutorials to get people start diving into particles. I will write it in series of multiple tutorials by taking request from people and such since particles itself is kinda big topic. Just leave me a comment or send me a message what kind of particle system you want to see created manually. I will try my best to mimic the system and write it out step by step. Don't hesitate to contact me if you have any question, comment, or improvement to the tutorial.
</p>
<p>
Also noted that some particles system implementation might have Lua scripting involved if it is very complicated system. So a little of basic lua scripting will help you every now and then.
</p>
<h2>Table of Content</h2>
<p>In this thread</p>
- <a href="#particle_basics">Particle Basics</a><br />
- <a href="#first_particle">Creating your first particle</a>
<p>Example in separate threads</p>
- <a href="/articles/particles-creation-series-falling-cherry-blossom-petal-for-spring-mood">Example: Falling cherry blossom petal</a><br />
- <a href="/articles/particles-creation-series-chaos-wave">Example: Chaos Wave</a>
<p>
Again, let me know what kind of particle system you want to see created so I can keep this tutorial series going.
</p>
<p>
Here is the list of functions covered in this tutorial:
</p>
<h3>Renderer</h3>
- Render sprites [WIP]<br />
- Render models [WIP]<br />
- Render sprite trail [WIP]<br />
- Render rope [WIP]<br />
- Render deferred light [WIP]<br />
<h3>Operator</h3>
- Lifespan decay<br />
- Alpha fade and decay<br />
- Color fade<br />
- Movement basic<br />
- Radius Scale<br />
- Movement place on ground [WIP]<br />
- Noise Scalar/Vector [WIP]<br />
- Normalized Vector [WIP]<br />
- Oscillate Scalar/Vector [WIP]<br />
- Remap Control Point to Scalar/Vector/Velocity [WIP]<br />
- Rotation Basic [WIP]<br />
- Rotation orient relative to CP [WIP]<br />
- Rotation orient to 2d direction [WIP]<br />
- Rotation spin yaw/roll [WIP]<br />
- Inherit attribute from parent particle [WIP]<br />
<h3>Initializer</h3>
- Alpha random<br />
- Color random<br />
- Lifetime random<br />
- Radius random<br />
- Position along ring<br />
- Position within sphere random<br />
