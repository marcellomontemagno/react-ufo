import React, {useCallback, useEffect, useState} from 'react'
import {useFetcher} from "react-ufo"
import * as api from "./fakeBookApi"

const emptyBook = {title: '', description: ''}

const Example = () => {

  const [editId, setEditId] = useState()
  const [readBooks, [fetching, fetchingError, books], [, , setBooks]] = useFetcher(api.readBooks, {loading: true})
  const [createBook, [creating, creatingError], [, setCreatingError]] = useFetcher(api.createBook)
  const [updateBook, [updating, updatingError], [, setUpdatingError]] = useFetcher(api.updateBook)
  let [draftBook, setDraftBook] = useState(emptyBook)

  useEffect(() => {
    readBooks()
  }, [readBooks])

  const isCreating = editId === -1
  const isEditing = editId >= 0
  const upserting = creating || updating
  const upsertingError = creatingError || updatingError

  const cleanErrors = () => {
    setCreatingError(null)
    setUpdatingError(null)
  }

  const onFieldChange = (event) => {
    const {name, value} = event.target
    setDraftBook({...draftBook, [name]: value})
  }

  const onCancelClick = () => {
    setEditId(undefined)
    setDraftBook(emptyBook)
  }

  const onCreateClick = () => {
    cleanErrors()
    setEditId(-1)
    setDraftBook(emptyBook)
  }

  const onBookDelete = (book) => {
    setEditId(undefined);
    const bookId = book.id
    setBooks((books) => books.filter(({id}) => id !== bookId))
  }

  const onEditClick = (bookId) => {
    cleanErrors()
    setEditId(bookId)
    setDraftBook(books.find(({id}) => id === bookId))
  }

  const onResetClick = (bookId) => {
    cleanErrors()
    const book = books.find(({id}) => id === bookId)
    setDraftBook(book || emptyBook)
  }

  const onSaveClick = async () => {
    let book
    if (isCreating) {
      book = await createBook(draftBook)
      setBooks([...books, book])
    } else {
      book = await updateBook(draftBook)
      const bookIndex = books.findIndex(({id}) => id === book.id)
      const newBooks = books.slice()
      newBooks[bookIndex] = book
      setBooks(newBooks)
    }
    setEditId(undefined)
  }

  if (fetching) {
    return "⏳ Loading..."
  }

  if (fetchingError) {
    return "😵 An error occurred"
  }

  return <>
    {(isCreating || isEditing) && <fieldset disabled={upserting}>
      {isCreating && <> - Creating new book <br/></>}
      {isEditing && <> - Editing book [{books.find(({id}) => id === editId).title}] <br/></>}
      Title: <input value={draftBook.title} name="title" onChange={onFieldChange}/><br/>
      Description: <input value={draftBook.description} name="description" onChange={onFieldChange}/><br/>
      {draftBook.updatedAt && <>last updated {draftBook.updatedAt.toISOString()} <br/></>}
      <button onClick={() => onResetClick(editId)}>reset changes</button>
      <button onClick={onCancelClick}>cancel</button>
      <button disabled={upserting} onClick={onSaveClick}>{upserting ? "Saving ⏳" : "Save"}</button>
      {upsertingError && "😵 An error occurred while saving, please click save again to retry"}
    </fieldset>}
    {books.length === 0 && <div>You have no books...</div>}
    {books.map(({id, title}) => {
      return <div key={id}>
        {title}
        <button onClick={() => onEditClick(id)}>edit</button>
        <BookDelete bookId={id} onBookDelete={onBookDelete}/>
      </div>
    })}
    {!isCreating && <button onClick={onCreateClick}>create</button>}
  </>

}

const BookDelete = ({bookId, onBookDelete}) => {
  const [deleteBook, [deleting, deletingError], [, setDeletingError]] = useFetcher(api.deleteBook)
  const onDeleteClick = async () => {
    const book = await deleteBook(bookId)
    onBookDelete(book)
  }
  return <>
    <button disabled={deleting} onClick={() => onDeleteClick(bookId)}>delete</button>
    {deletingError && <>
      😵 An error occurred while deleting, please click delete again to retry or
      <button onClick={() => setDeletingError(null)}>clear this message</button>
    </>}
  </>
}

const CrudExample = () => {

  const [mounted, setMounted] = useState(false)

  const toggleMounted = useCallback(() => {
    setMounted((visible) => !visible)
  }, [])

  return <>
    <button onClick={toggleMounted}>Mount/unmount example</button>
    <br/>
    {mounted && <Example/>}
  </>

}

export default CrudExample