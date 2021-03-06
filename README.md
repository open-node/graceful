# @open-node/graceful
Node.js process reload graceful

[![Build status](https://travis-ci.com/open-node/graceful.svg?branch=master)](https://travis-ci.org/open-node/graceful)
[![codecov](https://codecov.io/gh/open-node/graceful/branch/master/graph/badge.svg)](https://codecov.io/gh/open-node/graceful)

# Installation
<pre>npm i @open-node/graceful --save</pre>

# Usage
* your node.js process code
<pre>
const Graceful = require('@open-node/graceful');

// defined loginfo handle function
const info = console.log

const graceful = Graceful(info);

// get process status, false when existing unless will be true
const status = graceful.enabled()

// regist callback when process exit
graceful.exit(() => {
  // will be called when process exit
});

// wrap function, Once the function is executed, the process will not exit until the function is executed
const wrapped = graceful.runner(willBeWrappedFn);
wrapped(); // Once the function is executed, the process will not exit until the function is executed

// graceful.runnerAsync is the asynchronous version of runner
const wrapped = graceful.runner(willBeWrappedAsyncFn);
await wrapped(); // Once the function is executed, the process will not exit until the function is executed
</pre>



<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [Graceful][1]
    -   [Parameters][2]
    -   [exit][3]
        -   [Parameters][4]
    -   [runner][5]
        -   [Parameters][6]
    -   [runnerAsync][7]
        -   [Parameters][8]
    -   [enabled][9]

## Graceful

### Parameters

-   `info` **[function][10]** log info output

Returns **Tick** Instance

### exit

regist event listenner for exiting

#### Parameters

-   `listenner` **[function][10]**

Returns **void**

### runner

Wrap the function sync version.
Once the be wrapped function is executed,
the process will not exit until the function is executed

#### Parameters

-   `fn` **[function][10]** will be wrapped fn

Returns **[function][10]** Be wrapped function

### runnerAsync

Wrap the function asynchronous version,
Once the be wrapped function is executed,
the process will not exit until the function is executed

#### Parameters

-   `fn` **AsyncFunction** will be wrapped fn (asynchronous)

Returns **[function][10]** Be warpped function

### enabled

The process status

Returns **[boolean][11]** status

[1]: #graceful

[2]: #parameters

[3]: #exit

[4]: #parameters-1

[5]: #runner

[6]: #parameters-2

[7]: #runnerasync

[8]: #parameters-3

[9]: #enabled

[10]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function

[11]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
