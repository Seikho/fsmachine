# fsmachine

> A simple and small TypeScript finite state machine

## Goals

- Complete type safety
- Type inference when registering transitions and dispatching events
- Easily and cheaply create several state machines of the same type

## API

### createMachine()

- Returns the `transition` function for registering valid transitions
- Returns the `create` factory function which returns a finite state machine object

The function expects a `State` and `Event` generic.  
This is so we can provide type safety and inference for the `dispatch` and `transition` functions

### createMachineAsync()

### create

The `create` function is a factory function that creates an instance of the finite state machine.

```ts
const fsm = createMachine<State, Event>('unlocked', { throw: false })
fsm.transition([...], [...], [...])
const window = fsm.create()
window.dispatch('open')
```

### transition

The `transition` function registers valid transitions.  
The fourth parameter is an optional callback which is called when the transition is invoked.

Asynchronous state machines only differ by allowing asynchronous callbacks.

```ts
type Transition = [State, Event, State, Callback] | [State, Event, State]

function transition(...transition: Transition[])
```

## Example

```ts
import { createMachine } from 'fsmachine'

type State = 'opened' | 'unlocked' | 'locked' | 'broken'
type Event = 'open' | 'close' | 'lock' | 'unlock' | 'break'

// "throw: false" disables throwing InvalidTransition errors and returns false instead
const { transition, create } = createMachine<State, Event>('unlocked', {
  name: 'window',
  throw: false,
})

// These calls are all completely type safe due to the State and Event generics provided earlier
transition(
  ['locked', 'unlock', 'unlocked', (from, event, to) => console.log({ from, event, to })],
  ['unlocked', 'open', 'opened'],
  ['opened', 'close', 'unlocked'],
  ['unlocked', 'lock', 'locked'],
  ['locked', 'break', 'broken'],
  ['unlocked', 'break', 'broken']
)

// (Optional) We can override the options here or provide nothing to inherit the original options.
const window = create({ name: 'my-first-window', throw: false })

// Invalid state transitions throw by default
// We can disable this behaviour by providing { throw: false } to either createMachine() or to create()

window.dispatch('lock') // returns true
window.getState() // returns 'locked'
window.dispatch('open') // returns false
window.dispatch('break') // returns true
window.getState() // returns 'broken'
```
