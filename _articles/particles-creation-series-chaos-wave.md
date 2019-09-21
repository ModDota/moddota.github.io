---
title: Particles Creation Series - Chaos Wave
author: kritth
steamId: 76561198055627364
date: 05.02.2015
category: general
---

<h2>Table of content</h2>
- <a href="#intro">Introduction</a><br>
- <a href="#wave">Part one: Wave Particle</a><br>
- <a href="#static">Part two: Spark Particle</a><br>
- <a href="#ground">Part three: Ground Particle (Optional)</a><br>
- <a href="#final">Part four: Finalize the system</a>
- <a href="#lua">Part five: Implement in-game</a>

<a name="intro"></a><h1>Introduction</h1>
<p>
This is taken from the project I'm currently working on. The basic idea behind this particle system was that this projectile is a cyclone/tornado in xy-axis travel forward with certain amount of velocity. If you don't have any basic in particle editor, please go to <a href="/articles/particles-creation-series-particle-basics">this link</a> first. Before you read further, here is the finished product.
</p>
<img src="http://i.imgur.com/fwxoB5H.png"></img>
<p>
Don't worry too much about the statue model, I put it there just to check height reference before porting into the map itself. There are many ways to approach this but here is how I approach it.
</p>
~~~lua
Wave
- Render sprites
- Lifespan decay
- Movement basic
- Remap control point to velocity (CP1)
- Rotation orient to 2d direction (Roll)
- Rotation from CP forward orientation (Yaw)
- Radius scale
- Ramp scale linear simple (Yaw)
- Ramp scale linear simple (Radius)
- Noise vector
- Alpha fade out simple
- Alpha fade in simple
- Position within sphere random
- Color random
- Sequence random
- Rotation random
- Remap control point to scalar (Radius, CP2)
- Position modify offset random
- Remap control point to scalar (Life Duration, CP3)
Electric charge
- Render sprites
- Movement basic
- Radius scale
- Lifespan Decay
- Alpha fade and decay
- Lifetime random
- Color random
- Rotation random
- Sequence random
- Position from parent particles
- Remap control point to scalar (Radius, CP2)
- Alpha random
- Position modify offset random
- Emit continuously
Ground (optional)
- Render sprites
- Remap control point to velocity (CP1)
- Lifespan decay
- Movement basic
- Radius scale
- Alpha fade and decay
- Movement place on ground
- Position within sphere random
- Color random
- Remap control point to scalar (Life Duration, CP3)
- Remap control point to scalar (Radius, CP2)
- Alpha random
- Emit continuously
~~~
<a name="wave"></a><h1>Part one: Wave particle</h1>
<p>
Now let's start making this particle system.
</p>
- Open particle editor and create new Particle.<br>
- Add <b>"Render sprites"</b> in Renderer.<br>
- Add <b>"Emit continuously"</b> in Emitter.<br>
- Add <b>"Lifespan Decay"</b> in Operator.
<p>
Now don't worry too much about particle count yet. That can be adjusted later before you actually finish this particle system. Let's change the value of Render sprites to:
</p>
<h4>Render sprites</h4>

|Field|Value|
|-----|-----|
|texture|materials/particle/juggernaut/juggernaut_blade_fury.vtex|
|orientation type|World-Z align|

<p>
Since that texture is a sequence texture, I want to alternate the use of each sequence. This can be done by the following:
</p>
- Add <b>"Sequence random"</b> in Initializer.
<p>
Now let's adjust the sequence we want. Since it's a cyclone/tornado with space in the middle, we might want something similar to sequence #3 to #6. So we change the following values:
</p>
<h4>Sequence random</h4>

|Field|Value|
|-----|-----|
|sequence min|3|
|sequence max|6|

<p>
Now it's time to place this particle somewhere.
</p>
- Add <b>"Position within sphere random"</b> in Initializer.
<p>
We don't need to change anything here since it's just reference point for emitter. Now your particle should look like this.
</p>
<img src="http://i.imgur.com/qa2KLoV.png"></img>
<p>
Well it shouldn't keep lying on the floor like that. Now we want to rotate it to the direction that it should face. But before we get to that, we have to set up something first.
</p>
- Add <b>"Movement basic"</b> in Initializer.<br>
- Add <b>"Remap control point to velocity"</b> in Initializer. (Default control point will be 1)
<p>
I will leave these two functions as default since I don't need anything special about velocity in this system. Now if we adjust the Control Point #1 on the right hand side, you can freely adjust the velocity as if it is a control point in-game, so you can see result immediately. My particle now moves but it faces upward, and I don't want that. Let's rotate our particle with following functions.
</p>
- Add <b>"Rotation orient to 2d direction"</b> in Operator.<br>
- Add <b>"Rotation from CP forward orientation"</b> in Operator.
<p>
With following values:
</p>
<h4>Rotation orient to 2d direction</h4>

|Field|Value|
|-----|-----|
|rotation offset|90.0|
|rotation field|Roll|

<h4>Rotation from CP forward orientation</h4>

|Field|Value|
|-----|-----|
|control point number|1|
|rotation field|Yaw|
|rotation offset|45.0|

<p>
These two functions will automatically adjust your sprite so it faces the direction it's moving all the time. I chose not to use 90.0 in second function because at 90 degree, your particle will be very hard to see from the top, so I adjust them down a bit. Now you should see result like this.
</p>
<img src="http://i.imgur.com/RBJadLc.png"></img>
<p>
Now basic functionality is done, I will adjust the outlook of the particle by following function.
</p>
- Add <b>"Color random"</b> in Initializer.<br>
- Add <b>"Rotation random"</b> in Initializer.<br>
- Add <b>"Position modify offset random"</b> in Initializer.
<p>
Now change the color to the color you like, leave the rotation random as is, and adjust third function as follow:
</p>
<h4>Position modify offset random</h4>

|Field|Value|
|-----|-----|
|offset min|0.0 0.0 100.0|
|offset max|0.0 0.0 100.0|

<p>
This is so that our particles will start in the air instead of on the ground. You can pull reference model up to adjust the height as you like.
</p>
<p>
Now that is done, we will start assigning the rest of the control points as followed:
</p>
- Add "Remap control point to scalar" in Initializer.<br>
- Add "Remap control point to scalar" in Initializer. (Yes twice)
<p>
And adjust the value to the following.
</p>
<h4>Remap control point to scalar #1</h4>

|Field|Value|
|-----|-----|
|input control point number|2|
|output field|Radius|
|input minimum|0.0|
|input maximum|9999.0|
|output minimum|0.0|
|output maximum|9999.0|

<h4>Remap control point to scalar #2</h4>

|Field|Value|
|-----|-----|
|input control point number|3|
|output field|Life Duration|
|input minimum|0.0|
|input maximum|10.0|
|output minimum|0.0|
|output maximum|10.0|

<p>
Now put these values into the control points on right.
</p>

|Field|Value|
|-----|-----|
|Control Point #1|1000 0 0|
|Control Point #2|300 0 0|
|Control Point #3|3 0 0|

<p>
You should see something like this.
</p>
<img src="http://i.imgur.com/AZNq6lw.png"></img>
<p>
Now those are all the initializers you need, let's now adjust the detail while our particles are traveling in operator.
</p>
<p>
Since I feel like the tornado should grow larger as it goes and there should be fade in and out effect, I add the following functions to the system.
</p>
- Add <b>"Radius scale"</b> in Operator.<br>
- Add <b>"Alpha fade out simple"</b> in Operator.<br>
- Add <b>"Alpha fade in simple"</b> in Operator.
<p>
Adjust these values as you like. I left them as default except one which is:
</p>
<h4>Radius scale</h4>

|Field|Value|
|-----|-----|
|radius start scale|0.0|

<p>
Now your particle should look like this. (I just adjust the color random, so it will look a bit different from previous image.)
</p>
<img src="http://i.imgur.com/X50ysJh.png"></img>
<p>
Since it is kinda power wave, I want to add the feeling of being unstable to the system. So I add these functions.
</p>
- Add <b>"Ramp scalar linear simple"</b> in Operator.<br>
- Add <b>"Ramp scalar linear simple"</b> in Operator. (Yes twice)<br>
- Add <b>"Noise vector"</b> in Operator.
<p>
Adjust its value to the following:
</p>
<h4>Ramp scalar linear simple #1</h4>

|Field|Value|
|-----|-----|
|ramp rate|15.0|
|ramp field|Yaw|

<h4>Ramp scalar linear simple #2</h4>

|Field|Value|
|-----|-----|
|ramp rate|2500|
|end time|9999.0|
|ramp field|Radius|

<h4>Noise vector</h4>

|Field|Value|
|-----|-----|
|output field|Position|
|output minimum|-100.0 -100.0 -100.0|
|output maximum|100.0 100.0 100.0|
|additive|true|

<p>
Now your wave particle is done. It should look similar to the following:
</p>
<img src="http://i.imgur.com/Oh5BbNQ.png"></img>
<p>
What I said about "done" is actually a lie. You still need to adjust your particle count. My advice is that keep the count at minimum to suit the purpose of your system. Currently, the particle count should be at around 300 all the time and it's not good for overall performance. Since my particles will be used somewhat as a projectile, I don't want high particle counts. To reduce this I change the following setting.
</p>
<h4>Base Properties</h4>

|Field|Value|
|-----|-----|
|max particles|60|

<h4>Emit continuously</h4>

|Field|Value|
|-----|-----|
|emission duration|2.0|
|emission rate|30.0|

<p>
With this, the particle count should be below 60 at all time since I want them to emit only for 2 seconds, 30 particles each, and the memory allocated is only enough for 60 particles. Now your base wave particles are done.
<b>Very important, don't forget to save.</b>
</p>

<a name="static"></a><h1>Part two: Spark Particle</h1>
<p>
Now that I have my wave particle working, I feel like it needs something like an electric spark during the duration. However, since this particle is based on the wave particle, we need to make some adjustments to the wave particle.
</p>
- Create new particle for static and save it.<br>
- In wave particle, add newly created particle as a children.
<p>
First off as usual, you want to start rendering your sprite and emitter and decay.
</p>
- Add <b>"Render sprites"</b> in Renderer.<br>
- Add <b>"Emit continuously"</b> in Emitter.<br>
- Add <b>"Lifespan decay"</b> in Operator.
<p>
Change your render sprites' texture to,
</p>
~~~
materials/particle/electrical_arc_smooth/electrical_arc_smooth.vtex
~~~
<p>
Now think about the actual electric spark, it needs to be fast, colorful, looks different all the time, and a little bit of transparency. From those idea, I add following functions.
</p>
- Add <b>"Lifetime random"</b> in Initializer.<br>
- Add <b>"Color random"</b> in Initializer.<br>
- Add <b>"Rotation random"</b> in Initializer.<br>
- Add <b>"Sequence random"</b> in Initializer.<br>
- Add <b>"Alpha random"</b> in Initializer.
<p>
Adjust the color accordingly for Color random, and leave Rotation random as default. For other functions, change the value to following.
</p>
<h4>Lifetime random</h4>

|Field|Value|
|-----|-----|
|lifetime min|0.03|
|lifetime max|0.07|

<h4>Sequence random</h4>

|Field|Value|
|-----|-----|
|sequence min|0|
|sequence max|3|

<h4>Alpha random</h4>

|Field|Value|
|-----|-----|
|alpha min|150|
|alpha max|175|

<p>
Now you should have something similar to this.
</p>
<img src="http://i.imgur.com/cG34Wwj.png"></img>
<p>
When that's done, we want to change our radius accordingly as we already had control point in wave particles and make the spark scatter from the center.
</p>
- Add <b>"Remap control point to scalar"</b> in Initializer.<br>
- Add <b>"Position modify offset random"</b> in Initializer.
<p>
Now we adjust the value to the following:
</p>
<h4>Remap control point to scalar</h4>

|Field|Value|
|-----|-----|
|input control point number|2|
|output field|Radius|
|input maximum|999.0|
|output maximum|999.0|

<h4>Position modify offset random</h4>

|Field|Value|
|-----|-----|
|offset min|-0.3 -0.3 -0.3|
|offset max|0.3 0.3 0.3|
|control point number|0|
|offset proportional to radius|true|

<img src="http://i.imgur.com/TPtr49u.png"></img>
<p>
As you can see, now our particles are huge! Sparks are supposed to be small so let's resize it with this, add a little bit more movement to our sparks, and also add some fade decay to our particle.
</p>
- Add <b>"Movement basic"</b> in Operator.<br>
- Add <b>"Radius Scale"</b> in Operator.<br>
- Add <b>"Alpha fade and decay"</b> in Operator.
<p>
Adjust the values to the following.
</p>
<h4>Movement basic</h4>

|Field|Value|
|-----|-----|
|gravity|0.0 0.0 300.0|
|drag|0.05|

<h4>Radius scale</h4>

|Field|Value|
|-----|-----|
|radius start scale|0.07|
|radius end scale|0.14|
|scale bias|0.65|

<h4>Alpha fade and decay</h4>

|Field|Value|
|-----|-----|
|start fade in time|0.0|
|end fade in time|0.2|
|start fade out time|0.4|
|end fade out time|1.0|
|start alpha|0.0|
|end alpha|0.0|

<p>
Now your spark should look something like this.
</p>
<img src="http://i.imgur.com/qwqaa5l.png"></img>
<p>
With the wave particles, it looks like this.
</p>
<img src="http://i.imgur.com/2QciUbK.png"></img>
<p>
Now we want the spark to follow the wave, we add this function to the spark particle.
</p>
- Add <b>"Position from parent particles"</b> in Initializer.
<p>
Leave the value as default, you can adjust it to your taste though. Now we are almost done, we have to reduce particle count in the system. Change the values of the following function.
</p>
<h4>Base Properties</h4>

|Field|Value|
|-----|-----|
|max particles|64|

<h4>Emit continuously</h4>

|Field|Value|
|-----|-----|
|emission duration|4.0|
|emission rate|200.0|

<p>
Now that's done, you should see something like the following in your wave particle.
</p>
<img src="http://i.imgur.com/ERIr5ld.png"></img>
<p>
With this, your spark particle is done. Feel free to adjust the value to your taste.
</p>
<a name="ground"></a><h1>Part three: Ground Particle (Optional)</h1>
<p>
You may wonder why I list this part as optional. It is not a requirement since it doesn't really make you see what's happening in the particle editor. When you head into the game, if the place has light color background, it will become very hard to see bright color particle. With this ground particle, I basically layout the dark particle under the wave particle to make it more visible to the user.
</p>
<p>
This particle borrows most of the value from wave particle except one function. I will list all of the functions and its adjusted value below. For more detail on each of the functions, please go back to read in wave particle section.
</p>
<h4>Base Properties</h4>

|Field|Value|
|-----|-----|
|max particles|60.0|

<h4>Renderer: Render Sprites</h4>

|Field|Value|
|-----|-----|
|orientation type|World-Z Align|
|texture|materials/particle/dirt/ground_decay/ground_decay01.vtex|

<h4>Operator: Remap control point to velocity</h4>
<h4>Operator: Lifespan decay</h4>
<h4>Operator: Movement basic</h4>
<h4>Operator: Radius Scale</h4>

|Field|Value|
|-----|-----|
|radius start scale|0.2|
|radius end scale|1.2|

<h4>Operator: Alpha fade and decay</h4>
<h4>Operator: Movement place on ground</h4>
<h4>Initializer: Position within sphere random</h4>
<h4>Initializer: Color random</h4>
<h4>Initializer: Remap control point to scalar</h4>

|Field|Value|
|-----|-----|
|input control point number|3|
|output field|Life Duration|
|input maximum|10.0|
|output maximum|10.0|

<h4>Initializer: Remap control point to scalar</h4>

|Field|Value|
|-----|-----|
|input control point number|2|
|output field|Radius|
|input maximum|9999.0|
|output maximum|9999.0|

<h4>Initializer: Alpha random</h4>

|Field|Value|
|-----|-----|
|alpha min|30|
|alpha max|50|

<h4>Initializer: Emit continuously</h4>

|Field|Value|
|-----|-----|
|emission duration|2.0|
|emission rate|30.0|

<p>
<b>Don't forget to save your file.</b> Now that's done, let's combine all the works together.
</p>
<a name="final"></a><h1>Part four: Finalize the system</h1>
<p>
Our system is almost finished. Now we are going to add multiple layer of wave.
</p>
- Open your wave particle.<br>
- Remove the children.<br>
- Save as a new particle for an outer layer (this should have no children).<br>
- Save as a new particle again for the outline (this should also have no children).
<p>
These three layer will behave the same, there are only three different between each layer.
</p>
1. Radius<br>
2. Color<br>
3. Sequence number
<p>
Let's set our 3 layers (or more if you want to) as following.
</p>
<p>
For the inner most layer, our core layer, adjust the color to become very bright, have <b>radius end scale</b> in <b>Radius scale</b> as 0.6, and <b>sequence min/max</b> set to 7 and 8.
</p>
<p>
For the outer layer, second layer, adjust the color to be between the very bright color and black, have <b>radius end scale</b> in <b>Radius scale</b> as 1.0, and <b>sequence min/max</b> set to 7 and 8.
</p>
<p>
For the outline layer, last layer, adjust the color to be black and have <b>radius end scale</b> in <b>Radius scale</b> as 1.2.
</p>
<p>
Now we combine the two outer layer into our core layer by adding children. Your screen should look like this.
</p>
<img src="http://i.imgur.com/ymA3yUU.png"></img>
<p>
If you don't have ground particle, you should be done at this point. However, if you have ground particle then:
</p>
- Create new particle.<br>
- Add ground particle as children.<br>
- Add wave particle as children.
<p>
It is important that ground particle is above wave particle. This is the order in which your particle will be rendered. If ground particle is below wave particle, it will be on top of wave particle and that's not how we want it.
</p>
<a name="lua"></a><h1>Implement in-game</h1>
<p>
Now that the particle is ready, we have to put it to use in game. Note that this particle is not fully compatible with projectile. Therefore, we mimic the projectile as following:
</p>
<h4>KV npc_abilities_custom.txt</h4>
<p>
In the ability you want to use, put these lines in.
</p>
~~~
"precache"
{
    "particle"		"particles/custom/tutorial/cyclone.vpcf"
}
~~~
<p>
Now when you want to launch particles in lua, you do the following
</p>
~~~lua
local info = {
    ...
    EffectName = "",
    vVelocity = keys.caster:GetForwardVector() * ProjectileSpeed,
    fDistance = Distance,
    fStartRadius = Radius,
    fEndRadius = Radius,
    ... 
}

local projectile = ProjectileManager:CreateLinearProjectile(info)

-- Create particle
local tornadoFxIndex = ParticleManager:CreateParticle( "particles/custom/tutorial/cyclone.vpcf", PATTACH_CUSTOMORIGIN, caster )
ParticleManager:SetParticleControl( tornadoFxIndex, 0, keys.caster:GetAbsOrigin() )
ParticleManager:SetParticleControl( tornadoFxIndex, 1, keys.caster:GetForwardVector() * ProjectileSpeed )
ParticleManager:SetParticleControl( tornadoFxIndex, 2, Vector( Radius, 0, 0 ) )
ParticleManager:SetParticleControl( tornadoFxIndex, 3, Vector( Distance / ProjectileSpeed, 0, 0 ) )
			
Timers:CreateTimer( 6.0, function()
        ParticleManager:DestroyParticle( tornadoFxIndex, false )
        ParticleManager:ReleaseParticleIndex( tornadoFxIndex )
        return nil
    end
)		
~~~
<p>
With those implemented, your particles should show up in-game now.
</p>
<p>
This concludes my tutorial on making Chaos Wave particles. If you have any comment, question, or improvement to the guide, please do not hesitate to leave a comment or contact me. Let me know what you want to see created next!
</p>