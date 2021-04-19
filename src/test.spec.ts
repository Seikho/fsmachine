import { expect } from 'chai'
import { createMachine } from './machine'

type State = 'opened' | 'locked' | 'unlocked'

type Event = 'open' | 'close' | 'lock' | 'unlock'

const machine = createMachine<State, Event>('unlocked', { throw: false }).transition(
  ['locked', 'unlock', 'unlocked'],
  ['unlocked', 'open', 'opened'],
  ['opened', 'close', 'unlocked'],
  ['unlocked', 'lock', 'locked'],
)

type Test = [string, Event, State | false]

const tests: Test[] = [
  ['not close when unlocked', 'close', false],
  ['not unlock when unlocked', 'unlock', false],
  ['lock when unlocked', 'lock', 'locked'],
  ['not open when locked', 'open', false],
  ['unlock when locked', 'unlock', 'unlocked'],
  ['open when unlocked', 'open', 'opened'],
  ['not lock when opened', 'lock', false],
  ['close when opened', 'close', 'unlocked'],
]

describe('transition tests', () => {
  const door = machine.create()

  for (const [msg, ev, expected] of tests) {
    it(`will ${msg}`, () => {
      const initial = door.getState()
      const result = door.dispatch(ev)
      const actual = door.getState()
      expect(result, `transition allowed from State.${initial} with Event.${ev}`).to.equal(
        expected !== false,
      )
      expect(actual, 'correct end state').to.equal(expected === false ? initial : expected)
    })
  }
})

describe('functionality tests', () => {
  it('will create two independant states from one machine', () => {
    const one = machine.create()
    const two = machine.create()

    one.dispatch('open')
    expect(one.getState()).to.equal('opened')
    expect(two.getState()).to.equal('unlocked')
  })

  it('will throw on invalid transition', () => {
    const one = machine.create({ throw: true })
    const badTransition = () => one.dispatch('close')

    expect(badTransition).to.throw()
  })

  it('will call the custom onInvalid callback when provided', () => {
    const onInvalid = () => {
      throw new Error('Invoked')
    }

    const one = machine.create({ onInvalid, throw: false })
    const badTransition = () => one.dispatch('close')

    expect(badTransition).to.throw()
  })
})
