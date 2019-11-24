import React from 'react'
import FetchEffectExample from './FetchEffectExample'
import FetchCallbackExample from "./FetchCallbackExample"
import CascadingFetchesExample from "./CascadingFetchesExample"
import DebounceFetchExample from "./DebounceFetchExample"

const Root = () => {
  return <>
    Fetch callback example:
    <br/>
    <FetchCallbackExample/>
    <br/><br/><br/>
    Fetch effect example:
    <br/>
    <FetchEffectExample/>
    <br/><br/><br/>
    Cascading fetches example:
    <br/>
    <CascadingFetchesExample/>
    <br/><br/><br/>
    Debounce fetch example:
    <br/>
    <DebounceFetchExample/>
    <br/><br/><br/>
  </>
}

export default Root
