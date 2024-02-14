---
title: GitHub Repositories and Search
---

# GitHub Repositories and Search

## Templates
* [TypeScript Template](https://github.com/ModDota/TypeScriptAddonTemplate)
* [Barebones](https://github.com/DarkoniusXNG/barebones)
* [But Template](https://github.com/Snoresville/dota2buttemplate_fixed)

## Examples & Guides
* [Lua Abilities](https://github.com/Elfansoer/dota-2-lua-abilities)
* [Spell Library](https://github.com/Pizzalol/SpellLibrary)
* [Particle Editor Tutorial](https://github.com/Nibuja05/dota_particle_editor_tutorial)

## Custom Games
* [Dota Imba](https://github.com/EarthSalamander42/dota_imba)
* [Dota Reimagined](https://github.com/Shushishtok/dota-reimagined)
* [Legends of Dota Redux](https://github.com/darklordabc/Legends-of-Dota-Redux)
* [Open Angel Arena](https://github.com/OpenAngelArena/oaa)
* [Dota Tutorial](https://github.com/ModDota/dota-tutorial)

## Tools
* [ModCraft](https://github.com/EarthSalamander42/ModCraft)
* [Tooltip Generator](https://github.com/Shushishtok/tooltip_generator)
* [Tooltip Codemaker](https://github.com/Shushishtok/tooltip-codemaker)

## Misc
* [Game Tracking](https://github.com/SteamDatabase/GameTracking-Dota2)
* [Valve Resource Format](https://github.com/SteamDatabase/ValveResourceFormat)
* [Typescript Declarations](https://github.com/ModDota/TypeScriptDeclarations)

## Code Search
> [GitHub Code Search](https://github.com/search) ([Docs](https://docs.github.com/en/search-github/searching-on-github/searching-code))

The search function on GitHub has some very handy features to find code.

|       Filter        |                                           Syntax                                           |                                                                                                                                                    Example                                                                                                                                                    |
|:-------------------:|:------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|      Language       |                                    `language:language`                                     |                                                                               `SendEventClientSide language:JavaScript` ([Link](https://github.com/search?q=SendEventClientSide+language%3AJavaScript&type=code&l=JavaScript))                                                                                |
|     Repository      |                                  `repo:username/reponame`                                  |                                                                              `AddFOWViewer repo:EarthSalamander42/dota_imba` ([Link](https://github.com/search?q=AddFOWViewer+repo%3AEarthSalamander42%2Fdota_imba+&type=code))                                                                               |
|        Path         |                                      `path:your/path`                                      |                                                                            `FindAllByClassname path:game/scripts/vscripts/` ([Link](https://github.com/search?q=FindAllByClassname+path%3Agame%2Fscripts%2Fvscripts%2F&type=code))                                                                            |
|        User         |                                      `user:username`                                       |                                                                                               `ListenToGameEvent user:ModDota` ([Link](https://github.com/search?q=ListenToGameEvent+user%3AModDota&type=code))                                                                                               |
|  Boolean Operators  |                                 `OR` <br/>`AND` <br/>`NOT`                                 | `CastAbilityNoTarget (language:Lua OR language:TypeScript)` ([Link](https://github.com/search?q=CastAbilityNoTarget+%28language%3ALua+OR+language%3ATypeScript%29&type=code)) <br/> `CastAbilityNoTarget NOT path:.d.ts` ([Link](https://github.com/search?q=CastAbilityNoTarget+NOT+path%3A.d.ts&type=code)) |
| Wildcard Characters | ```. , : ; / \ ` ' " = * ! ? # $ & + ^ \| ~ < > ( ) { } [ ] @```<br/>*No escaping support* |                                                                      `FindAllByClassname path:game/scripts/vscripts/*.lua` ([Link](https://github.com/search?q=FindAllByClassname+path%3Agame%2Fscripts%2Fvscripts%2F*.lua&type=code))                                                                       |

And yes, the filters can of course be combined.
