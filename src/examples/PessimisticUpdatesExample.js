import React, {useCallback, useEffect, useState} from 'react'
import {useFetchCallback} from "react-ufo"
import * as api from "./fakeBookApi"

const Example = ({bookId}) => {

  const [readBook, [loading, error, book], [, , setBook]] = useFetchCallback(api.readBook, {loading: true})
  const [updateBook, [updating, updatingError], [, setUpdatingError]] = useFetchCallback(api.updateBook)
  let [draftBook, setDraftBook] = useState()

  useEffect(() => {
    readBook(bookId).then((book) => {
      setDraftBook(book)
    })
  }, [bookId, readBook])

  const onFieldChange = (event) => {
    const {name, value} = event.target
    setDraftBook({...draftBook, [name]: value})
  }

  const onCancelClick = () => {
    setDraftBook(book)
    setUpdatingError(null)
  }

  const onSaveClick = async () => {
    const book = await updateBook(draftBook)
    setDraftBook(book)
    setBook(book)
  }

  if (loading) {
    return "⏳ Loading..."
  }

  if (error) {
    return "😵 An error occurred"
  }

  return <>
    <fieldset disabled={updating}>
      Title: <input value={draftBook.title || ''} name="title" onChange={onFieldChange}/><br/>
      Description: <input value={draftBook.description || ''} name="description" onChange={onFieldChange}/><br/>
      {draftBook.updatedAt && <>last updated {draftBook.updatedAt.toISOString()} <br/></>}
      <button onClick={onCancelClick}>Discard unsaved changes</button>
      <br/>
      <button disabled={updating} onClick={onSaveClick}>{updating ? "Saving ⏳" : "Save"}</button>
      <br/>
      {updatingError && "😵 An error occurred while saving, please click save again to retry"}
    </fieldset>
  </>

}

const PessimisticUpdatesExample = () => {

  const [mounted, setMounted] = useState(false)

  const toggleMounted = useCallback(() => {
    setMounted((visible) => !visible)
  }, [])

  return <>
    <button onClick={toggleMounted}>Mount/unmount example</button>
    <br/>
    {mounted && <Example bookId={1}/>}
  </>

}

export default PessimisticUpdatesExample