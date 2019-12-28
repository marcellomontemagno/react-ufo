const awaitResource = ([loading, error, data]) => {
  if (loading) {
    throw {name: 'Suspend', cause: 'loading'}
  }
  if (error) {
    throw {name: 'Suspend', cause: 'error'}
  }
  return data
}

export default awaitResource