import {renderHook, act} from "@testing-library/react-hooks"
import {useEffect} from "react"
import {useFetcher} from "../index"

describe(`useFetcher, cascading`, () => {

  let fetcher1
  let resolveFetcher1
  let rejectFetcher1
  let fetcher2
  let fetcher2Args
  let resolveFetcher2
  let rejectFetcher2
  let result1
  let result2

  beforeEach(() => {
    fetcher1 = jest.fn(() => {
      return new Promise((rs, rj) => {
        resolveFetcher1 = rs
        rejectFetcher1 = rj
      })
    })
    fetcher2 = jest.fn((...args) => {
      fetcher2Args = args
      return new Promise((rs, rj) => {
        resolveFetcher2 = rs
        rejectFetcher2 = rj
      })
    })
    renderHook(() => {
      result1 = useFetcher(fetcher1, {loading: true})
      result2 = useFetcher(fetcher2, {loading: true})
      const [callback1] = result1
      const [callback2] = result2
      useEffect(() => {
        callback1().then((data) => {
          callback2(data).catch(() => undefined) //prevents the test to fail with unhandled rejection which would be intentional
        }).catch(() => undefined) //prevents the test to fail with unhandled rejection which would be intentional
      }, [callback1, callback2])
    })
  })

  describe(`given "resource 2" depends on "resource 1" and "resource 1" is not loaded yet`, () => {

    it(`only invokes the first fetcher`, () => {
      expect(fetcher1).toHaveBeenCalledTimes(1)
      expect(fetcher2).toHaveBeenCalledTimes(0)
    })

    it(`"resource 1" appears as loading`, () => {
      const [, [loading, error, data]] = result1
      expect(loading).toBe(true)
      expect(error).toBe(null)
      expect(data).toBe(null)
    })

    it(`"resource 2" appears as loading`, () => {
      const [, [loading, error, data]] = result2
      expect(loading).toBe(true)
      expect(error).toBe(null)
      expect(data).toBe(null)
    })

    describe(`resolving "resource 1"`, () => {

      const expectedResult1 = 'result1'

      beforeEach(async () => {
        await act(async () => {
          resolveFetcher1(expectedResult1)
        })
      })

      it(`invokes the second fetcher`, () => {
        expect(fetcher1).toHaveBeenCalledTimes(1)
        expect(fetcher2).toHaveBeenCalledTimes(1)
        expect(fetcher2Args[0]).toBe(expectedResult1)
      })

      it(`"resource 1" appears as loaded`, () => {
        const [, [loading, error, data]] = result1
        expect(loading).toBe(false)
        expect(error).toBe(null)
        expect(data).toBe(expectedResult1)
      })

      it(`"resource 2" appears as loading`, () => {
        const [, [loading, error, data]] = result2
        expect(loading).toBe(true)
        expect(error).toBe(null)
        expect(data).toBe(null)
      })

      describe(`resolving "resource 2"`, () => {

        const expectedResult2 = 'result'

        beforeEach(async () => {
          await act(async () => {
            resolveFetcher2(expectedResult2)
          })
        })

        it(`"resource 1" appears as loaded`, () => {
          const [, [loading, error, data]] = result1
          expect(loading).toBe(false)
          expect(error).toBe(null)
          expect(data).toBe(expectedResult1)
        })

        it(`"resource 2" appears as loaded`, () => {
          const [, [loading, error, data]] = result2
          expect(loading).toBe(false)
          expect(error).toBe(null)
          expect(data).toBe(expectedResult2)
        })

      })

      describe(`rejecting "resource 2"`, () => {

        const expectedError2 = 'error2'

        beforeEach(async () => {
          await act(async () => {
            rejectFetcher2(expectedError2)
          })
        })

        it(`"resource 2" appears in error`, () => {
          const [, [loading, error, data]] = result2
          expect(loading).toBe(false)
          expect(error).toBe(expectedError2)
          expect(data).toBe(null)
        })

      })

    })

    describe(`rejecting "resource 1"`, () => {

      const expectedError1 = 'error1'

      beforeEach(async () => {
        await act(async () => {
          rejectFetcher1(expectedError1)
        })
      })

      it(`doesn't invoke the second fetcher`, () => {
        expect(fetcher1).toHaveBeenCalledTimes(1)
        expect(fetcher2).toHaveBeenCalledTimes(0)
      })

      it(`"resource 1" appears in error`, () => {
        const [, [loading, error, data]] = result1
        expect(loading).toBe(false)
        expect(error).toBe(expectedError1)
        expect(data).toBe(null)
      })

    })

  })

})