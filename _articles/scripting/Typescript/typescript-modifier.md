---
title: Modifiers in Typescript
author: Shush
steamId: 76561197994333648
date: 07.03.2021
---

Modifiers are an extremely important part of almost any Dota custom game. They allow you to modify certain properties of your hero, deal damage to it over time, or apply various effects on it. Like abilities, we'll also create them in Typescript.

We'll use an easy example which should cover a lot of common concepts for modifiers. This example is Skywrath's Ancient seal, which is an ability that simply applies a modifier to an enemy. The modifier applies the Silenced state on the enemy, and reduces its magic resist property by a percentage.

:::note
For simplicity sake, assume the ability has no shard or talents upgrades.
:::

### Defining The Ability

For starters, let's define the ability that applies the modifier.
We'll begin with the KV, which is straightforward. Open `/game/scripts/npc/npc_abilities_custom.txt` and copy the following content inside the `"DOTAAbilities"` key.

```
//=================================================================================================================
// Skywrath Mage: Ancient Seal
//=================================================================================================================
"typescript_skywrath_mage_ancient_seal"
{
    // General
    //-------------------------------------------------------------------------------------------------------------
    "BaseClass"             		"ability_lua"
    "AbilityTextureName"			"skywrath_mage_ancient_seal"
    "ScriptFile"				    "abilities/typescript_skywrath_mage_ancient_seal"
    "AbilityBehavior"				"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET"
    "AbilityUnitTargetTeam"			"DOTA_UNIT_TARGET_TEAM_BOTH"
    "AbilityUnitTargetType"			"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC"
    "SpellImmunityType"				"SPELL_IMMUNITY_ENEMIES_NO"
    "SpellDispellableType"			"SPELL_DISPELLABLE_YES"
    "AbilitySound"					"Hero_SkywrathMage.AncientSeal.Target"

    // Casting
    //-------------------------------------------------------------------------------------------------------------
    "AbilityCastRange"				"700 750 800 850"
    "AbilityCastPoint"				"0.1 0.1 0.1 0.1"

    // Time
    //-------------------------------------------------------------------------------------------------------------
    "AbilityCooldown"				"14"

    // Cost
    //-------------------------------------------------------------------------------------------------------------
    "AbilityManaCost"				"80 90 100 110"

    // Special
    //-------------------------------------------------------------------------------------------------------------
    "AbilitySpecial"
    {
        "01"
        {
          "var_type"				"FIELD_INTEGER"
          "resist_debuff"			"30 35 40 45"
        }

        "02"
        {
          "var_type"				"FIELD_FLOAT"
          "seal_duration"			"3.0 4.0 5.0 6.0"
        }
    }
    "AbilityCastAnimation"		"ACT_DOTA_CAST_ABILITY_3"
}
```

As the `ScriptFile` denotes it, the lua file should be in `vscripts/abilities/`. To do so, we'll create our TS file in `src/vscripts/abilities/`, where it would be appropriately routed when compiled. Create the `typescript_skywrath_mage_ancient_seal.ts` file and open it.


### Coding The Ability

The ability itself is very straightforward, since all it does is apply a modifier on the target. For simplicity sake, let's decide the modifier will be named `modifier_typescript_ancient_seal`. Following is the ability:

```ts
import { BaseAbility, registerAbility } from "../lib/dota_ts_adapter";

@registerAbility()
export class typescript_skywrath_mage_ancient_seal extends BaseAbility {
	sound_cast = "Hero_SkywrathMage.AncientSeal.Target";

	OnSpellStart() {
		// Special values
		const seal_duration = this.GetSpecialValueFor("seal_duration");

		// Fetch target
		const target = this.GetCursorTarget()!;

		// Play sound
		target.EmitSound(this.sound_cast);

		// Add modifier
		target.AddNewModifier(this.GetCaster(), this, "modifier_typescript_ancient_seal", { duration: seal_duration });
	}
}
```

Great! This applies the modifier on the target. But we haven't defined the modifier yet, so let's do that next.


### Creating The Modifier

This part is absolutely up to you and your organizational preferences: some prefer to add the modifier as a separate file, while some prefer to have the ability and its associated modifiers in the same file. You could place the modifier file inside `src/vscripts/modifiers`, for instance. In order to keep the guide simple, let's make the modifier in the same file.

Very similar to an ability in TS, modifiers are also a class. We create a modifier with the following structure:

```ts
@registerModifier()
export class modifier_typescript_ancient_seal extends BaseModifier {

}
```

As you can see, it's very similar to an ability, replacing `@registerAbility()` with `@registerModifier()`, and the `BaseAbility` extension with `BaseModifier`.
Note that `@registerModifier()` takes care of LinkLuaModifier for you, so you don't need to call it on TS modifiers.

### Typechecking Modifier Calls

Before we continue, one thing we must do is link the ability to the modifier, which makes sure the modifier is registered. In addition, rather than relying on a string for the naming of the modifier, we'll link the class name.

To do so, simply remove the quotation marks around the modifier name, then add `.name` to it. See below the code before and after linking the class:

<MultiCodeBlock titles="Before|After">

```ts
// Add modifier
target.AddNewModifier(this.GetCaster(), this, "modifier_typescript_ancient_seal", { duration: seal_duration });
```

```ts
// Add modifier
target.AddNewModifier(this.GetCaster(), this, modifier_typescript_ancient_seal.name, { duration: seal_duration });
```

</MultiCodeBlock>

This results at the exact name of the modifier as a string, which is enforced by Typescript.

:::note
If your modifier is in another file, you'll have to import it first before you can link it in the above fashion.
:::

### Coding The Modifier

Alright. Let's set and apply the properties for the modifier such as the particle effect. In addition, let's set some useful properties via modifier functions.
Also, this is my personal choice, but I usually put ability specials as a class property so they can be easily used everywhere in the modifier.

```ts
@registerModifier()
export class modifier_typescript_ancient_seal extends BaseModifier {
	particle_seal = "particles/units/heroes/hero_skywrath_mage/skywrath_mage_ancient_seal_debuff.vpcf";
	resist_debuff?: number;

	// When set to false, shows the modifier icon on the HUD. Otherwise, the modifier is hidden.
	IsHidden() {
		return false;
	}

	// When set to true, the outer circle of the modifier is red, indicating that the modifier is a debuff. Otherwise, the outer circle is green.
	IsDebuff() {
		return true;
	}

	// When set to true, the modifier can be purged by basic dispels.
	IsPurgable() {
		return true;
	}

	// Event call that is triggered when the modifier is created and attached to a unit.
	OnCreated() {
		// Get the ability and fetch ability specials from it
		const ability = this.GetAbility();
		if (ability) {
			this.resist_debuff = ability.GetSpecialValueFor("resist_debuff");
		}

		// Add particle effect
		const particle = ParticleManager.CreateParticle(this.particle_seal, ParticleAttachment.OVERHEAD_FOLLOW, this.GetParent());
		ParticleManager.SetParticleControlEnt(particle, 1, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, "hitloc", this.GetParent().GetAbsOrigin(), true);
		this.AddParticle(particle, false, false, -1, false, true);
	}
}
```

Okay, so the modifier is defined, but its main parts of it are not yet defined: the silence and the magic resistance reduction. Let's do those next.

### States

The `CheckState` function that modifiers have is called every frame and sets the state of the parent based on its modifiers. The function gets a bunch of states and pairs each of them with a boolean that decides whether the state should be applied.

We only need to silence the target, so that's the only state we require here. Add the following to the modifier:

```ts
CheckState() {
    return {[ModifierState.SILENCED]: true}
}
```

Note the syntax: the curly braces start a [Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeystype) of states, each assigned a boolean. If you have multiple states - boolean pairs, separate each pair with a comma.

### Modifier Properties

The `DeclareFunctions` declares which function properties are included in this modifier. Since we need the property that modifies the magical resistance, let's call it here:

```ts
DeclareFunctions() {
    return [ModifierFunction.MAGICAL_RESISTANCE_BONUS];
}
```

Unlike states, DeclareFunctions expects an array of modifier functions. If you have multiple modifier functions, separate them with a comma.

:::note
When hovering over a modifier function's name (e.g. `MAGICAL_RESISTANCE_BONUS`), a tooltip appears, showing you the name of the linked property function call. Simply copy the function into the modifier. This also has auto complete, if you prefer to do so manually.
:::

Now that we declared the magical resistance bonus, let's return a negative bonus so the enemy get a negative magic resistance bonus from this modifier:
```ts
GetModifierMagicalResistanceBonus() {
    return this.resist_debuff ?? 0;
}
```

Note that this function expects a number - anything else is not accepted.

:::note
`this.resist_debuff` is supposedly a number that is fetched from the ability special value. However, if for some reason `this.resist_debuff` is not initialized, it would be undefined, which is not accepted by this function. Using [Nullish Coalescing](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing), the value is defaulted to 0 if `this.resist_debuff` is undefined.
:::

That's it! A simple modifier is done with a bunch of simple lines, which are all typechecked for us.

### What's Next?

The next part would involve listening to events in game mode and using timers. Stay tuned!
