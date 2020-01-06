import {renderHook, act} from "@testing-library/react-hooks"
import {useFetchEffect} from "../index"
import {useCallback} from "react"

describe(`useFetchEffect, cascading`, () => {

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
      result1 = useFetchEffect(fetcher1)
      //prevents the tests to fail for an unhandled rejection
      result1[1].catch(() => undefined)
      result2 = useFetchEffect(useCallback(async (signal) => {
        const resource1Data = await result1[1]
        return fetcher2(resource1Data, signal)
      }, [result1[1]]))
      //prevents the tests to fail for an unhandled rejection
      result2[1].catch(() => undefined)
    })
  })

  describe(`given "resource 2" depends on "resource 1" and "resource 1" is not loaded yet`, () => {

    it(`only invokes the first fetcher`, () => {
      expect(fetcher1).toHaveBeenCalledTimes(1)
      expect(fetcher2).toHaveBeenCalledTimes(0)
    })

    it(`"resource 1" appears as loading`, () => {
      const [[loading, error, data], , callback] = result1
      expect(loading).toBe(true)
      expect(error).toBe(null)
      expect(data).toBe(null)
      expect(typeof callback).toBe('function')
    })

    it(`"resource 2" appears as loading`, () => {
      const [[loading, error, data], , callback] = result2
      expect(loading).toBe(true)
      expect(error).toBe(null)
      expect(data).toBe(null)
      expect(typeof callback).toBe('function')
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
        const [[loading, error, data], , callback] = result1
        expect(loading).toBe(false)
        expect(error).toBe(null)
        expect(data).toBe(expectedResult1)
        expect(typeof callback).toBe('function')
      })

      it(`"resource 2" appears as loading`, () => {
        const [[loading, error, data], , callback] = result2
        expect(loading).toBe(true)
        expect(error).toBe(null)
        expect(data).toBe(null)
        expect(typeof callback).toBe('function')
      })

      describe(`resolving "resource 2"`, () => {

        const expectedResult2 = 'result'

        beforeEach(async () => {
          await act(async () => {
            resolveFetcher2(expectedResult2)
          })
        })

        it(`"resource 1" appears as loaded`, () => {
          const [[loading, error, data], , callback] = result1
          expect(loading).toBe(false)
          expect(error).toBe(null)
          expect(data).toBe(expectedResult1)
          expect(typeof callback).toBe('function')
        })

        it(`"resource 2" appears as loaded`, () => {
          const [[loading, error, data], , callback] = result2
          expect(loading).toBe(false)
          expect(error).toBe(null)
          expect(data).toBe(expectedResult2)
          expect(typeof callback).toBe('function')
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
          const [[loading, error, data], , callback] = result2
          expect(loading).toBe(false)
          expect(error).toBe(expectedError2)
          expect(data).toBe(null)
          expect(typeof callback).toBe('function')
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
        const [[loading, error, data], , callback] = result1
        expect(loading).toBe(false)
        expect(error).toBe(expectedError1)
        expect(data).toBe(null)
        expect(typeof callback).toBe('function')
      })

      it(`"resource 2" appears in error`, () => {
        const [[loading, error, data], , callback] = result2
        expect(loading).toBe(false)
        expect(error).toBe(expectedError1)
        expect(data).toBe(null)
        expect(typeof callback).toBe('function')
      })

    })

  })

})