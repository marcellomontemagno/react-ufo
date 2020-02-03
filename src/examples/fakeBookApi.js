let lastId = 1
let calls = 0

const db = {
  1: {id: 1, title: 'title 1', description: 'description 1'}
}

export const createBook = async (book) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      calls++
      if (calls !== 0 && calls % 3 === 0) {
        reject("An error occurred")
      } else {
        lastId++
        const bookWithId = {id: lastId, ...book}
        db[lastId] = {...bookWithId}
        resolve({...bookWithId})
      }
    }, getRandomInt(1000, 3000))
  })
}

export const readBooks = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Object.keys(db).map((key) => db[key]))
    }, getRandomInt(200, 600))
  })
}

export const readBook = async (id) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({...db[id]})
    }, getRandomInt(200, 600))
  })
}

export const updateBook = async ({id, title, description}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      calls++
      if (calls !== 0 && calls % 3 === 0) {
        reject("An error occurred")
      } else {
        const book = db[id]
        book.title = title
        book.description = description
        book.updatedAt = new Date()
        resolve({...book})
      }
    }, getRandomInt(1000, 3000))
  })
}

export const deleteBook = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      calls++
      if (calls !== 0 && calls % 3 === 0) {
        reject("An error occurred")
      } else {
        const book = db[id]
        delete db[id]
        resolve({...book})
      }
    }, getRandomInt(1000, 3000))
  })
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
}
