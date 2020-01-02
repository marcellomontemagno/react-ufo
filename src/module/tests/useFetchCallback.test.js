import {renderHook, act} from '@testing-library/react-hooks'
import {useFetchCallback} from "../index"

describe(`useFetchCallback`, () => {

  let hook
  let fetcherArgs
  let resolve
  let reject

  beforeEach(() => {
    const fetcher = jest.fn((...args) => {
      fetcherArgs = args
      return new Promise((rs, rj) => {
        resolve = rs
        reject = rj
      })
    })
    hook = renderHook(() => useFetchCallback(fetcher)).result
  })

  it(`returns loading:false, error: null, data: null, callback:fn as iterable`, () => {
    const [loading, error, data, callback] = hook.current
    expect(loading).toBe(false)
    expect(error).toBe(null)
    expect(data).toBe(null)
    expect(typeof callback).toBe('function')
  })

  it(`returns loading:false, error: null, data: null, callback:fn as object`, () => {
    const {loading, error, data, callback} = hook.current
    expect(loading).toBe(false)
    expect(error).toBe(null)
    expect(data).toBe(null)
    expect(typeof callback).toBe('function')
  })

  describe(`aborting the callback before invoking it`, () => {

    beforeEach(() => {
      const [, , , callback] = hook.current
      callback.abort()
    })

    it(`returns loading:false, error: null, data: null, callback:fn`, () => {
      const [loading, error, data, callback] = hook.current
      expect(loading).toBe(false)
      expect(error).toBe(null)
      expect(data).toBe(null)
      expect(typeof callback).toBe('function')
    })

  })

  describe(`invoking the callback`, () => {

    beforeEach(() => {
      const [, , , callback] = hook.current
      act(() => {
        callback(1, 2, 3)
      })
    })

    it(`returns loading:true, error: null, data: null, callback:fn`, () => {
      const [loading, error, data, callback] = hook.current
      expect(loading).toBe(true)
      expect(error).toBe(null)
      expect(data).toBe(null)
      expect(typeof callback).toBe('function')
    })

    it(`passes the arguments of the callback invocation and an abort signal to the fetcher`, () => {
      expect(fetcherArgs).toMatchObject([1, 2, 3, {}])
      expect(fetcherArgs[3] instanceof AbortSignal).toBe(true)
    })

    describe(`aborting the callback while the fetcher is pending`, () => {

      beforeEach(() => {
        const [, , , callback] = hook.current
        act(() => {
          callback.abort()
        })
      })

      it(`returns loading:false, error: null, data: null, callback:fn`, () => {
        const [loading, error, data, callback] = hook.current
        expect(loading).toBe(false)
        expect(error).toBe(null)
        expect(data).toBe(null)
        expect(typeof callback).toBe('function')
      })

    })

    describe(`resolving the fetcher`, () => {

      const expectedResult = 'result'

      beforeEach(async () => {
        await act(async () => {
          resolve(expectedResult)
        })
      })

      it(`returns loading:false, error: null, data: expectedResult, callback:fn`, () => {
        const [loading, error, data, callback] = hook.current
        expect(loading).toBe(false)
        expect(error).toBe(null)
        expect(data).toBe(expectedResult)
        expect(typeof callback).toBe('function')
      })

      describe(`aborting the callback after the fetcher is resolved`, () => {

        beforeEach(() => {
          const [, , , callback] = hook.current
          act(() => {
            callback.abort()
          })
        })

        it(`returns loading:false, error: null, data: null, callback:fn`, () => {
          const [loading, error, data, callback] = hook.current
          expect(loading).toBe(false)
          expect(error).toBe(null)
          expect(data).toBe(null)
          expect(typeof callback).toBe('function')
        })

      })

    })

    describe(`rejecting the fetcher`, () => {

      const expectedError = 'error'

      beforeEach(async () => {
        await act(async () => {
          reject(expectedError)
        })
      })

      it(`returns loading:false, error: expectedError, data: null, callback:fn`, () => {
        const [loading, error, data, callback] = hook.current
        expect(loading).toBe(false)
        expect(error).toBe(expectedError)
        expect(data).toBe(null)
        expect(typeof callback).toBe('function')
      })

      describe(`aborting the callback after the fetcher is rejected`, () => {

        beforeEach(() => {
          const [, , , callback] = hook.current
          act(() => {
            callback.abort()
          })
        })

        it(`returns loading:false, error: null, data: null, callback:fn`, () => {
          const [loading, error, data, callback] = hook.current
          expect(loading).toBe(false)
          expect(error).toBe(null)
          expect(data).toBe(null)
          expect(typeof callback).toBe('function')
        })

      })

    })

  })

})