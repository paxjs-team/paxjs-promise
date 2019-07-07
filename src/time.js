if (Promise) {
  Promise.TimeError = function TimeError(msg) {
    this.message = msg
    this.name = 'TimeError'

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    } else {
      Error.call(this)
    }
  }

  Promise.TimeError.prototype = Object.create(Error.prototype)

  Promise.prototype.time = function(options) {
    var minTimePromise

    if (
      options === null ||
      typeof options !== 'object' ||
      (!options.min && !options.max)
    ) {
      return this
    }

    if (options.min > options.max) {
      return Promise.reject(
        new Promise.TimeError("operation max time can't be less than min time")
      )
    }

    if (options.min >= 0) {
      minTimePromise = Promise.all([
        this,

        new Promise(function(resolve) {
          setTimeout(resolve, options.min)
        }),
      ]).then(function(result) {
        return result[0]
      })
    } else {
      minTimePromise = this
    }

    if (options.max >= 0) {
      return new Promise(function(resolve, reject) {
        var maxTimeoutId = setTimeout(function() {
          reject(
            new Promise.TimeError(
              options.timeoutMessage || 'operation timed out'
            )
          )
        }, options.max)

        minTimePromise
          .then(function(result) {
            clearTimeout(maxTimeoutId)

            resolve(result)
          })
          .catch(function(err) {
            clearTimeout(maxTimeoutId)

            reject(err)
          })
      })
    } else {
      return minTimePromise
    }
  }
}
