# @open-node/graceful
make the error object with custom defines

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
