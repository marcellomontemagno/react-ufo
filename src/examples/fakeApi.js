export function fetchUser(userId, signal) {
  return new Promise((resolve, reject) => {
    /*
    signal.onabort = () => {
      const e = new Error()
      e.name = "AbortError"
      reject(e)
    }
    */
    setTimeout(() => {
      switch (userId) {
        case 0:
          resolve({
            name: "Ringo Starr (0)"
          });
          break;
        case 1:
          resolve({
            name: "George Harrison (1)"
          });
          break;
        case 2:
          resolve({
            name: "John Lennon (2)"
          });
          break;
        case 3:
          resolve({
            name: "Paul McCartney (3)"
          });
          break;
        default:
          throw Error("Unknown user.");
      }
    }, 2000 * Math.random());
  });
}

export function fetchPosts(userId, signal) {
  return new Promise((resolve, reject) => {
    /*
    signal.onabort = () => {
      const e = new Error()
      e.name = "AbortError"
      reject(e)
    }
    */
    setTimeout(() => {
      switch (userId) {
        case 0:
          resolve([
            {
              id: 0,
              text: "I get by with a little help from my friends (0)"
            },
            {
              id: 1,
              text: "I'd like to be under the sea in an octupus's garden"
            },
            {
              id: 2,
              text: "You got that sand all over your feet"
            }
          ]);
          break;
        case 1:
          resolve([
            {
              id: 0,
              text: "Turn off your mind, relax, and float downstream (1)"
            },
            {
              id: 1,
              text: "All things must pass"
            },
            {
              id: 2,
              text: "I look at the world and I notice it's turning"
            }
          ]);
          break;
        case 2:
          resolve([
            {
              id: 0,
              text: "Living is easy with eyes closed (2)"
            },
            {
              id: 1,
              text: "Nothing's gonna change my world"
            },
            {
              id: 2,
              text: "I am the walrus"
            }
          ]);
          break;
        case 3:
          resolve([
            {
              id: 0,
              text: "Woke up, fell out of bed (3)"
            },
            {
              id: 1,
              text: "Here, there, and everywhere"
            },
            {
              id: 2,
              text: "Two of us sending postcards, writing letters"
            }
          ]);
          break;
        default:
          throw Error("Unknown user.");
      }
    }, 2000 * Math.random());
  });
}
