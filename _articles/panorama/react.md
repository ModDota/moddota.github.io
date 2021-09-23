---
title: React in Panorama
author: ark120202
---

React is a JavaScript library for building user interfaces. It allows you to break down UI into small reusable building blocks (components) and simplifies state management.

Usually React is used for building websites and web applications, but [`react-panorama`](https://github.com/ark120202/react-panorama) allows you to use the power of React in Dota 2.

## Installation

To avoid wasting time on configuration, it's recommended to start with the [JavaScript](https://github.com/ark120202/dota-templates/tree/webpack-react) or [TypeScript](https://github.com/ark120202/dota-templates/tree/webpack-typescript-react) templates, even if you're integrating it into an existing project.

Alternatively, if you want to configure build tools yourself, or you want to use it without any build steps (UMD), you can check out [`react-panorama` installation guide](https://github.com/ark120202/react-panorama#installation).

## JSX

Here's a basic hello-world application built with React:

```jsx
import React from 'react';
import { render } from 'react-panorama';

render(<Label text="Hello, world!" />, $.GetContextPanel());
```

The first parameter that gets passed to the `render` function is a tree of components constructed using JSX - an extension to the JavaScript syntax.

JSX tree is a regular JavaScript expression, just like a string, or object literal. That means you can manipulate it like any regular JS value - store it in variables, use it in conditions, or return it from functions.

For more information about JSX you can check out [official React documentation](https://reactjs.org/docs/introducing-jsx.html).

## Components

Instead of having all your UI in a monolithic XML file, React encourages you to split functionality into small building blocks - components.

In React, components are simple functions that return JSX:

```jsx
import React from 'react';
import { render } from 'react-panorama';

function App() {
  return <Label text="Hello, world!" />;
}

render(<App />, $.GetContextPanel());
```

Components can accept parameters as a function argument:

```tsx
import React from 'react';
import { render } from 'react-panorama';

// highlight-next-line
function HeroRow({ heroName }: { heroName: string }) {
  return (
    <Panel style={{ flowChildren: 'right' }}>
      <DOTAHeroImage heroimagestyle="icon" heroname={heroName} />
      <Label style={{ marginLeft: '5px' }} localizedText={heroName} />
    </Panel>
  );
}

function HeroList() {
  return (
    <Panel style={{ flowChildren: 'down' }}>
      {/* highlight-start */}
      <HeroRow heroName="npc_dota_hero_abaddon" />
      <HeroRow heroName="npc_dota_hero_abyssal_underlord" />
      <HeroRow heroName="npc_dota_hero_alchemist" />
      {/* highlight-end */}
    </Panel>
  );
}

render(<HeroList />, $.GetContextPanel());
```

## State

In modern React applications, state is usually managed using [hooks](https://reactjs.org/docs/hooks-intro.html). One of the basic hooks, [`useState`](https://reactjs.org/docs/hooks-state.html), allows you to declare a component-scoped variable, which re-renders the component every time its value gets changed. Here's a basic counter example:

```jsx
import React, { useState } from 'react';
import { render } from 'react-panorama';

function Counter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);

  return (
    <Panel style={{ flowChildren: 'down' }}>
      <Label text={`Count: ${count}`} />
      <TextButton className="ButtonBevel" text="Increment" onactivate={increment} />
    </Panel>
  );
}

render(<Counter />, $.GetContextPanel());
```

Similarly, you can use `useState` to bind state to input elements:

<Tabs
  defaultValue="ToggleButton"
  values={[
    { label: 'ToggleButton', value: 'ToggleButton' },
    { label: 'Slider', value: 'Slider' },
    { label: 'TextEntry', value: 'TextEntry' },
  ]}>
  <TabItem value="ToggleButton">

```jsx
import React, { useState } from 'react';
import { render } from 'react-panorama';

function ConditionalRendering() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Panel style={{ flowChildren: 'down' }}>
      <ToggleButton
        text="Show details"
        selected={showDetails}
        onactivate={() => setShowDetails(!showDetails)}
      />

      {showDetails && <Label text="Details!" />}
    </Panel>
  );
}

render(<ConditionalRendering />, $.GetContextPanel());
```

  </TabItem>
  <TabItem value="Slider">

```jsx
import React, { useState } from 'react';
import { render } from 'react-panorama';

function ColorPicker() {
  const [red, setRed] = useState(0.5);
  const [green, setGreen] = useState(0.5);
  const [blue, setBlue] = useState(0.5);

  return (
    <Panel style={{ flowChildren: 'right' }}>
      <Slider value={red} onvaluechanged={(p) => setRed(p.value)} />
      <Slider value={green} onvaluechanged={(p) => setGreen(p.value)} />
      <Slider value={blue} onvaluechanged={(p) => setBlue(p.value)} />
      <Panel
        style={{
          backgroundColor: `rgb(${red * 255}, ${green * 255}, ${blue * 255})`,
          width: '125px',
          height: '125px',
        }}
      />
    </Panel>
  );
}

render(<ColorPicker />, $.GetContextPanel());
```

  </TabItem>
  <TabItem value="TextEntry">

```jsx
import React, { useState } from 'react';
import { render } from 'react-panorama';

function ReservedText() {
  const [text, setText] = useState('');

  return (
    <Panel style={{ flowChildren: 'down' }}>
      <TextEntry text={text} ontextentrychange={(p) => setText(p.text)} />
      <Label text={`Reversed text: ${[...text].reverse().join('')}`} />
    </Panel>
  );
}

render(<ReservedText />, $.GetContextPanel());
```

  </TabItem>
</Tabs>

## Listening to events

In React, the only things that should affect what component shows are its props and state. So, in order to make component update data when a certain game event happens, you need to make event listener update component's state.

Since we can update component state only within the component itself, we also have to put our `GameEvents.Subscribe` call inside the component. However you can't register it in the render function itself, because it gets executed more often than we need to, since we need to register our listener only when the component gets mounted for the first time. That's when we have to use another builtin hook - [`useEffect`](https://reactjs.org/docs/hooks-effect.html).

`useEffect` hook is a function that usually gets called with 2 parameters. First one is the callback we want to execute, which would register our listener. The second is the list of state variable that our . Since we don't use any state for our listener, we can just use an empty array (`[]`). Also, optionally our callback can return a cleanup function, which is called either when one of dependencies changes, or when component gets unmounted.

```jsx
import React, { useEffect, useState } from 'react';
import { render } from 'react-panorama';

function KDA() {
  const [kills, setKills] = useState(() => Game.GetLocalPlayerInfo().player_kills);
  const [deaths, setDeaths] = useState(() => Game.GetLocalPlayerInfo().player_deaths);
  const [assists, setAssists] = useState(() => Game.GetLocalPlayerInfo().player_assists);

  // highlight-start
  useEffect(() => {
    const handle = GameEvents.Subscribe('dota_player_kill', () => {
      const playerInfo = Game.GetLocalPlayerInfo();
      setKills(playerInfo.player_kills);
      setDeaths(playerInfo.player_deaths);
      setAssists(playerInfo.player_assists);
    });

    return () => GameEvents.Unsubscribe(handle);
  }, []);
  // highlight-end

  return <Label style={{ color: 'white' }} text={`KDA: ${kills}/${deaths}/${assists}`} />;
}

render(<KDA />, $.GetContextPanel());
```

`react-panorama` provides a custom hook that makes listening to game events a little easier:

```jsx
import React, { useState } from 'react';
import { render, useGameEvent } from 'react-panorama';

function KDA() {
  const [kills, setKills] = useState(() => Game.GetLocalPlayerInfo().player_kills);
  const [deaths, setDeaths] = useState(() => Game.GetLocalPlayerInfo().player_deaths);
  const [assists, setAssists] = useState(() => Game.GetLocalPlayerInfo().player_assists);

  // @remove-line: A hook with 3 parameters doesn't look nice with Prettier
  // @remove-next-line
  // prettier-ignore
  // highlight-start
  useGameEvent('dota_player_kill', () => {
    const playerInfo = Game.GetLocalPlayerInfo();
    setKills(playerInfo.player_kills);
    setDeaths(playerInfo.player_deaths);
    setAssists(playerInfo.player_assists);
  }, []);
  // highlight-end

  return <Label style={{ color: 'white' }} text={`KDA: ${kills}/${deaths}/${assists}`} />;
}

render(<KDA />, $.GetContextPanel());
```

Just like that, you can listen to UI events, custom net table updates, or just time passing. `react-panorama` provides [a few more custom hooks](https://github.com/ark120202/react-panorama#hooks) for common use cases.

### Custom hooks

One of things that React Hooks make easier is code reuse. For example, we can extract logic used to listen to KDA changes into a custom `useKDA` hook.

```jsx
import React, { useState } from 'react';
import { render, useGameEvent } from 'react-panorama';

// highlight-next-line
function useKDA() {
  // Since both initializing and updating state is the same process,
  // we can extract it into a regular function
  function getKDA() {
    const playerInfo = Game.GetLocalPlayerInfo();
    return {
      kills: playerInfo.player_kills,
      deaths: playerInfo.player_deaths,
      assists: playerInfo.player_assists,
    };
  }

  const [kda, setKDA] = useState(getKDA);

  useGameEvent('dota_player_kill', () => setKDA(getKDA()), []);

  return kda;
}

function KDA() {
  // highlight-next-line
  const { kills, deaths, assists } = useKDA();

  return <Label style={{ color: 'white' }} text={`KDA: ${kills}/${deaths}/${assists}`} />;
}

function KDARatio() {
  // highlight-next-line
  const { kills, deaths, assists } = useKDA();
  const ratio = (kills + assists) / (deaths || 1);

  return <Label style={{ color: 'white' }} text={`KDA Ratio: ${ratio}`} />;
}

function App() {
  return (
    <Panel style={{ flowChildren: 'down' }}>
      <KDA />
      <KDARatio />
    </Panel>
  );
}

render(<App />, $.GetContextPanel());
```

## Next Steps

This tutorial have covered only basics of React. React has a large ecosystem of libraries, patterns and articles, lots of which would apply to Panorama. As a starting point you can check out [the official React website](https://reactjs.org/) (although some parts of it are [a little](https://github.com/reactjs/reactjs.org/issues/1782) [outdated](https://github.com/reactjs/reactjs.org/issues/1788)).
