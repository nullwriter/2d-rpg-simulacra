# parcel-phaser-react-rpg

A POC 2D RPG developed with **Phaser**, using **React** for its UI, and built with **Parcel**.

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
- [ ] Memory logic for agents
- [ ] Add vector database
- [ ] Implement "observation" for agents: they sense the world (object states, other agents)
- [ ] Add LLM wrapper initially supporting only OpenAI
- ...

