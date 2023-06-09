# 2D-rpg-simulacra

A POC 2D RPG developed with **Phaser**, using **React** for its UI, and built with **Parcel**. The objective is to create a working simulation with several agents using LLM's as their brain.

The paper this is based on: https://arxiv.org/abs/2304.03442

The initial code was forked from https://github.com/neemzy/parcel-phaser-react-rpg. 

Why?

The idea was to find a working base Phaser 2D RPG game to work with and focus on the rest of the objectives in the project. The repo I found just contains the POC of a Phaser 2D RPG game, where it only contains a player and 2 other NPC to test interactions and other functionalities.

## Limitations

As each agent will need to call several times the LLM on each game loop, this comes as a limitation as it will consume quite a lot of tokens, even when using GPT-3.5 instead of the desirable GPT-4. 

## Usage

Install dependencies:

```sh
$ npm install
```

Run the development version (with hot reloading):

```
$ npm start
$ open http://localhost:1234
```

Build the production version:

```
$ npm run build
$ npx http-server dist
```

## Roadmap

- [ ] Create base 2D game framework
    - [ ] Finish setting up players (agents); bounding box, movement, dynamic add/remove, metadata
    - [ ] Add logic for moving from one place to another
    - [ ] Add objects and buildings with state
- [ ] Create world state logic
- [ ] Create debug UI to see world state (agents, interations)
- [ ] Memory logic for agents
- [ ] Add vector database
- [ ] Implement "observation" for agents: they sense the world (object states, other agents)
- [ ] Add LLM wrapper initially supporting only OpenAI


More to be added.

## Inspirations

- Generative Agents: Interactive Simulacra of Human Behavior
- Sword Art Online: Alicization
- Westworld

