import { allData } from "@moddota/dota-data/lib/helpers/vscripts";
import { Declaration } from "~components/Docs/api";
import vscriptsEvents from "@moddota/dota-data/files/events";
import panoramaEvents from "@moddota/dota-data/files/panorama/events";
import panoramaEnums from "@moddota/dota-data/files/panorama/enums";
import { orderBy } from "lodash";
import { DeclarationsContextType } from "~components/Docs/DeclarationsContext";

const starredEventNames = [
  "dota_hero_inventory_item_change",
  "dota_player_update_selected_unit",
  "dota_player_update_query_unit",
  "dota_player_kill", // ?

  // https://github.com/bmddota/barebones/blob/source2/game/dota_addons/barebones/scripts/vscripts/internal/gamemode.lua#L76
  "dota_ability_channel_finished",
  "dota_illusions_created",
  "dota_item_combined",
  "dota_item_picked_up",
  "dota_item_purchased",
  "dota_non_player_used_ability",
  "dota_npc_goal_reached",
  "dota_player_begin_cast",
  "dota_player_gained_level",
  "dota_player_learned_ability",
  "dota_player_pick_hero",
  "dota_player_selected_custom_team",
  "dota_player_take_tower_damage",
  "dota_player_used_ability",
  "dota_rune_activated_server",
  "dota_team_kill_credit",
  "dota_tower_kill",
  "entity_hurt",
  "entity_killed",
  "game_rules_state_change",
  "last_hit",
  "npc_spawned",
  "player_chat",
  "player_connect",
  "player_connect_full",
  "player_disconnect",
  "player_reconnected",
  "tree_cut",
];

function sort(declarations: Declaration[]) {
  return orderBy(declarations, [(e) => e.isStarred, (e) => e.name], ["desc", "asc"]);
}

export const scopes = {
  vscripts: {
    root: "/vscripts",
    declarations: sort(
      allData.map((declaration) => ({
        ...declaration,
        isStarred: false,
      })),
    ),
  },
  vscriptsEvents: {
    root: "/events",
    declarations: sort(
      vscriptsEvents.map((event) => ({
        kind: "function",
        name: event.name,
        description: event.description,
        args: event.fields.map((field) => ({
          name: field.name,
          description: field.description,
          types: [field.type],
        })),
        isStarred: starredEventNames.includes(event.name),
        returns: ["void"],
      })),
    ),
  },
  panorama: {
    root: "/panorama/api",
    declarations: sort(
      panoramaEnums.map((declaration) => ({
        kind: "enum",
        name: declaration.name,
        isStarred: false,
        members: declaration.members.map((member) => ({
          name: member.name,
          description: member.description,
          value: member.value,
        })),
      })),
    ),
  },
  panoramaEvents: {
    root: "/panorama/events",
    declarations: sort(
      Object.entries(panoramaEvents).map(([name, event]) => ({
        kind: "function",
        name: name,
        description: event.description,
        isStarred: false,
        args: event.args.map((arg) => ({
          name: arg.name,
          types: [arg.type],
        })),
        returns: ["void"],
      })),
    ),
  },
} satisfies Record<string, DeclarationsContextType>;
