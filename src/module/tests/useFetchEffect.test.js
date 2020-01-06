import {renderHook, act} from "@testing-library/react-hooks"
import {useFetchEffect} from "../index"

describe(`useFetchEffect`, () => {

  let hook
  let fetcherArgs
  let resolve
  let reject
  let fetcher

  beforeEach(() => {
    fetcher = jest.fn((...args) => {
      fetcherArgs = args
      return new Promise((rs, rj) => {
        resolve = rs
        reject = rj
      })
    })
    hook = renderHook(() => useFetchEffect(fetcher))
    //prevents the tests to fail for an unhandled rejection
    hook.result.current[1].catch(() => undefined)
  })

  it(`returns loading:true, error: null, data: null, callback:fn`, () => {
    const [[loading, error, data], , callback] = hook.result.current
    expect(loading).toBe(true)
    expect(error).toBe(null)
    expect(data).toBe(null)
    expect(typeof callback).toBe('function')
  })

  it(`invokes the fetcher on mount`, () => {
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it(`passes an abort signal to the fetcher`, () => {
    const abortSignal = fetcherArgs[0]
    expect(abortSignal instanceof AbortSignal).toBe(true)
    expect(abortSignal.aborted).toBe(false)
  })

  describe(`when the component is unmounted`, () => {

    beforeEach(() => {
      hook.unmount()
    })

    it(`aborts the signal`, () => {
      const abortSignal = fetcherArgs[0]
      expect(abortSignal.aborted).toBe(true)
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
      const [[loading, error, data], , callback] = hook.result.current
      expect(loading).toBe(false)
      expect(error).toBe(null)
      expect(data).toBe(expectedResult)
      expect(typeof callback).toBe('function')
    })

    describe(`invoking the callback after the fetcher is resolved`, () => {

      beforeEach(() => {
        const [, , callback] = hook.result.current
        act(() => {
          callback()
        })
      })

      it(`allows you to refresh the data and returns loading:true, error: null, data: null, callback:fn`, () => {
        const [[loading, error, data], , callback] = hook.result.current
        expect(loading).toBe(true)
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
      const [[loading, error, data], , callback] = hook.result.current
      expect(loading).toBe(false)
      expect(error).toBe(expectedError)
      expect(data).toBe(null)
      expect(typeof callback).toBe('function')
    })

    describe(`invoking the callback after the fetcher is rejected`, () => {

      beforeEach(() => {
        const [, , callback] = hook.result.current
        act(() => {
          callback()
        })
      })

      it(`allows you to retry and returns loading:true, error: null, data: null, callback:fn`, () => {
        const [[loading, error, data], , callback] = hook.result.current
        expect(loading).toBe(true)
        expect(error).toBe(null)
        expect(data).toBe(null)
        expect(typeof callback).toBe('function')
      })

    })

  })

})