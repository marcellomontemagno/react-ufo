import {act, renderHook} from '@testing-library/react-hooks'
import {useFetcher} from "../index"

describe(`useFetcher`, () => {

  let hook
  let fetcherArgs
  let resolve
  let reject

  let initialLoading = false
  let initialError = null
  let initialData = null

  let expectedLoading = true
  let expectedError = 'anError'
  let expectedData = 'someData'

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

  it(`returns loading:false, error: null, data: null`, () => {
    const [, [loading, error, data]] = hook.result.current
    expect(loading).toBe(initialLoading)
    expect(error).toBe(initialError)
    expect(data).toBe(initialData)
  })

  describe(`invoking setRequestState with a function`, () => {

    beforeEach(() => {
      const [, requestState, setRequestState] = hook.result.current
      act(() => {
        setRequestState((r) => {
          expect(r).toBe(requestState)
          return {...r, loading: expectedLoading, error: expectedError, data: expectedData}
        })
      })
    })

    it(`changes the state accordingly`, () => {
      const [, [loading, error, data]] = hook.result.current
      expect(loading).toBe(expectedLoading)
      expect(error).toBe(expectedError)
      expect(data).toBe(expectedData)
    })

  })

  describe(`invoking setRequestState with an object`, () => {

    beforeEach(() => {
      const [, , setRequestState] = hook.result.current
      act(() => {
        setRequestState({error: expectedError, data: expectedData})
      })
    })

    it(`changes the state accordingly, and doesn't merge with state (as hooks do)`, () => {
      const [, [loading, error, data]] = hook.result.current
      expect(loading).toBe(undefined)
      expect(error).toBe(expectedError)
      expect(data).toBe(expectedData)
    })

  })

  describe(`invoking setLoading with a function`, () => {

    beforeEach(() => {
      const [, [loading], [setLoading]] = hook.result.current
      act(() => {
        setLoading((l) => {
          expect(l).toBe(loading)
          expect(l).toBe(initialLoading)
          return expectedLoading
        })
      })
    })

    it(`changes the state accordingly`, () => {
      const [, [loading, error, data]] = hook.result.current
      expect(loading).toBe(expectedLoading)
      expect(error).toBe(initialError)
      expect(data).toBe(initialData)
    })

  })

  describe(`invoking setLoading with an object`, () => {

    beforeEach(() => {
      const [, , [setLoading]] = hook.result.current
      act(() => {
        setLoading(expectedLoading)
      })
    })

    it(`changes the state accordingly`, () => {
      const [, [loading, error, data]] = hook.result.current
      expect(loading).toBe(expectedLoading)
      expect(error).toBe(initialError)
      expect(data).toBe(initialData)
    })

  })

  describe(`invoking setError with a function`, () => {

    beforeEach(() => {
      const [, [, error], [, setError]] = hook.result.current
      act(() => {
        setError((e) => {
          expect(e).toBe(error)
          expect(e).toBe(initialError)
          return expectedError
        })
      })
    })

    it(`changes the state accordingly`, () => {
      const [, [loading, error, data]] = hook.result.current
      expect(loading).toBe(initialLoading)
      expect(error).toBe(expectedError)
      expect(data).toBe(initialData)
    })

  })

  describe(`invoking setError with an object`, () => {

    beforeEach(() => {
      const [, , [, setError]] = hook.result.current
      act(() => {
        setError(expectedError)
      })
    })

    it(`changes the state accordingly`, () => {
      const [, [loading, error, data]] = hook.result.current
      expect(loading).toBe(initialLoading)
      expect(error).toBe(expectedError)
      expect(data).toBe(initialData)
    })

  })

  describe(`invoking setData with a function`, () => {

    beforeEach(() => {
      const [, [, , data], [, , setData]] = hook.result.current
      act(() => {
        setData((d) => {
          expect(d).toBe(data)
          expect(d).toBe(initialData)
          return expectedData
        })
      })
    })

    it(`changes the state accordingly`, () => {
      const [, [loading, error, data]] = hook.result.current
      expect(loading).toBe(initialLoading)
      expect(error).toBe(initialError)
      expect(data).toBe(expectedData)
    })

  })

  describe(`invoking setData with an object`, () => {

    beforeEach(() => {
      const [, , [, , setData]] = hook.result.current
      act(() => {
        setData(expectedData)
      })
    })

    it(`changes the state accordingly`, () => {
      const [, [loading, error, data]] = hook.result.current
      expect(loading).toBe(initialLoading)
      expect(error).toBe(initialError)
      expect(data).toBe(expectedData)
    })

  })

})