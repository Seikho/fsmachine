import { Dispatcher, dispatcher, DispatcherAsync, dispatcherAsync } from './dispatch'
import { Transition, transitioner } from './transition'
import { AsyncCallback, Options } from './types'

export type Machine<TState extends string, TEvent extends string> = {
  transition: (...transition: Transition<TState, TEvent>[]) => Machine<TState, TEvent>
  create: (override?: OverrideOptions<TState>) => Dispatcher<TState, TEvent>
}

export type MachineAsync<TState extends string, TEvent extends string> = {
  transition: (...transition: Transition<TState, TEvent>[]) => MachineAsync<TState, TEvent>
  create: (override?: OverrideOptions<TState>) => DispatcherAsync<TState, TEvent>
}

type OverrideOptions<TState extends string> = Options & { init?: TState }

export function createMachine<TState extends string, TEvent extends string>(
  init: TState,
  opts: Options = {},
) {
  const { transition, transitions } = transitioner<TState, TEvent>(opts.name)
  const create = (override?: OverrideOptions<TState>) => {
    return dispatcher(override?.init ?? init, transitions, override ?? opts)
  }

  const machine: Machine<TState, TEvent> = {
    transition: (...ts) => {
      transition(...ts)
      return machine
    },
    create,
  }

  return machine
}

export function createMachineAsync<TState extends string, TEvent extends string>(
  init: TState,
  opts: Options = {},
) {
  const { transition, transitions } = transitioner<TState, TEvent, AsyncCallback<TState, TEvent>>(
    opts.name,
  )
  const create = (override?: OverrideOptions<TState>) => {
    return dispatcherAsync(override?.init ?? init, transitions, override ?? opts)
  }

  const machine: MachineAsync<TState, TEvent> = {
    transition: (...ts) => {
      transition(...ts)
      return machine
    },
    create,
  }

  return { transition, create }
}
