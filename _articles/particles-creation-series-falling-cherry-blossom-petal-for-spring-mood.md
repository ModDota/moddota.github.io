---
title: Particles Creation Series - Falling cherry blossom petal for spring mood
author: kritth
steamId: 76561198055627364
date: 05.02.2015
category: Assets
---

<p>
If you are new to particle creation, you should read <a href="/articles/particles-creation-series-particle-basics">this particle basic</a> first because I will not explain in detail these functions in detail. I will instead explain the thought process that comes in my mind during each creation. Now let's get started.
</p>
<p>
I was working on my map the other day in the following image.
</p>
<img src="http://i.imgur.com/chIqYgk.jpg"></img>
<p>
I feel like it lacks some kind of "spring" mood to it. So I feel like there should be petal falling down. Since it's pretty simple to do, I feel like I should include this as example in the tutorial. The end result will be like following image. You might not see much with static picture, but after you are finished, there will be those petals flying around in your map.
</p>
<img src="http://i.imgur.com/lIl4maG.jpg"></img>
<p>
If you know what to do, you can simply add these functions to your system. I will also explain in detail on my thought process and steps on creating this as well.
</p>
~~~lua
Render sprites
Lifespan decay
Alpha fade out simple
Movement basic
Rotation basic
Noise vector
Rotation spin roll
Radius scale
Alpha fade in simple
Rotation random
Position within sphere random
Alpha random
Lifetime random
Radius random
Emit continuously
~~~
<p>
Now if you want to know further detail on this system then
</p>
- open up particle editor<br>
- create a new particle.
<p>
Now I want petals to show up.
</p>
- Add <b>"Render Sprites"</b> in Renderer since there is no self-animation involved in this system.<br>
- Now I check orientation type, it's already set to "Screen Align" so it's good to go.<br>
- Scroll down to the texture field, you can see the circle sprite.
<p>
But I want petal sprite for this situation, falling circle might be able to work as snow but not for spring.
</p>
- Click on Magnifying glass to open up browser.<br>
- In this point, you can use your custom vtex material as a texture but in this tutorial, materials/particle/flower/flower.vtex will do the job.
<p>
Now that renderer is up, I need an emitter to show my petal.
</p>
- Add <b>"Emit continuously"</b> in Emitter since I want my petals to keep falling down.
<p>
<b>Don't forget to change your max particles number in Base Properties and emission rate accordingly so your particle system will not overflow with too many particles.</b> In this tutorial, I set mine to 160 as I think that should do the job. Now your screen should have something similar to this.
</p>
<img src="http://i.imgur.com/y3wMAMp.png"></img>
<p>
Now that it shows the petal, but there is nothing going on yet. Since I want these petals to move and disappear at some points, I continue on to next step:
</p>
- Add <b>"Lifespan decay"</b> in Operator since I want them to disappear at some points.<br>
- Add <b>"Movement basic"</b> in Operator since I want them to move at some points.
<p>
Now I do feel like this scene somewhat needs a gravity since petal will be falling down in some directions. So I make some changes to the value in Movement basic as followed:
</p>

|Field|Value|
|-----|-----|
|gravity|100 -100 -200|
|drag|-0.4|

<p>
The gravity is freely adjustable to your taste, but I like mine to go in this direction. Your result should be something similar to this.
</p>
<img src="http://i.imgur.com/aFNmLNT.png"></img>
<p>
Now I have the petals showing up and move due to gravity, I want them to spread around in the area not just start from origin. So I do this
</p>
- Add <b>"Position within sphere random"</b> in Initializer to position my petals.
<p>
Now, there are two ways to approach how you initialize this function.
</p>
- First way is to manually adjust the value in particle editor.<br>
- Second way is to bind it to the control point.
<p>
I will explain the first way since I will use it statically in my hammer (adjusting these control points in hammer is hell.)
</p>
<p>
Now I want them to start within certain radius and start with certain speed. I change following values.
</p>

|Field|Value|
|-----|-----|
|distance min|0.0|
|distance max|1500.0 (maximum radius you want to cover)|
|distance bias absolute value|0.0 0.0 0.7 (since I only want them to show up on the top half of sphere)|
|speed min|10|
|speed max|10|
|speed in local coordinate system min|0 0 -20|
|speed in local coordinate system max|0 0 -20|

<p>
If you want to bind these value to control point, simply change <b>scale CP</b>, in which (x, y, z) will represent (distance, speed, local speed), to desired control point and set all the above value to 1.0 except distance min and distance bias absolute value. Now that it is done, you should see something similar to the following.
</p>
<img src="http://i.imgur.com/7qvk253.png"></img>
<p>
Now I feel like these petals lack natural feeling to it. So I add the randomness to this system by following functions.
</p>
- Add <b>"Rotation random"</b> in Initializer.<br>
- Add <b>"Alpha random"</b> in Initializer.<br>
- Add <b>"Lifetime random"</b> in Initializer.<br>
- Add <b>"Radius random"</b> in Initializer.
<p>
Now you have to go in each function and adjust the value to your taste. The followings are the settings I use in this tutorial.
</p>
<h4>Rotation random</h4>
- default value
<h4>Alpha random</h4>
<p>
People won't like it if these petals will obstruct the view of the players so I set the values as followed.
</p>

|Field|Value|
|-----|-----|
|alpha min|100|
|alpha max|150|

<h4>Lifetime random</h4>
<p>
The petals should disappear at different time so I set the values as followed.
</p>

|Field|Value|
|-----|-----|
|lifetime min|1.5|
|lifetime max|3.0|

<h4>Radius random</h4>
<p>
In reality, petals are not the same size every where, so I set the values as followed.
</p>

|Field|Value|
|-----|-----|
|radius min|10.0|
|radius max|20.0|

<p>
Once those are all set, you should see the result similar to below.
</p>
<img src="http://i.imgur.com/VhuUzL9.png"></img>
<p>
Now that you see randomness at creation, but the sudden pop in and out is kinda annoying to me. So I get rid of them by:
</p>
- Add <b>"Alpha fade in simple"</b> in Operator.<br>
- Add <b>"Alpha fade out simple"</b> in Operator.
<p>
I left those value as default as I think it's already much better than earlier. You can freely adjust those values as you like.
</p>
<p>
Now the petals fall and fade in and out, we want them to rotate as they go so it looks more natural. To do so, add the following function.
</p>
- Add <b>"Rotation basic"</b> in Operator.<br>
- Add <b>"Rotation spin roll"</b> in Operator.
<p>
And now adjust the values of Rotation spin roll and leave Rotation basic as default.
</p>

|Field|Value|
|-----|-----|
|spin rate degree|10.0|

<p>
So now the petals start spinning, I want to make them get smaller as they go to reduce some blocking vision to players. So I add:
</p>
- Add <b>"Radius scale"</b> in Operator.
<p>
However, I don't want them to start right away and the petals don't just go back to 0.0 scale, so I adjust the following values:
</p>

|Field|Value|
|-----|-----|
|start time|0.5|
|end time|1.0|
|radius start scale|1.0|
|radius end scale|0.4|

<p>
Now you should have something looking similar to this.
</p>
<img src="http://i.imgur.com/ioODWyt.png"></img>
<p>
Now it almost looks natural but it lacks wind. Normally when petals fall down, it should somewhat be affected by the wind. To achieve this, I add the following function:
</p>
- Add <b>"Noise Vector</b> in Operator.
<p>
You should now see your petals blinking with different color. Don't panic. We haven't adjusted the value yet so it's set to default that way. Now I want to adjust so the noise will add into my sprite as it goes with randomness. So I set the values to the following:
</p>

|Field|Value|
|-----|-----|
|output field|Position|
|output minimum|-10.0 -10.0 -10.0|
|output maximum|10.0 10.0 10.0|
|noise coordinate scale|0.2|
|additive|true|

<p>
Now with this, your falling petals should look very natural, and you can adjust all those values as you desire. The result particles should be similar to the following.
</p>
<img src="http://i.imgur.com/ajnc7uu.png"></img>
<p>
This reaches the end of this tutorial. If you have any question, comment, or improvement to the guide, please don't hesitate to leave a comment or send me a message. Let me know what you want to see created next!.
</p>
