import { Callback, TransitionMap } from './types'

export function transitioner<
  TState extends string,
  TEvent extends string,
  TCallback = Callback<TState, TEvent>
>(name?: string) {
  const transitions: TransitionMap<TState, TEvent, TCallback> = new Map()

  type Transition = [TState, TEvent, TState, TCallback] | [TState, TEvent, TState]

  const transition = (...transition: Transition[]) => {
    for (const [from, ev, to, cb] of transition) {
      if (!transitions.has(ev)) transitions.set(ev, new Map())
      const fromMap = transitions.get(ev)!

      if (fromMap.has(from)) {
        throw new Error(`Handler already set for ${name}::${from} --> ${to}`)
      }

      fromMap.set(from, { to, cb: cb ?? (noop as any) })
    }
  }

  return { transitions, transition }
}

function noop() {}
