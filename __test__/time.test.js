/**
 *
 *  Promise.prototype.time(
 *    [
 *      Object {
 *        min: int,
 *        max: int,
 *        timeoutMessage: String="operation timed out"
 *      } options
 *    ]
 *  ) -> Promise
 *
 */

require('../src/time.js')

test('Promise.prototype.time invoked with "min" option sets minimum time on promise chain.', () => {
  const baseTime = Date.now()
  const promise = new Promise(resolve => setTimeout(resolve, 1000))

  return promise.time({ min: 2000 }).then(() => {
    const passedTime = Date.now() - baseTime

    expect(passedTime).toBeGreaterThan(1990)
  })
})

test('Promise.prototype.time invoked with "min" option doesn\'t limit maximum time of promise chain.', () => {
  const baseTime = Date.now()
  const promise = new Promise(resolve => setTimeout(resolve, 1000))

  return promise.time({ min: 500 }).then(() => {
    const passedTime = Date.now() - baseTime

    expect(passedTime).toBeGreaterThan(990)
  })
})

test('Promise.prototype.time invoked with "max" option rejects promise chain if it takes more than "max" time to resolve.', () => {
  const baseTime = Date.now()
  const promise = new Promise(resolve => setTimeout(resolve, 1000))

  return promise.time({ max: 500 }).catch(() => {
    const passedTime = Date.now() - baseTime

    expect(passedTime).toBeGreaterThan(490)
    expect(passedTime).toBeLessThan(550)
  })
})

test('Promise.prototype.time invoked with "max" option rejects promise chain with Promise.TimeError.', () => {
  const promise = new Promise(resolve => setTimeout(resolve, 1000))

  return promise.time({ max: 500 }).catch(err => {
    expect(err).toBeInstanceOf(Promise.TimeError)
  })
})

test('Promise.prototype.time invoked with "max" option rejects promise chain with error with message equal to "timeoutMessage" option.', () => {
  const promise = new Promise(resolve => setTimeout(resolve, 1000))

  return promise
    .time({ max: 500, timeoutMessage: 'Custom timeout message.' })
    .catch(err => {
      expect(err).toBeInstanceOf(Promise.TimeError)
      expect(err.message).toEqual('Custom timeout message.')
    })
})

test('Promise.prototype.time invoked with "min" and "max" options rejects immediately if "max" is less than "min".', () => {
  const baseTime = Date.now()
  const promise = new Promise(resolve => setTimeout(resolve, 1000))

  return promise.time({ min: 200, max: 100 }).catch(err => {
    const passedTime = Date.now() - baseTime

    expect(passedTime).toBeLessThan(50)

    expect(err).toBeInstanceOf(Promise.TimeError)
    expect(err.message).toEqual(
      "operation max time can't be less than min time"
    )
  })
})
