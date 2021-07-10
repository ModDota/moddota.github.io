---
title: Advanced rpg looting chest in typescript     # Title of your article (required)
author: schloerk                                    # Your name
steamId: 76561198385531121                          # Your steam ID to link to your steam profile
date: 10.07.2021                                    # The date of writing
---


In this guide you will learn to create a channeling chest, which drops loot.
The tricky part is to scale that item, because "Scale" is not supported, and to keep that item while channeling. Also you want to replace it with a opened chest model after successfully opening it. If the channeling fails, you also want to keep the chest.
It also should keep the scale and rotation. Also the chest we are using has two different material sets and of course we want to support "Skin" either.

So we gotta implement that. Lets go.

In our example we use models/props_generic/chest_treasure_02.vmdl and models\props_generic\chest_treasure_02_open.vmdl, which both have a golden and brown material. 0 is brown, 1 is gold.

```
"DOTAAbilities"
{

    "item_treasure_chest_2"
	{
	"BaseClass"                       "item_lua"
	"Model"                           "models/props_generic/chest_treasure_02.vmdl"
        "ScriptFile"                      "item_treasure_chest_2.lua"
        "AbilityBehavior"                 "DOTA_ABILITY_BEHAVIOR_CHANNELLED"
	"AbilityTextureName"              "item_desolator"

        "ItemShareability"                 "ITEM_FULLY_SHAREABLE"
        "ItemKillable"                     "0"
        "ItemSellable"                     "0" 
        "ItemPurchasable"                  "0"
        "ItemDroppable"                    "1" 
        "ItemPermanent"                    "0"
        "ItemCost"                         "99999" 
        
        "AbilityCooldown"                  "0.0" // Ability cooldown must be 0
        "AbilityChannelTime"               "2.5"
        "AbilityUnitTargetType"           "DOTA_UNIT_TARGET_HERO"
        "OnlyPlayerHeroPickup"            "1"
        "CreepHeroPickup"                 "1"
        "DisplayOverheadAlertOnReceived"  "0" // Show no item accquired overhead effect
        "ItemCastOnPickup"                "1" // Start channeling on pickup

        // Custom Values
        // -------------
        "ReplaceOnOpen"                   "models\props_generic\chest_treasure_02_open.vmdl"
        "Skin"                            "1"
	}
}
```

Instead of item_desolator, you should use a better icon :)

```ts
// registerAbility() and BaseItem is provided by dota_ts_adapter and needs to imported.

@registerAbility()
class item_treasure_chest_2 extends BaseItem {

    position!: Vector;
    angles!: Vector;
    kv!: Record<string, string>;
    channelingPlaceholder!: CBaseAnimating;

    Spawn() {
        if (IsServer()) {
            this.kv = this.GetAbilityKeyValues() as Record<string, string>;           
            this.HandleSkinAndScale();
        }
    }

    private HandleSkinAndScale(){
        const kvSkin = this.GetSkin();
        const kvScale = this.GetScale();

        if(kvSkin == 0 && kvScale == 1){
            return;
        }
        // Container is not created by engine at Spawn() time
        Timers.CreateTimer(0.01, () => {
            const container = this.GetContainer();

            if(container){
                container.SetSkin(kvSkin);
                container.SetModelScale(kvScale);
            }
        });
    }

    // For some reason, it doesnt apply the item texture, so we find it here
    GetAbilityTextureName() {
        return GetAbilityTextureNameForAbility(this.GetName());
    }

    // OnSpellStart gets called twice for some reason, thats why we check if position and placeholder are set
    OnSpellStart() {
        if (IsClient()) {
            return;
        }

        if(!this.position){
            this.position = this.GetContainer()!.GetOrigin();
            this.angles = this.GetContainer()!.GetAnglesAsVector();
        }

        if (!this.channelingPlaceholder) {
           this.channelingPlaceholder = this.SpawnReplacementChests(this.GetChestModel());
        }
    }

    OnChannelFinish(interrupted: boolean) {
        if (IsClient()) {
            return;
        }
        if (interrupted) {
            this.RedropChest();
            this.DeleteChest();
            return;
        }
        this.OnChestOpen();
    }

    OnChestOpen() {
        print("Opened chest");
        
        this.CreateLoot();
        this.SpawnReplacementChests(this.GetChestOpenModel());
        this.DeleteChest();
    }

    // spawned chests do not have a collider
    private SpawnReplacementChests(model: string): CBaseAnimating{

        const item = SpawnEntityFromTableSynchronous("prop_dynamic", {
            model: model,
            scale: this.GetScale(),
            origin: this.position,
            angles: this.angles,
            skin: this.GetSkin()
        }) as CBaseAnimating;

        item.ResetSequence("chest_treasure_idle");

        return item as CBaseAnimating;
    }

    private RedropChest() {
        const chestReplace = CreateItem(this.GetName(), undefined, undefined);
        const item = CreateItemOnPositionSync(this.position, chestReplace);
        item.SetModelScale(this.GetScale());
        item.ResetSequence("chest_treasure_idle");
    }

    private DeletePlaceholder(){
        this.channelingPlaceholder.RemoveSelf();
    }

    private DeleteChest() {
        // Removing an item also destroys the underlying entity, be carefull
        this.GetCaster().RemoveItem(this);
        this.DeletePlaceholder();
    }

    private CreateLoot(){
        const caster = this.GetCaster();

        const item = CreateItem("item_desolator", caster.GetPlayerOwner(), undefined);
        const worldItem = CreateItemOnPositionSync(this.position, item);
        item?.LaunchLoot(false, 124, RandomFloat(0.5, 1.2), caster.GetOrigin().__add(RandomVector(RandomInt(50, 150))));
    }

    private GetChestOpenModel() {
        return this.kv["ReplaceOnOpen"];
    }

    private GetChestModel(){
        return this.kv["Model"];
    }

    private GetSkin(){
        return tonumber(this.kv["Skin"]) || 0;
    }

    protected GetScale(){
        return tonumber(this.kv["Scale"]) || 1;
    }
}
```

Finally you will want to give your chest a tooltip name. Add "DOTA_Tooltip_ability_item_treasure_chest_2"			"Testchest" to your addon_*.txt.

There are some drawbacks to this approach. You cant change the pickup range and the itemquality. If you find a way, tell me :D

