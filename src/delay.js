if (Promise) {
  Promise.delay = function(ms, value) {
    if (ms === undefined || ms < 0) {
      return Promise.resolve(value)
    }

    if (value instanceof Promise) {
      return value.then(function(result) {
        return new Promise(function(resolve) {
          setTimeout(resolve, ms, result)
        })
      })
    }

    return new Promise(function(resolve) {
      setTimeout(resolve, ms, value)
    })
  }

  Promise.prototype.delay = function(ms) {
    return this.then(function(data) {
      if (ms === undefined || ms < 0) {
        return data
      }

      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve(data)
        }, ms)
      })
    })
  }
}
