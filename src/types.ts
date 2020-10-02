export type Callback<TState extends string, TEvent extends string> = (
  from: TState,
  event: TEvent,
  to: TState
) => void

export type AsyncCallback<TState extends string, TEvent extends string> = (
  from: TState,
  event: TEvent,
  to: TState
) => void | Promise<void>

export type Options = {
  name?: string
  throw?: boolean
}

export type TransitionMap<
  TState extends string,
  TEvent extends string,
  TCallback = Callback<TState, TEvent>
> = Map<TEvent, Map<TState, { to: TState; cb: TCallback }>>

export class InvalidTransition extends Error {
  constructor(ev: string, from: string) {
    super()
    this.message = `Invalid transition event "${ev}" from state "${from}"`
  }
}
