import Suspend from "./Suspend"

const awaitResource = ([loading, error, data]) => {
  if (loading || error) {
    throw Suspend
  }
  return data
}

export default awaitResource