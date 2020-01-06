import {renderHook, act} from '@testing-library/react-hooks'
import {useFetchCallback} from "../index"

describe(`useFetchCallback`, () => {

  describe(`given window.AbortController is not defined`, () => {

    let hook
    let fetcherArgs
    let resolve
    let reject

    beforeEach(() => {
      window.AbortController = undefined
      console.warn = jest.fn()
      const fetcher = jest.fn((...args) => {
        fetcherArgs = args
        return new Promise((rs, rj) => {
          resolve = rs
          reject = rj
        })
      })
      hook = renderHook(() => useFetchCallback(fetcher)).result
    })

    it(`returns loading:false, error: null, data: null, callback:fn`, () => {
      const [[loading, error, data], , callback] = hook.current
      expect(loading).toBe(false)
      expect(error).toBe(null)
      expect(data).toBe(null)
      expect(typeof callback).toBe('function')
    })

    describe(`aborting the callback before invoking it`, () => {

      beforeEach(() => {
        const [, , callback] = hook.current
        act(() => {
          callback.abort()
        })
      })

      it(`returns loading:false, error: null, data: null, callback:fn`, () => {
        const [[loading, error, data], , callback] = hook.current
        expect(loading).toBe(false)
        expect(error).toBe(null)
        expect(data).toBe(null)
        expect(typeof callback).toBe('function')
      })

      it(`warns the user that a polyfill is needed`, () => {
        expect(console.warn).toHaveBeenCalledTimes(1)
        expect(console.warn).toHaveBeenCalledWith('react-ufo: you invocation of `.abort()` will do nothing because no `window.AbortController` was detected in your environment')
      })

    })

    describe(`invoking the callback`, () => {

      beforeEach(() => {
        const [, , callback] = hook.current
        act(() => {
          callback(1, 2, 3)
        })
      })

      it(`returns loading:true, error: null, data: null, callback:fn`, () => {
        const [[loading, error, data], , callback] = hook.current
        expect(loading).toBe(true)
        expect(error).toBe(null)
        expect(data).toBe(null)
        expect(typeof callback).toBe('function')
      })

      it(`passes the arguments of the callback invocation and an abort signal to the fetcher`, () => {
        expect(fetcherArgs).toMatchObject([1, 2, 3, {}])
      })

      describe(`aborting the callback while the fetcher is pending`, () => {

        beforeEach(() => {
          const [, , callback] = hook.current
          act(() => {
            callback.abort()
          })
        })

        it(`returns loading:false, error: null, data: null, callback:fn`, () => {
          const [[loading, error, data], , callback] = hook.current
          expect(loading).toBe(false)
          expect(error).toBe(null)
          expect(data).toBe(null)
          expect(typeof callback).toBe('function')
        })

        it(`warns the user that a polyfill is needed`, () => {
          expect(console.warn).toHaveBeenCalledTimes(1)
          expect(console.warn).toHaveBeenCalledWith('react-ufo: you invocation of `.abort()` will do nothing because no `window.AbortController` was detected in your environment')
        })

      })

    })

  })

})