import { AsyncCallback, Callback, InvalidTransition, Options, TransitionMap } from './types'

export type Dispatcher<TState extends string, TEvent extends string> = {
  dispatch: (ev: TEvent) => boolean
  getState: () => TState
}

export type DispatcherAsync<TState extends string, TEvent extends string> = {
  dispatch: (ev: TEvent) => Promise<boolean>
  getState: () => TState
}

export function dispatcher<TState extends string, TEvent extends string>(
  init: TState,
  transitions: TransitionMap<TState, TEvent, Callback<TState, TEvent>>,
  opts: Options,
): Dispatcher<TState, TEvent> {
  let state = init

  const getState = () => state

  const invalid = (ev: TEvent) => {
    if (opts.onInvalid) {
      opts.onInvalid(state, ev)
    }
    if (opts.throw === false) return false
    throw new InvalidTransition(ev, state)
  }

  const dispatch = (ev: TEvent) => {
    const fromMap = transitions.get(ev)
    if (!fromMap) return invalid(ev)

    const transition = fromMap.get(state)
    if (!transition) return invalid(ev)

    const from = state
    state = transition.to
    transition.cb(from, ev, transition.to)

    return true
  }

  return { dispatch, getState }
}

export function dispatcherAsync<TState extends string, TEvent extends string>(
  init: TState,
  transitions: TransitionMap<TState, TEvent, AsyncCallback<TState, TEvent>>,
  opts: Options,
): DispatcherAsync<TState, TEvent> {
  let state = init

  const getState = () => state

  const invalid = (ev: TEvent) => {
    if (opts.onInvalid) {
      opts.onInvalid(state, ev)
    }
    if (opts.throw === false) return false
    throw new InvalidTransition(ev, state)
  }

  const dispatch = async (ev: TEvent) => {
    const fromMap = transitions.get(ev)
    if (!fromMap) return invalid(ev)

    const transition = fromMap.get(state)
    if (!transition) return invalid(ev)

    const from = state
    state = transition.to
    await transition.cb(from, ev, transition.to)

    return true
  }

  return { dispatch, getState }
}
