# React UI

The React UI coexists with the Phaser game, being rendered in a `div` element overlapping the latter.

It must take precedence over Phaser in capturing keyboard events, which is achieved in two ways:

- relying on the _same_ event: `keydown`
- using `event.stopImmediatePropagation()`
