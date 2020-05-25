---
title: Volcano Particle
author: Noya
steamId: 76561198046984233
date: 07.02.2015
category: Assets
---

Here I'll explain how to modify preexisting particles for the creation of a [Volcano ability](https://github.com/MNoya/DotaCraft/blob/master/scripts/npc/abilities/firelord_volcano.txt) :nuke:

I won't be making the particles from scratch or going really deep into its possibilities, so make sure to read the wonderful [Particle Creation Series](http://moddota.com/forums/discussion/110/particles-creation-series) by kritth to get a deeper understanding than just this example.

<Gfycat id="HandsomeImpossibleHyena" />

<br />

First we want a ~250 AoE radius volcano earth cone.

There is an useful particle system useful for this, espirit_spawn.vpcf, open it.

Go into its first child, _ground.

I want to hide the soild model because this spell will need some collision with the volcano, spawning a [simple volcano unit](https://github.com/MNoya/DotaCraft/blob/master/scripts/npc/units/firelord_volcano.txt). So in the main particle, disable the Render Model.
		
Now we need to adjust its child to fit the parent size and duration, making it loop with rocks.

- Add Emit Continuously
- Disable the Movement basic and alfa fade out simple
- Disable the 2 Remap particle count to scalar
- Radius from 16 to 25, make the place on ground 0
- Lifetime random, on the max value, change it to 0. This will make the earth move constantly and randomly.

<br />

Let's repeat the same steps on the other childs to make the dust-debris effect repeat

- On the _groundburst:
  - Add Emit continuously.
  - Because more particles is always better, we want more debris to be launched. 
  For this, go to its base properties, filter for Max, and double the max particles value. http://puu.sh/fx0cP/9f961c2c84.png
  - Then go to the Emit instanteneously, in the num to emit, also double this value.
  - Also increase the radius size of the launched particles by going into Initializer's Radius random and seting the min & max to 0.1 and 0.5
  - Finally, change to a darker rock model, Render Model to bad_barracks_stones003.vmdl

http://puu.sh/fzghv/60aacd4e5e.png

It's looking like this now (I forgot to hide the model for this preview)

<Gfycat id="OptimalRichDeviltasmanian" />

<br />
	
Moving onto _grounddustbdust, we see that the particle already has an Emit continuously, but it isn't actually looping as we'd want to, it's just emitting a single cloud.

- Change Emit continuously to emission duration 0
- Disable Remap scalar to Vector on the bottom of the Initializer functions (this gets rid of the black clouds)
- I also want the smoke to raise higher, for this change the Movement Basic 3rd value Z to 400 from the original 200.

Now the particle system is kinda filling the entire particle with dust, so we do the following:

- In Initializer Radius Random, change the radius max to 15 from 40.
- In Base Properties, reduce the max particles to 20 from 36.
	
Finally we finished the core base of the volcano:

<Gfycat id="ClumsyImpishGardensnake" />
	
Because I don't want or need to have additional control points, I'll make sure that all the control points of this particle system are fixed to the CP0.

By going into the main particle system and moving the CP1, we wee that the dust and ground burst are tied to CP1. We want them at CP0 for simplicity

To know which fields have which control point, hover over them:

http://puu.sh/fx7rp/2f77543e58.jpg

Now go to this position along ring, change the CP to 0, and its done. 

http://puu.sh/fx7wH/1d245d2e56.png

Repeat the same process on the groundburst particle.

---

Now, lets add fire to it! :fire:

In case you don't have the latest decompiled particles (which should include Techies and SF Arcana particles), download them from here: **[Decompiled Particles](http://moddota.com/resources/decompiled_particles.zip)**. There should also be a link in the [Resources Page](http://moddota.com/forums/resources)

<br />

Back to the particle editor, open the recently forked, sf_fire_arcana_wings system

* Hide the wing effects by disabling the render model of the wings 

http://puu.sh/fAac1/f03b7350a1.png

* Make a new child
* Add the espirit_spawn custom system made earlier.

http://puu.sh/fAcn5/8132f680eb.jpg

* Change the first 3 sf_fire_arcana_wings child particles to emit continuously like before.
* Going into sf_fire_arcana_wings_smoke_body you can see theres many wings_rope childs copied, each one of these childs has a different ground position.

  Lets keep only 1 at the middle and disable the rest while also making it emit continously. 
  The _wings_rope is already set to emit continuously but has a limited emission duration to 2.0, change it to 0.

  Also disable the 2nd Remap initial scalars to properly get the permanent particle.
			
* Now go into the rope_detail and do exactly the same: emission to ration 0, no Remap initial scalar.
  Also disable the noise vector, which makes the particle stutter after a while.

* Go back to wings_smoke, and disable the Initializer: Position modify offset random, as this is preventing the rope from starting at the center of CP1.
		
* For the _beams, also make them permanent, disable the Stop effect after duration, durations on the Emit continuously have to be 0.
  Decrease the max particle count to a third of its value, 36->12.
  Change the offset to 0,0,10
		
* In grow_rope, add Emit continuously and disable the Initializers for remap Particle count to scalar
  on its child rope_glow, only need to change emission duration to 0.
		
* _ember emission duration 0 also
		
* Add an emit continuously to to _core
		
* _souls_hands_pnt is supposed to be attached to shadow fiends hands, but our model doesn't use that, so we need to change it a bit, basically doing the same as before (changing or adding constant emitting, removing stuff that makes it stop, etc)
		
* I'll disable _souls_hands_tail because its too much noise already, and replace the Pull towards control point by a movement basic Z of 50, so that it looks like the light is coming from the center and flowing up.
		
Now after all that mess:
	
<Gfycat id="FewLeftAcornbarnacle" />

---

After the core volcano is done, now its time to add some boulders that originate from the center to all points in the 500 aoe radius of the ability.

This would be an extra particle system which I want to repeat at a time interval of my choice in the ability, so it will be just 1 instance and I can easiliy ThinkInterval + FireEffect it.

I will use a modified warlock_rain_of_chaos_explosion.vpcf with sf_fire_arcana_shadowraze for this purpose.

* First add a shadowraze children http://puu.sh/fyMVL/ef8b4c1300.jpg http://puu.sh/fyNqp/6a310ed236.jpg and increase the duration of most explosion effects, so it lasts a bit more after the explosion.

* _char increased lifetime random to 4 and 5. child char_fire doubled emit continously emission duration

* _end_smoke emission duration to 3.0 seconds

That's it for the shadowraze, now changing the rocks to move slower, last for longer and have an endcap animation when they hit the ground!

On chaos_explosion

We need to change some initializer functions to decrease the speed and make the rocks last longer

- Disable Radius scale to make the rocks not decrease in size
- Disable Lifespan decay, this makes particle not disappear after a fixed duration.
- Add the following operator to make the particles disappear when they hit the ground: **Cull when crossing plane**, keep it at the 0,0,1 plane normal by default.
- Also add Position modify offset random Initializer, to make them start a bit higher on the z so that some rocks dont get removed earlier. I put both offset min and max at 20.
- Increase the amount of emited particles, num to emit = 36. Also make them not spawn all in the same frame, maximum mission per frame = 1.
- Decrease the speed on the position along ring operator, min initial speed = 800 and max = 100.
	
Result: 

<Gfycat id="FinishedRewardingBactrian" />

---

Last but not least, another effect will be played when damaging a unit.

Now modifying particles/custom/sf_fire_arcana_base_attack_impact.vpcf is possible after having it decompiled earlier, and making a bigger and flashier explosion should be trivial with what I explained in the previous particle modifications.

I'll also add a lone_druid_bear_entangle_ground_soil_cauldron effect in here, to leave the mark where an rock damaged an anemy.

Finally after getting the particle with the ability together...

<Gfycat id="DisastrousRecentBaldeagle" />

---

I hope this isn't too much of a mess to reproduce and there's useful pieces of information hidden in between my random rambling :puppeyface: 

If I missed something or there's any doubts or suggestions just bombard this thread with them, I'll be glad to answer and learn from the mistakes I constantly do while modding particles. 
