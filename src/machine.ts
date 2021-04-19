import { dispatcher, dispatcherAsync } from './dispatch'
import { transitioner } from './transition'
import { AsyncCallback, Options } from './types'

type OverrideOptions<TState extends string> = Options & { init?: TState }

export function createMachine<TState extends string, TEvent extends string>(
  init: TState,
  opts: Options = {},
) {
  const { transition, transitions } = transitioner<TState, TEvent>(opts.name)
  const create = (override?: OverrideOptions<TState>) => {
    return dispatcher(override?.init ?? init, transitions, override ?? opts)
  }
  const machine = {
    transition: (...ts: Parameters<typeof transition>) => {
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

  return { transition, create }
}
