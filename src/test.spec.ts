import { expect } from 'chai'
import { createMachine } from './machine'

type State = 'opened' | 'locked' | 'unlocked'

type Event = 'open' | 'close' | 'lock' | 'unlock'

const { create, transition } = createMachine<State, Event>('unlocked', { throw: false })

transition('locked', 'unlock', 'unlocked')
transition('unlocked', 'open', 'opened')
transition('opened', 'close', 'unlocked')
transition('unlocked', 'lock', 'locked')

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
  const door = create()

  for (const [msg, ev, expected] of tests) {
    it(`will ${msg}`, () => {
      const initial = door.getState()
      const result = door.dispatch(ev)
      const actual = door.getState()
      expect(result, 'transition allowed').to.equal(expected !== false)
      expect(actual, 'correct end state').to.equal(expected === false ? initial : expected)
    })
  }
})

describe('functionality tests', () => {
  it('will create two independant states from one machine', () => {
    const one = create()
    const two = create()

    one.dispatch('open')
    expect(one.getState()).to.equal('opened')
    expect(two.getState()).to.equal('unlocked')
  })

  it('will throw on invalid transition', () => {
    const one = create({ throw: true })
    const badTransition = () => one.dispatch('close')

    expect(badTransition).to.throw()
  })
})
