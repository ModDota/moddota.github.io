---
title: Events and Timers in Typescript
author: Shush
steamId: 76561197994333648
date: 05.10.2022
---

As you may know, Dota has many events. While developing a custom game, listening to events is very useful, as it allows you to do something when something occurs. For example, an event may listen to all deaths, triggering whenever a hero, unit or building are killed. Events will supply some information about the instance of that event. For example, in the above event, the killer and the victim will be included in the parameters.

### Important Note Before We Begin

This section has many async functions that have callbacks as arguments. If you're not aware of what those are, W3Schools has great straightforward articles explaining [callbacks](https://www.w3schools.com/js/js_callback.asp) and [async functions](https://www.w3schools.com/js/js_asynchronous.asp) on the subject.

This tutorial will reference and explain code written in the Typescript Template. If you do not have it, please read the [Typescript Introduction](typescript-introduction) article for instructions. Though this will use the written code as examples, feel free to play around with the template as practice and to really understand how it all ties together.

### Built-in Events

Built-in events, of which there are many, cannot be changed in terms of when they are triggered and what parameters are provided, so bear that in mind. However, you can add a listener to the event with a callback function - a function that will run when that event triggers.

Open the `GameMode.ts` file in the `/src/vscripts` folder of your project.
There, you can find examples of events that we're listening to. For example, let's take the following event:

```ts
ListenToGameEvent("npc_spawned", event => this.OnNpcSpawned(event), undefined);
```

Calling the `ListenToGameEvent` creates a new listener to that event. In the first argument, a valid event's name must be provided. Typescript knows which event names are allowed and will refuse any other name that is not one of the known events. Not only that, it also knows what type of parameters each event pass along.
You can use your IDE's intellisense (e.g. in VSCode it is ctrl + space by default) to show the name of all events, then simply select the event you want.

Then, the second argument is the callback function. Note that it has the `event => SomeFunctionName(event)` syntax, named the arrow function expressionn syntax. This is used to define a function that will run when the event triggers. Given an `event` object which describes the event, the function is called and run just like any other code.

The function can be an external function, like `this.OnNpcSpawned` in the example above where it is defined, or you can write out the function body right there. For example:

```ts
ListenToGameEvent("npc_spawned", event => {
    print("we just fired npc spawned event!");
}, undefined);
```

:::note
I do not recommend writing function bodies in this manner unless it is a few lines at most, as the code can get messy and not very readable.
:::

As was already stated, Typescript knows what are the parameters provided when an event is triggered. They are stored in an object that we call `event`. If we're using an external function, that function should expect that event, which makes sure it is only used when the appropriate event runs.

In the example of `this.OnNpcSpawned(event)`, we defined an external function in the same class to call whenever the event triggers, which looks like this:

```ts
OnNpcSpawned(event: NpcSpawnedEvent) {
    // After a hero unit spawns, apply modifier_panic for 8 seconds
    const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC; // Cast to npc since this is the 'npc_spawned' event
    // Give all real heroes (not illusions) the meepo_earthbind_ts_example spell
    if (unit.IsRealHero()) {
        if (!unit.HasAbility("meepo_earthbind_ts_example")) {
            // Add lua ability to the unit
            unit.AddAbility("meepo_earthbind_ts_example");
        }
    }
}
```

There are a few things we can see here. First, the `event: NpcSpawnedEvent`, which describes the type of event this function requires. This has two advantages - first, if you use an incompatible event and callback, Typescript will notify you immediately. Second, that function knows which parameters are provided for you to use.

If you're unsure which type you should use, you can hover over `event` in the event listener call, and Typescript will let you know which type this event is. For example, hovering over the event of `npc_spawned` will show you the `NpcSpawnedEvent` type:

![Event type of predefined events](/images/typescript-tutorial/eventTypeOfPredefinedEvents.png)

Since the event triggered, we know something spawned. In the function itself, we want to know what spawned and refer to it. If we check the properties of the `NpcSpawnedEvent` event, we can see that it has two properties: `entindex`, which is of type EntityIndex, and `is_respawn`, which is of type boolean.

:::note
You can look up types in the editor by clicking on a type and pressing F12.
:::

The entindex refers to the Entity Index that maps to the entity that was spawned. If we wanted to get the entity itself, we would need to cast it to a handle, which can be done by calling `EntIndexToHScript`. Then, you can refer to that entity (usually a unit) and do whatever you need to happen when the unit spawns. You can also use the `is_respawn` property to determine if that unit has respawned if it was not its first time spawning.

### Custom Events

In the likely case where the built-in events do not cover a situation that you want to trigger an event on, Dota allows you to create custom events. As with built-in events, Typescript plays a big part in creating custom events and ensuring the types of those events make sense.

Before we begin, we must first define the event. For that, we use a .d.ts file. If you want, you can read more about .d.ts files [here](https://en.wikipedia.org/wiki/TypeScript#Declaration_files). The bottom line is, we use .d.ts files to describe to Typescript about types of things that are globally available.

Navigate to `/src/common/events.d.ts`. There you can use the `CustomGameEventDeclarations` interface to add as many custom events as you want. The template designed the custom events to be pulled from events shown in this interface. We can see that it already has the `example_event` event which will be used as its name, and a type of `ExampleEventData`, which is later defined as an object that has various properties, such as `myNumber`.

:::note
The `/common` folder is for all types shared by both serverside and panorama, such as events or nettables. This means that you can define the event once and both sides will be able to see and use that event.
:::

When you want to fire a custom event, you can use the `CustomGameEventManager.Send_ServerToPlayer` function to do so. There are other variants of this function, but to put it simply, this variant sends an event to a specific player. In this case, the first argument defines which player to send the event to, and the second argument defines which event it should trigger for that player. Note that you can only use custom events that were defined in the `CustomGameEventDeclarations` interface - Typescript will throw an error otherwise. The third argument is shaped based on the selected event, and enforces that the event is sent with all the required information for that event.

You can find an example of the `CustomGameEventManager.Send_ServerToPlayer` function call in `GameMode.ts`, which will show how it all ties together.

### Timers

Timers is a library written in lua. We can use the Timers library to delay actions for a certain amount of time, after which a callback function is called. It can be used a delay or as a repeat call that happens every few seconds, for example.

:::note
Timers is written in lua. Instead of converting it to Typescript, we use the file `timers.d.ts` to describe to Typescript how Timers is structured, allowing us to use the Timers library as is.
:::

Going back to `GameMode.ts`, the file includes a couple Timers example. In both of them, the execution is simple. Let's inspect one of them:

```ts
// Automatically skip setup in tools
if (IsInToolsMode()) {
    Timers.CreateTimer(3, () => {
        GameRules.FinishCustomGameSetup();
    });
}
```

This is a snippet of code that triggers when the game goes into the Custom Game Setup screen, where players can assign themselves to teams. In order for devs to not have to wait on this screen on every run, we added a check - if this is in tools mode (meaning, we're launching the game from the Dota Workshop Tools), then we create a timer. After 3 seconds, we run `GameRules.FinishCustomGameSetup();` which skips to the next step.

Note that the code does not wait for the timer to finish. The timer is created and the code moves on to the next line immediately. When the provided amount of time passes in game, the timer resolves, executing the callback function provided to it.

Timers can be set to repeat by returning a numeric value representing seconds. For instance, we could create the following timer:

```ts
Timers.CreateTimer(5, () => {
  print(`The current time in dota is: ${GameRules.GetDOTATime()}`);
  return 1;
});
```

Doing this will create a timer that initially takes 5 seconds to execute. Since we're returning 1, the timer will repeat every 1 second. In this example, on every execution, it will print the current time and message.

:::note
Timers respect pauses. This means that they will not progress while the game is paused, postponing the code execution until the game is unpaused.
:::

### Using Timers with Promises to delay code

Sometimes you want to make a sequence of effects that occur one after another, but rather than immediately, you want them to apply after a short period has passed. While you could do that in Timers, that would create a series of callbacks, which can make the code messy and hard to read.

Instead, we could wrap the timer in a Promise. In case you are not aware of Promises, you can read on [Promises in W3Schools](https://www.w3schools.com/js/js_promise.asp). We will also use promises with the async/await concept, which you can read on [Async/Awaits in W3Schools](https://www.w3schools.com/js/js_async.asp). Those are somewhat complex subjects, so feel free to discuss with us in Moddota on it or seek additional articles or videos on it.

Let's make a `sleep` function that will return a Promise that resolves when the timer executes. I usually make all utility functions such as this in a different file, usually named `utils.ts`. Go to `/src/vscripts/libs` folder and create a file named `utils.ts`.

There, we want to create the sleep function, which looks like this:

```ts
export function sleep(duration: number) {
    return new Promise((resolve, reject) => {
        Timers.CreateTimer(duration, () => resolve(""));
    });
}
```

As you can see, the function returns a Promise, which will resolve at some point in the future. You can wait then await for the promise to resolve using async/await. For the purposes of this example, let's look at the `OnNpcSpawned` function. It converts an entindex to a unit, then checks if it is a real hero (e.g. not an illusion). Then, if it doesn't have the ability, it gives him the ability immediately. Let's pretend that instead, we want to give it the ability after 5 seconds have passed.

First, since we want to use `await`, we must convert this function to an async function. Add the `async` keyword right before the function name:

```ts
private async OnNpcSpawned(event: NpcSpawnedEvent) {
```

Then, import `sleep` from `utils.ts`:

```ts
import { sleep } from "./lib/util";
```

And now we can sleep for 5 seconds using await:

```ts
private async OnNpcSpawned(event: NpcSpawnedEvent) {
    // After a hero unit spawns, apply modifier_panic for 8 seconds
    const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC; // Cast to npc since this is the 'npc_spawned' event
    // Give all real heroes (not illusions) the meepo_earthbind_ts_example spell
    if (unit.IsRealHero()) {
        if (!unit.HasAbility("meepo_earthbind_ts_example")) {
            // Wait for 5 seconds before giving it the ability
            await sleep(5);

            // Add lua ability to the unit
            unit.AddAbility("meepo_earthbind_ts_example");
        }
    }
}
```

As you can see, this makes the code very clean and easy to use. Non-repeating Timers can be converted to sleep in this way to achieve the same result with a cleaner code flow.

There are many things that you can use async/await for, such as waiting for tracking projectiles to hit, waiting until an animation finishes and so on.

### What's Next?

Feel free to start experimenting on your own! If you have something that you'd like me to cover in Typescript, please contact me in Discord and let me know.
