import {renderHook, act} from '@testing-library/react-hooks'
import {useFetcher} from "../index"

describe(`useFetcher`, () => {

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
    hook = renderHook(() => useFetcher(fetcher))
  })

  it(`returns a result object which is also iterable`, () => {
    const {callback, requestState, setRequestState} = hook.result.current
    const {loading, error, data} = requestState
    const {setLoading, setError, setData} = setRequestState
    const [_callback, _requestState, _setRequestState] = hook.result.current
    const [_loading, _error, _data] = _requestState
    const [_setLoading, _setError, _setData] = _setRequestState
    expect(callback).toBe(_callback)
    expect(requestState).toBe(_requestState)
    expect(setRequestState).toBe(_setRequestState)
    expect(loading).toBe(_loading)
    expect(error).toBe(_error)
    expect(data).toBe(_data)
    expect(setLoading).toBe(_setLoading)
    expect(setError).toBe(_setError)
    expect(setData).toBe(_setData)
  })

  it(`returns loading:false, error: null, data: null`, () => {
    const [, [loading, error, data]] = hook.result.current
    expect(loading).toBe(false)
    expect(error).toBe(null)
    expect(data).toBe(null)
  })

  describe(`aborting the callback before invoking it`, () => {

    beforeEach(() => {
      const {callback} = hook.result.current
      act(() => {
        callback.abort()
      })
    })

    it(`returns loading:false, error: null, data: null`, () => {
      const [, [loading, error, data]] = hook.result.current
      expect(loading).toBe(false)
      expect(error).toBe(null)
      expect(data).toBe(null)
    })

  })

  describe(`invoking the callback`, () => {

    beforeEach(() => {
      const {callback} = hook.result.current
      act(() => {
        callback(1, 2, 3).catch(() => undefined)
      })
    })

    it(`returns loading:true, error: null, data: null`, () => {
      const [, [loading, error, data]] = hook.result.current
      expect(loading).toBe(true)
      expect(error).toBe(null)
      expect(data).toBe(null)
    })

    it(`passes the arguments of the callback invocation and an abort signal to the fetcher`, () => {
      expect(fetcherArgs).toMatchObject([1, 2, 3, {}])
      expect(fetcherArgs[3] instanceof AbortSignal).toBe(true)
    })

    describe(`aborting the callback while the fetcher is pending`, () => {

      beforeEach(() => {
        const {callback} = hook.result.current
        act(() => {
          callback.abort()
        })
      })

      it(`returns loading:false, error: null, data: null`, () => {
        const [, [loading, error, data]] = hook.result.current
        expect(loading).toBe(false)
        expect(error).toBe(null)
        expect(data).toBe(null)
        const abortSignal = fetcherArgs[3]
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

      it(`returns loading:false, error: null, data: expectedResult`, () => {
        const [, [loading, error, data]] = hook.result.current
        expect(loading).toBe(false)
        expect(error).toBe(null)
        expect(data).toBe(expectedResult)
      })

      describe(`aborting the callback after the fetcher is resolved`, () => {

        beforeEach(() => {
          const {callback} = hook.result.current
          act(() => {
            callback.abort()
          })
        })

        it(`returns loading:false, error: null, data: null`, () => {
          const [, [loading, error, data]] = hook.result.current
          expect(loading).toBe(false)
          expect(error).toBe(null)
          expect(data).toBe(null)
          const abortSignal = fetcherArgs[3]
          expect(abortSignal.aborted).toBe(true)
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

      it(`returns loading:false, error: expectedError, data: null`, () => {
        const [, [loading, error, data]] = hook.result.current
        expect(loading).toBe(false)
        expect(error).toBe(expectedError)
        expect(data).toBe(null)
      })

      describe(`aborting the callback after the fetcher is rejected`, () => {

        beforeEach(() => {
          const {callback} = hook.result.current
          act(() => {
            callback.abort()
          })
        })

        it(`returns loading:false, error: null, data: null`, () => {
          const [, [loading, error, data]] = hook.result.current
          expect(loading).toBe(false)
          expect(error).toBe(null)
          expect(data).toBe(null)
        })

      })

    })

  })

  describe(`when the component is unmounted`, () => {

    beforeEach(() => {
      hook.unmount()
    })

    it(`aborts the signal passed to the fetcher`, () => {
      const abortSignal = fetcherArgs[3]
      expect(abortSignal.aborted).toBe(true)
    })

  })

})