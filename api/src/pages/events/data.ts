import eventsData from 'dota-data/files/events';
import { orderBy } from 'lodash';
import { useParams } from 'react-router-dom';
import { useRouterSearch } from '~components/Search';
import { isNotNil } from '~utils/types';

export type { EventField } from 'dota-data/files/events';
export interface Event extends eventsData.Event {
  isStarred: boolean;
}

const starredEventNames = [
  'dota_hero_inventory_item_change',
  'dota_player_update_selected_unit',
  'dota_player_update_query_unit',
  'dota_player_kill', // ?

  // https://github.com/bmddota/barebones/blob/source2/game/dota_addons/barebones/scripts/vscripts/internal/gamemode.lua#L76
  'dota_ability_channel_finished',
  'dota_illusions_created',
  'dota_item_combined',
  'dota_item_picked_up',
  'dota_item_purchased',
  'dota_non_player_used_ability',
  'dota_npc_goal_reached',
  'dota_player_begin_cast',
  'dota_player_gained_level',
  'dota_player_learned_ability',
  'dota_player_pick_hero',
  'dota_player_selected_custom_team',
  'dota_player_take_tower_damage',
  'dota_player_used_ability',
  'dota_rune_activated_server',
  'dota_team_kill_credit',
  'dota_tower_kill',
  'entity_hurt',
  'entity_killed',
  'game_rules_state_change',
  'last_hit',
  'npc_spawned',
  'player_chat',
  'player_connect',
  'player_connect_full',
  'player_disconnect',
  'player_reconnected',
  'tree_cut',
];

export const events = orderBy(
  eventsData.map((e): Event => ({ ...e, isStarred: starredEventNames.includes(e.name) })),
  [(e) => e.isStarred, (e) => e.name],
  ['desc', 'asc'],
);

export function useFilteredData() {
  const search = useRouterSearch();
  const { scope = '' } = useParams<{ scope?: string }>();

  if (search) {
    return { data: doSearch(search.toLowerCase().split(' ')), isSearching: true };
  }

  return { data: events.filter((e) => e.name === scope), isSearching: false };
}

function doSearch(words: string[]) {
  function filterName(member: { name: string }) {
    if (words.length === 0) return undefined;

    const name = member.name.toLowerCase();
    return words.every((word) => name.includes(word));
  }

  return events
    .map((event) => {
      const partialDeclaration = { ...event, fields: event.fields.filter(filterName) };
      if (partialDeclaration.fields.length > 0) {
        return partialDeclaration;
      }

      if (filterName(event)) {
        return { ...event, fields: [] };
      }
    })
    .filter(isNotNil);
}
