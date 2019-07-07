/**
 *
 *  Promise.delay(
 *    int ms,
 *    [any|Promise<any> value=undefined]
 *   ) -> Promise
 *
 */

require('../src/delay.js')

test('Promise.delay delay time is greater than "ms" argument.', () => {
  const baseTime = Date.now()

  return Promise.delay(1000).then(() => {
    const passedTime = Date.now() - baseTime

    expect(passedTime).toBeGreaterThan(990)
  })
})

test('Promise.delay resolved result is equal to "value" argument.', () => {
  const baseTime = Date.now()

  return Promise.delay(1000, 'PaxJS').then(result => {
    const passedTime = Date.now() - baseTime

    expect(passedTime).toBeGreaterThan(990)
    expect(result).toEqual('PaxJS')
  })
})

test('If Promise.delay "value" argument is a promise, the delay will start counting down when it is fulfilled and the returned promise will be fulfilled with the fulfillment value of the "value" promise.', () => {
  const baseTime = Date.now()

  Promise.delay(1000, Promise.delay(500, 'PaxJS')).then(result => {
    const passedTime = Date.now() - baseTime

    expect(passedTime).toBeGreaterThan(1490)
    expect(result).toEqual('PaxJS')
  })
})

test('If Promise.delay "value" argument is a rejected promise, the resulting promise will be rejected immediately.', () => {
  const baseTime = Date.now()

  Promise.delay(1000, Promise.reject('PaxJS')).catch(error => {
    const passedTime = Date.now() - baseTime

    expect(passedTime).toBeLessThan(20)
    expect(error).toEqual('PaxJS')
  })
})

test('Promise.prototype.delay delays resolving promise chain with "ms" value.', () => {
  let baseTime

  return Promise.resolve()
    .then(() => {
      baseTime = Date.now()
    })
    .delay(1000)
    .then(() => {
      const passedTime = Date.now() - baseTime

      expect(passedTime).toBeGreaterThan(990)
    })
})

test('Promise.prototype.delay resolves promise chain result after delay.', () =>
  Promise.resolve('PaxJS')
    .delay(1000)
    .then(result => {
      expect(result).toEqual('PaxJS')
    }))
