import {renderHook} from '@testing-library/react-hooks'
import {useFetcher} from "../index"

describe(`useFetcher`, () => {

  let hook
  let fetcherArgs
  let resolve
  let reject

  const initialLoading = true
  const initialError = 'anError'
  const initialData = 'someData'

  describe(`given a custom initial state is provided`, () => {

    beforeEach(() => {
      const fetcher = jest.fn((...args) => {
        fetcherArgs = args
        return new Promise((rs, rj) => {
          resolve = rs
          reject = rj
        })
      })
      hook = renderHook(() => useFetcher(fetcher, {
        loading: initialLoading,
        error: initialError,
        data: initialData
      }))
    })

    it(`returns that initial state`, () => {
      const [, [loading, error, data]] = hook.result.current
      expect(loading).toBe(initialLoading)
      expect(error).toBe(initialError)
      expect(data).toBe(initialData)
    })

  })


})