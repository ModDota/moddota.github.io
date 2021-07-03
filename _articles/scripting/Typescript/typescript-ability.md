---
title: Abilities in Typescript
author: Shush
steamId: 76561197994333648
date: 06.12.2020
---

Regardless of what kind of game you're going for, you'll most probably have to code a couple of abilities for your characters to use to fight whatever they need to fight. Typescript enables coding many abilities with a ton of flexibility.

For this tutorial, I'm going to be demonstrating Typescript with a fairly, simple ability: Skywrath's Arcane Bolt. It fires a slow moving tracking projectile that deals damage that equals a base damage, plus a multiplier of the hero's intelligence.

This tutorial assumes you have basic knowledge of how abilities are registered for units or heroes. If you're not aware, I'd recommend the amazing guides by Elfansoer: [Ability Form](https://github.com/Elfansoer/dota-2-lua-abilities/wiki/Ability-Lua-Tutorial-1%3A-Ability-Form) and [Registering and Testing Ability](https://github.com/Elfansoer/dota-2-lua-abilities/wiki/Ability-Lua-Tutorial-2:-Registering-and-Testing-Ability). Note, however, that this guide assumes you'll be using Typescript instead of lua, so going over the rest of tutorials in Elfansoer's Ability Lua Tutorial are not required; however, he does a fantastic job explaining mechanics and techniques which are employed whenever coding an ability, regardless of language, so I'm going ahead and recommend going over those if you're interested.

Before we start, I'm going to go ahead and link the [moddota tools](/api/#!/vscripts), which feature the most up to date API for custom games in Dota 2. If you were using Valve's wiki, ditch it; it hasn't been updated in years.

### Creating A New Ability

Before we can start coding an ability, we need to define it. Typescript only replaces lua files, so anything with KVs, like the npc_abilities_custom.txt or npc_heroes_custom.txt files is completely unchanged.

In the npc_abilities_custom.txt, which is located in `scripts/npc` folder, we'll put the ability definition, which is taken straight from the original Dota 2:

```
"typescript_skywrath_mage_arcane_bolt"
{
    // General
    //-------------------------------------------------------------------------------------------------------------
    "BaseClass"             		"ability_lua"
    "AbilityTextureName"			"skywrath_mage_arcane_bolt"
    "ScriptFile"				      "abilities/typescript_skywrath_mage_arcane_bolt"
    "AbilityBehavior"				"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET"
    "AbilityUnitTargetTeam"			"DOTA_UNIT_TARGET_TEAM_ENEMY"
    "AbilityUnitTargetType"			"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC"
    "AbilityUnitDamageType"			"DAMAGE_TYPE_MAGICAL"
    "SpellImmunityType"				"SPELL_IMMUNITY_ENEMIES_NO"
    "FightRecapLevel"				"1"
    "AbilitySound"					"Hero_SkywrathMage.ArcaneBolt.Cast"

    // Casting
    //-------------------------------------------------------------------------------------------------------------
    "AbilityCastRange"				"875"
    "AbilityCastPoint"				"0.1 0.1 0.1 0.1"

    // Time
    //-------------------------------------------------------------------------------------------------------------
    "AbilityCooldown"				"5.0 4.0 3.0 2.0"

    // Cost
    //-------------------------------------------------------------------------------------------------------------
    "AbilityManaCost"				"90"

    // Special
    //-------------------------------------------------------------------------------------------------------------
    "AbilitySpecial"
    {
        "01"
        {
          "var_type"				"FIELD_INTEGER"
          "bolt_speed"			"500"
        }

        "02"
        {
          "var_type"				"FIELD_INTEGER"
          "bolt_vision"			"325"
        }

        "03"
        {
          "var_type"				"FIELD_FLOAT"
          "bolt_damage"			"60 80 100 120"
        }

        "04"
        {
          "var_type"				"FIELD_FLOAT"
          "int_multiplier"		"1.6"
          "CalculateSpellDamageTooltip"	"1"
        }

        "05"
        {
          "var_type"				"FIELD_FLOAT"
          "vision_duration"		"3.34"
        }
    }
    "AbilityCastAnimation"		"ACT_DOTA_CAST_ABILITY_1"
}
```

Note that has slight changes: the ability was renamed to `typescript_skywrath_mage_arcane_bolt` in order to not conflict with the original ability. The ID was also removed, as it is not necessary for custom game abilities. Plus, for the sake of simplicity, the ability no longer has a scepter effect.

Three new fields were added:

* `"BaseClass" "ability_lua"` - though we code in Typescript, the resulting file will still be lua, which is what the engine expects. Therefore, we'll use "ability_lua" as the ability class type.

* `"AbilityTextureName" "skywrath_mage_arcane_bolt"` - since we're not using the original ability, it is necessary to add this field to tell the game which icon to use for the ability.

* `"ScriptFile" "abilities/typescript_skywrath_mage_arcane_bolt"` - this is the path of the file that has the code for the ability. Remember that it uses a relative path starting from the `/game/scripts/vscripts`, which has the `abilities` folder.

### Creating The Ability File

Now that the ability is defined, it is time to start coding it. The first step would be to create a file named in `typescript_skywrath_mage_arcane_bolt` inside of source folder `src/vscripts/abilities`. The source is where we'll create the file, but when we compile it, it will be produce a lua file in `/game/vscripts/abilities`, as the game expects. Remember that even though we create the ability in Typescript, the engine works with lua files, which is what we need to produce.

We'll add the `.ts` extension, so the file that we'll be editing is `typescript_skywrath_mage_arcane_bolt.ts`.

:::note
While the [Watcher is active](typescript-introduction.md/#activating-the-watcher), each time you save your file, a `.lua` file of the same name will be created in the respective output folder. This lua file will be used by the game, and will immediately update to correspond for any changes you do in your Typescript file.
:::

### Adding The Ability Class

First, we need to declare the ability's class. This is done by adding the following:

```ts
@registerAbility()
export class typescript_skywrath_mage_arcane_bolt extends BaseAbility
{

}
```

Let's go over it quickly:
* `@registerAbility()` - This assigns the class to the global scope, which allows Dota to recognize the ability.

* `export` - Including this keyword is not actually required, but is recommended. It allows you to call this class as a type, if you need to do so at some point. For example, your ability might have a unique function or property that others might want to reference or call.

* `class` - Standard keyword for creating classes.

* `typescript_skywrath_mage_arcane_bolt` - This is exactly the same as the ability name. It must be identical to the name of the ability at the top of the ability definition.

* `extends BaseAbility` - All standard abilities extend the `BaseAbility` class, and inherit various traits of it, such as it being an entity.

* `{}` - Your entire code for that ability will be inside of those curly brackets.

While your cursor is inside that block, all functions inherited from `BaseAbility` will show up here. Simply start typing for the auto complete to immediately show you possible completions of what you typed.

:::note
If either @registerAbility() or BaseAbility are not recognized and show an error, highlight them, and use the `Ctrl + .` hotkey shortcut, which opens a small menu that suggests to import them. You'll see the top of the file now has the import statement: `import { BaseAbility, registerAbility } from "../lib/dota_ts_adapter";`, which shows that those are now imported from their respective files.
:::

### Ability Properties

Before we actually add any functions, we should add properties to the class. Those are very easily accessible from everywhere in the class, and are very useful to store information for that ability instance there. This is not required, but this is where I usually store any of the values for:

* Particle paths

* Sounds

* Models

* Any other information needed for the ability to function, such as a boolean or a number.

Let's add the ability properties for Ancient Bolt: its cast sound, its projectile particle, and its impact sound. Those are fetched from the asset browser.
The class should now look like this:

```ts
@registerAbility()
export class typescript_skywrath_mage_arcane_bolt extends BaseAbility
{
    sound_cast: string = "Hero_SkywrathMage.ArcaneBolt.Cast";
    sound_impact: string = "Hero_SkywrathMage.ArcaneBolt.Impact";
    projectile_arcane_bolt: string = "particles/units/heroes/hero_skywrath_mage/skywrath_mage_arcane_bolt.vpcf";
}
```

:::note
The property names are arbitrary, and could be anything you'd like.
:::

Note that after the property name, comes `: string`. This defines the type of the proeprty. Technically, this is not required, as Typescript will know that it is a string due to it being assigned to a string. However, it is good practice to add the type to increase readability and to make sure you don't assign it with something you didn't intend to.

### Coding The Ability: Properties and Methods

Now that we've set up everything we need for the ability, let's start coding it. First, we'll add a OnSpellStart() method, which is called when the unit or hero casts it.

```ts
@registerAbility()
export class typescript_skywrath_mage_arcane_bolt extends BaseAbility
{
    sound_cast: string = "Hero_SkywrathMage.ArcaneBolt.Cast";
    sound_impact: string = "Hero_SkywrathMage.ArcaneBolt.Impact";
    projectile_arcane_bolt: string = "particles/units/heroes/hero_skywrath_mage/skywrath_mage_arcane_bolt.vpcf";

    OnSpellStart()
    {

    }
}
```

Inside OnSpellStart(), we want to fetch the target of the ability, which the bolt will be fired at. We'll initialize a variable to hold that information. We have two main types of variables that we can initialize:

* `const` - A constant. This variable must be assigned a value when it's called. This variables can never be reassigned. Useful for variables that should never change, such as instances of classes, or definitive results of a function that will be used as is.

* `let` - A standard variable. This variable can be undefined, be assigned immediately, or be assigned later. It can be reassigned as many times you need. Useful for things that change, such as numerical calculations, or boolean operators.

For this case, once we'll fetch our target, it should never change this cast, which is a good indication that we should use `const`. It will be immediately assigned to the ability's cursor target, using `this.GetCursorTarget()`.

:::note
`this` refers to the instance of the class where it is called, in this case, the `typescript_skywrath_mage_arcane_bolt` class. Since it inherits BaseAbility, it also inherits its functionality of fetching its cursor target.
:::

```ts
@registerAbility()
export class typescript_skywrath_mage_arcane_bolt extends BaseAbility
{
    sound_cast: string = "Hero_SkywrathMage.ArcaneBolt.Cast";
    sound_impact: string = "Hero_SkywrathMage.ArcaneBolt.Impact";
    projectile_arcane_bolt: string = "particles/units/heroes/hero_skywrath_mage/skywrath_mage_arcane_bolt.vpcf";

    OnSpellStart()
    {
        const target = this.GetCursorTarget();
    }
}
```

### Checking Function's Arguments And Return Type

In VSCode and similar editors that support it, hovering over a function will show a short explanation about it. For example, if we hover over `this.GetCursorTarget()`, we'll see the following:

![Function types](/images/typescript-tutorial/functionInfo.png)

This lets us know that:

1. This function doesn't expect any arguments.

2. This function will return either a CDOTA_BaseNPC, or undefined.

In other words, `target` will either be assigned a CDOTA_BaseNPC, which usually corresponds to a unit or a hero, or, in the case it was called with the ability not being cast on any target, be assigned to `undefined`. This can occur, for example, if we try to use `this.GetCursorTarget()` on a No Target ability.

Typescript knows this, and will mark `target` as a potential undefined variable. Whenever we will try to use this variable, such as `target.GetHealth()`, it will warn us that `target` might be undefined, and therefore might not be able to call the function. The best practice is to use an if to check that target actually exists before any function that involves it.

:::note
If you're sure that variables that are potential undefined will be assigned with a valid value. You can force Typescript to ignore the potential for undefined by adding "!" to the end of the assignment. For example, we can use `const target = this.GetCursorTarget()!`. However, this is not recommended, as it defeats the purpose of having types in the first place - to make sure you don't do something that you cannot.
:::


### Coding The Ability: Firing a projectile

The next step would be to collect all remaining information for the projectile out of our ability definition. We want the projectile speed (`bolt_speed`) and vision range (`bolt_vision`). The rest will be collected on impact. Our function should now look like this:

```ts
@registerAbility()
export class typescript_skywrath_mage_arcane_bolt extends BaseAbility
{
    sound_cast: string = "Hero_SkywrathMage.ArcaneBolt.Cast";
    sound_impact: string = "Hero_SkywrathMage.ArcaneBolt.Impact";
    projectile_arcane_bolt: string = "particles/units/heroes/hero_skywrath_mage/skywrath_mage_arcane_bolt.vpcf";

    OnSpellStart()
    {
        const target = this.GetCursorTarget();
        const bolt_speed = this.GetSpecialValueFor("bolt_speed");
        const bolt_vision = this.GetSpecialValueFor("bolt_vision");
    }
}
```

```note
Since GetSpecialValueFor always returns a number, it doesn't have a potential for undefined. However, it will still return 0 if the engine will not be able to find the string provided for the ability.
```

Next, we want to fire a tracking projectile at the target. The projectile cannot be dodged, and provides vision during its journey to the target, among other properties. Most of them have default values and can be omitted.

One of the great advantages of Typescript is that things like tracking projectiles have types. The editor immediately recognizes that we want properties for the tracking projectiles, and shows up possible properties for it when we go into it. Since this is a object full of properties, we need to open it with curly brackets:

![Tracking Projectile Properties](/images/typescript-tutorial/trackingProjectileProperties.png)

:::note
In most editors, `ctrl + spacebar` is the hotkey to show auto-complete if it is not shown.
:::

Let's fill it with properties we care about. The code will now look like this:

```ts
@registerAbility()
export class typescript_skywrath_mage_arcane_bolt extends BaseAbility
{
    sound_cast: string = "Hero_SkywrathMage.ArcaneBolt.Cast";
    sound_impact: string = "Hero_SkywrathMage.ArcaneBolt.Impact";
    projectile_arcane_bolt: string = "particles/units/heroes/hero_skywrath_mage/skywrath_mage_arcane_bolt.vpcf";

    OnSpellStart()
    {
        const target = this.GetCursorTarget();
        const bolt_speed = this.GetSpecialValueFor("bolt_speed");
        const bolt_vision = this.GetSpecialValueFor("bolt_vision");

        ProjectileManager.CreateTrackingProjectile(
        {
            Ability: this,
            EffectName: this.projectile_arcane_bolt,
            Source: this.GetCaster(),
            Target: target,
            bDodgeable: false,
            bProvidesVision: true,
            iMoveSpeed: bolt_speed,
            iVisionRadius: bolt_vision,
            iVisionTeamNumber: this.GetCaster().GetTeamNumber()
        })
    }
}
```

The above codes fires a projectile at the target. Note that `Target` expects either a CDOTA_BaseNPC or undefined, so Typescript doesn't complain about it. If it hits the target, it will trigger the OnProjectileHit event, so let's use this function as well.

### Coding The Ability: Projectile Impact

After creating the OnProjectileHit function, we might want to check if it comes with additional parameters that we can use. There are two ways to check for those additional parameters:

1. Navigating to [moddota tools](/api/#!/vscripts) and searching for the function, which shows the parameters:

![Dota Tools Parameters](/images/typescript-tutorial/dotaToolsSearchParameters.png)

2. In VSCode, Highlighting OnProjectileHit and pressing F12, which shows all references to the OnProjectileHit. The one defined in `api.generated.d.ts` includes the parameters of the function:

![Generated Types Parameters](/images/typescript-tutorial/apiGeneratedExample.png)

We can see that OnProjectileHit comes with a target that is either CDOTA_BaseNPC or undefined, and a location that is a Vector. The location will never be undefined and therefore always supplied, though it can be a Vector of (0, 0, 0).

We need to make sure there's a target. If there's no target, it means that the projectile didn't hit anything and simply dissipated (the target died or became invisible, for instance), which mean we don't need to do anything else. We use the `!` before the expression for negative testing, which will apply if `target` is either false or undefined.

```ts
@registerAbility()
export class typescript_skywrath_mage_arcane_bolt extends BaseAbility
{
    sound_cast: string = "Hero_SkywrathMage.ArcaneBolt.Cast";
    sound_impact: string = "Hero_SkywrathMage.ArcaneBolt.Impact";
    projectile_arcane_bolt: string = "particles/units/heroes/hero_skywrath_mage/skywrath_mage_arcane_bolt.vpcf";

    OnSpellStart()
    {
        const target = this.GetCursorTarget();
        const bolt_speed = this.GetSpecialValueFor("bolt_speed");
        const bolt_vision = this.GetSpecialValueFor("bolt_vision");

        ProjectileManager.CreateTrackingProjectile(
        {
            Ability: this,
            EffectName: this.projectile_arcane_bolt,
            Source: this.GetCaster(),
            Target: target,
            bDodgeable: false,
            bProvidesVision: true,
            iMoveSpeed: bolt_speed,
            iVisionRadius: bolt_vision,
            iVisionTeamNumber: this.GetCaster().GetTeamNumber()
        })
    }

    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector)
    {
        if (!target) return;
    }
}
```

Next, Let's quickly collect the remaining information of the ability from the ability definition: we need base damage, intelligence multiplier, and the vision's radius and duration after impact:

```ts
@registerAbility()
export class typescript_skywrath_mage_arcane_bolt extends BaseAbility
{
    sound_cast: string = "Hero_SkywrathMage.ArcaneBolt.Cast";
    sound_impact: string = "Hero_SkywrathMage.ArcaneBolt.Impact";
    projectile_arcane_bolt: string = "particles/units/heroes/hero_skywrath_mage/skywrath_mage_arcane_bolt.vpcf";

    OnSpellStart()
    {
        const target = this.GetCursorTarget();
        const bolt_speed = this.GetSpecialValueFor("bolt_speed");
        const bolt_vision = this.GetSpecialValueFor("bolt_vision");

        ProjectileManager.CreateTrackingProjectile(
        {
            Ability: this,
            EffectName: this.projectile_arcane_bolt,
            Source: this.GetCaster(),
            Target: target,
            bDodgeable: false,
            bProvidesVision: true,
            iMoveSpeed: bolt_speed,
            iVisionRadius: bolt_vision,
            iVisionTeamNumber: this.GetCaster().GetTeamNumber()
        })
    }

    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector)
    {
        if (!target) return;

        const bolt_vision = this.GetSpecialValueFor("bolt_vision");
        const bolt_damage = this.GetSpecialValueFor("bolt_damage");
        const int_multiplier = this.GetSpecialValueFor("int_multiplier");
        const vision_duration = this.GetSpecialValueFor("vision_duration");
    }
}
```

The last two things that we need to do is apply a AddFOWViewer, which shows an area of the map in fog of war, and apply damage to the target based on base damage plus a multiplier of the caster's intelligence. Adding the FOW Viewer is easy, so let's get it out of the way by adding the line:

```ts
AddFOWViewer(this.GetCaster().GetTeamNumber(), location, bolt_vision, vision_duration, false);
```

location is the parameter fetched from the function, while bolt_vision and vision_duration were retrieved from the ability definition.
For damage, we have a small calculation. In order to do that calculation readable, let's make a `damage` variable. We want to assign it with the base damage, and then calculate the intelligence multiplier. Sounds like a good use case for a `let` variable initializer. We'll add the following line:

```ts
let damage = bolt_damage;
```

Now we want to add damage on top of the base damage. We can use the `+=` operator to sum the value on the right with the value already stored in `damage`, so the plan is to do `damage += this.GetCaster().GetIntellect() * int_multiplier`. However, for some reason, `GetIntellect()` is not shown as a function.

### Coding The Ability: Final Push

So why isn't GetIntellect() showing up? The best way to do is check which class is GetIntellect() under. [Running a search in moddota tools](/api/#!/vscripts?search=GetIntellect) will show us that the class GetIntellect() belongs to is `CDOTA_BaseNPC_Hero`, which makes sense: only heroes have intelligence; units, buildings, and other entities don't. But our caster is a hero, so what's the problem?

If we hover over `this.GetCaster()`, we'll see the following information on it:

![GetCaster Properties](/images/typescript-tutorial/getCasterProperties.png)

According to the return type, GetCaster() returns a CDOTA_BaseNPC. But as we've established before, GetIntellect() only applies for the `CDOTA_BaseNPC_Hero` class. So we'll have to let Typescript know that our caster is a hero by casting. We cast by adding `as classname`; in this case, `this.GetCaster() as CDOTA_BaseNPC_Hero`. As the caster's type is now a hero, you can call hero related functions, such as `GetIntellect()`.

:::note
Generally, casting is not considered a good practice as you force Typescript to assume you're absolutely sure that the type is correct. Typeguards, which will be covered in a later tutorial, are considered a good way to make sure you don't use a type that doesn't support it. For instance, imagine what happens if at some point in your custom game, you give this ability to a creep, which doesn't have any Intelligence stat.
:::

We'll only increase the intelligence multiplier after we made sure the caster is a hero; otherwise, we'll only use the base damage.
After the check and the cast, our code should look like this:

```ts
@registerAbility()
export class typescript_skywrath_mage_arcane_bolt extends BaseAbility
{
    sound_cast: string = "Hero_SkywrathMage.ArcaneBolt.Cast";
    sound_impact: string = "Hero_SkywrathMage.ArcaneBolt.Impact";
    projectile_arcane_bolt: string = "particles/units/heroes/hero_skywrath_mage/skywrath_mage_arcane_bolt.vpcf";

    OnSpellStart()
    {
        const target = this.GetCursorTarget();
        const bolt_speed = this.GetSpecialValueFor("bolt_speed");
        const bolt_vision = this.GetSpecialValueFor("bolt_vision");

        ProjectileManager.CreateTrackingProjectile(
        {
            Ability: this,
            EffectName: this.projectile_arcane_bolt,
            Source: this.GetCaster(),
            Target: target,
            bDodgeable: false,
            bProvidesVision: true,
            iMoveSpeed: bolt_speed,
            iVisionRadius: bolt_vision,
            iVisionTeamNumber: this.GetCaster().GetTeamNumber()
        })
    }

    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector)
    {
        if (!target) return;

        const bolt_vision = this.GetSpecialValueFor("bolt_vision");
        const bolt_damage = this.GetSpecialValueFor("bolt_damage");
        const int_multiplier = this.GetSpecialValueFor("int_multiplier");
        const vision_duration = this.GetSpecialValueFor("vision_duration");

        AddFOWViewer(this.GetCaster().GetTeamNumber(), location, bolt_vision, vision_duration, false);

        let damage = bolt_damage;
        if (this.GetCaster().IsHero())
        {
            damage += (this.GetCaster() as CDOTA_BaseNPC_Hero).GetIntellect() * int_multiplier;
        }
    }
}
```

All that's left is to apply the damage on the target. Same as the CreateTrackingProjectile, ApplyDamage is also typed, and will automatically show us the options. Unlike CreateTrackingProjectile, none of those properties are optional and are all mandatory to make a proper damage instance. That means that Typescript will ensure you assign all the properties with valid values.

Our code should now look like this:

```ts
@registerAbility()
export class typescript_skywrath_mage_arcane_bolt extends BaseAbility
{
    sound_cast: string = "Hero_SkywrathMage.ArcaneBolt.Cast";
    sound_impact: string = "Hero_SkywrathMage.ArcaneBolt.Impact";
    projectile_arcane_bolt: string = "particles/units/heroes/hero_skywrath_mage/skywrath_mage_arcane_bolt.vpcf";

    OnSpellStart()
    {
        const target = this.GetCursorTarget();
        const bolt_speed = this.GetSpecialValueFor("bolt_speed");
        const bolt_vision = this.GetSpecialValueFor("bolt_vision");

        ProjectileManager.CreateTrackingProjectile(
        {
            Ability: this,
            EffectName: this.projectile_arcane_bolt,
            Source: this.GetCaster(),
            Target: target,
            bDodgeable: false,
            bProvidesVision: true,
            iMoveSpeed: bolt_speed,
            iVisionRadius: bolt_vision,
            iVisionTeamNumber: this.GetCaster().GetTeamNumber()
        })
    }

    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector)
    {
        if (!target) return;

        const bolt_vision = this.GetSpecialValueFor("bolt_vision");
        const bolt_damage = this.GetSpecialValueFor("bolt_damage");
        const int_multiplier = this.GetSpecialValueFor("int_multiplier");
        const vision_duration = this.GetSpecialValueFor("vision_duration");

        AddFOWViewer(this.GetCaster().GetTeamNumber(), location, bolt_vision, vision_duration, false);

        let damage = bolt_damage;
        if (this.GetCaster().IsHero())
        {
            damage += (this.GetCaster() as CDOTA_BaseNPC_Hero).GetIntellect() * int_multiplier;
        }

        ApplyDamage(
        {
            attacker: this.GetCaster(),
            damage: damage,
            damage_type: DamageTypes.MAGICAL,
            victim: target,
            ability: this,
            damage_flags: DamageFlag.NONE
        });
    }
}
```

Lastly, I forgot to include sounds, so let's go ahead and emit sounds for casting (`sound_cast`) and sound for impact (`sound_impact`).
The final code should look like this:

```ts
@registerAbility()
export class typescript_skywrath_mage_arcane_bolt extends BaseAbility
{
    sound_cast: string = "Hero_SkywrathMage.ArcaneBolt.Cast";
    sound_impact: string = "Hero_SkywrathMage.ArcaneBolt.Impact";
    projectile_arcane_bolt: string = "particles/units/heroes/hero_skywrath_mage/skywrath_mage_arcane_bolt.vpcf";

    OnSpellStart()
    {
        const target = this.GetCursorTarget();

        const bolt_speed = this.GetSpecialValueFor("bolt_speed");
        const bolt_vision = this.GetSpecialValueFor("bolt_vision");

        EmitSoundOn(this.sound_cast, this.GetCaster());

        ProjectileManager.CreateTrackingProjectile(
            {
                Ability: this,
                EffectName: this.projectile_arcane_bolt,
                Source: this.GetCaster(),
                Target: target,
                bDodgeable: false,
                bProvidesVision: true,
                iMoveSpeed: bolt_speed,
                iVisionRadius: bolt_vision,
                iVisionTeamNumber: this.GetCaster().GetTeamNumber(),
            }
        )
    }

    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector)
    {
        if (!target) return;

        EmitSoundOn(this.sound_impact, target);

        const bolt_vision = this.GetSpecialValueFor("bolt_vision");
        const bolt_damage = this.GetSpecialValueFor("bolt_damage");
        const int_multiplier = this.GetSpecialValueFor("int_multiplier");
        const vision_duration = this.GetSpecialValueFor("vision_duration");

        AddFOWViewer(this.GetCaster().GetTeamNumber(), location, bolt_vision, vision_duration, false);

        let damage = bolt_damage;
        if (this.GetCaster().IsHero())
        {
            damage += (this.GetCaster() as CDOTA_BaseNPC_Hero).GetIntellect() * int_multiplier;
        }

        ApplyDamage(
            {
                attacker: this.GetCaster(),
                damage: damage,
                damage_type: DamageTypes.MAGICAL,
                victim: target,
                ability: this,
                damage_flags: DamageFlag.NONE
            }
        );
    }
}
```

### Video Record

Below is a short video record that shows the application of Skywrath Mage's Ancient Bolt in Typescript as explained in this section.

<YouTube id="jiKNIkJ8TDE" />


### What's Next?

The next tutorial will explain how to make a basic modifier, and link the modifier to the a passive ability via Typescript.
