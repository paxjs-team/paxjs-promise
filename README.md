# PaxJS Promise

Global `Promise` object improvements (zero-dependency, 1Kb).

## Why

There is a great library [`bluebird`](http://bluebirdjs.com/docs/getting-started.html), which provides a similar functionality, but often you need only part of it and it's much easier to use it as global `Promise` object methods, than import it in every module where you need it.

`paxjs-promise` works [everywhere](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Browser_compatibility) where global `Promise` object is available. In Internet Explorer it does nothing.

## Installation

Open a Terminal in your project's folder and run,

```sh
npm install paxjs-promise
```

## Usage

Import `paxjs-promise` at start of your app entry point module. After that global `Promise` object will be enhanced and its new methods will be available in all your code.

```js
import 'paxjs-promise'
```

or

```js
require('paxjs-promise')
```

If you need only part of `paxjs-promise` functionality, you can use it like this, without using the whole library.

```js
import 'paxjs-promise/delay'
import 'paxjs-promise/time'
```

### Promise.delay

The same as [`bluebird`](http://bluebirdjs.com/docs/getting-started.html) [`Promise.delay`](http://bluebirdjs.com/docs/api/promise.delay.html)

```ts
Promise.delay(
  int ms,
  [any|Promise<any> value=undefined]
) -> Promise
```

Returns a promise that will be resolved with `value` (or `undefined`) after given `ms` milliseconds. If `value` is a promise, the delay will start counting down when it is fulfilled and the returned promise will be fulfilled with the fulfillment value of the `value` promise. If `value` is a rejected promise, the resulting promise will be rejected immediately.

#### Use cases

It's often in your app UX you have states that are limited in time (e.g., request success and failure feedbacks). `Promise.delay` gives you short and neat syntax how to handle such cases.

// raw promises

```js
_onSubmit() {
  createEntity(this.state.credentials)
    .then(showSuccessMessage)
    .catch(showErrorMessage)
    .delay(1000)
    .then(hideMessage)
}
```

// async/await

```js
async _onSubmit() {
  try {
    await createEntity(this.state.credentials)

    showSuccessMessage()
  } catch(err) {
    showErrorMessage()
  } finally {
    await Promise.delay(1000)

    hideMessage()
  }
}
```

Another case is when you have additional request after your main request and you don't want to overload the app after your main request is finished to not slow down its feedback rendering. You can do like this

// raw promises

```js
_onButtonClick() {
  buyProduct(this.state.productId)
    .then(showSuccessMessage)
    .delay(1000)
    .then(sendAnaylitics)
}
```

// async/await

```js
async _onButtonClick() {
  try {
    await buyProduct(this.state.productId)

    showSuccessMessage()

    await Promise.delay(1000)

    sendAnaylitics()
  } catch(err) {
    ...
  }
}
```

You can use `Promise.delay` to execute code in next tick.

```js
async _onClick() {
  this.setState({ message: 'Hello World!' })

  await Promise.delay(0)

  console.log(this.state.message) // 'Hello World!'
}
```

is equivalent of

```js
_onClick() {
  this.setState({ message: 'Hello World!' })

  setTimeout(() => {
    console.log(this.state.message) // 'Hello World!'
  }, 0)
}
```

When you call `Promise.delay` without `ms` argument, it falls to just `Promise.resolve`

You can pass value or another promise as a second argument in `Promise.delay`.

```js
function mockCheckPermissions() {
  return Promise.delay(1000, { status: 200, message: 'OK' })
}
```

### Promise.prototype.time

```ts
Promise.prototype.time(
  [
    Object {
      min: int,
      max: int,
      timeoutMessage: String="operation timed out"
    } options
  ]
) -> Promise
```

Adds `min` and `max` time to promise. If `min` time is specified, the resulting promise will be resolved not before given milliseconds. If `min` time is specified and promise is rejected, the resulting promise will be rejected immediately. If `max` time is specified and promise takes more time to resolve, the resulting promise will be rejected with `Promise.TimeError`. `max` can't be less than `min`, else the resulting promise will be rejected immediately with `Promise.TimeError`

#### Use cases

In UX you often need to set minimum and maximum time for "in-progress" state (e.g., 300ms and 3000ms). With `Promise.prototype.time` you can do it like this

```js
async _onLoginButtonClick() {
  try {
    showInProgressState()

    await authenticate(this.state.credentials)
      .time({ min: 300, max: 3000 })

    showSuccessState()
  } catch(err) {
    console.log('err', err)

    if (err instanceof Promise.TimeError) {
      promptToTryAgain()
    } else {
      showErrorMessage()
    }
  }

}
```

In Node.js sometimes you need to limit maximum time for request to external service

```js
app.get('/user/:id/weather', function(req, res, next) {
  getUserCity(req.params.id)
    .then(city =>
      getCityWeather(city).time({
        max: 1000,
        timeoutMessage: 'Request to external service timed out.',
      })
    )
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).send(err))
    .then(next)
})
```
