/**
 * @class
 * @param {function} info log info output
 * @return {Tick} Instance
 */

function Graceful(info) {
  let exiting = false; // 是否正在退出
  let count = 0; // 函数执行计数器
  const callbacks = [];

  const exitHandle = async () => {
    if (exiting) {
      info("process exiting..., wait please");
      return;
    }
    exiting = true;
    // 执行事件回调函数
    for (const cb of callbacks) {
      count += 1;
      try {
        const ret = cb();
        if (ret && ret.then && ret.catch) {
          ret.then(() => (count -= 1)).catch(() => (count -= 1));
        } else {
          count -= 1;
        }
      } catch (e) {
        info(e);
        count -= 1;
      }
    }

    // 每秒一次去检测是否所有函数执行都已完毕，可以退出
    const timer = setInterval(() => {
      info(`process exit check count: ${count}`);
      if (0 < count) return;

      info("process exit check success, process exited");
      clearInterval(timer);
      process.exit(0);
    }, 1000);
  };

  process.on("SIGTERM", exitHandle);
  process.on("SIGINT", exitHandle);

  /**
   * regist event listenner for exiting
   * @memberof Graceful
   * @instance
   * @param {function} listenner
   *
   * @return {void}
   */
  const exit = listenner => {
    callbacks.push(listenner);
  };

  /**
   * Wrap the function sync version.
   * Once the be wrapped function is executed,
   * the process will not exit until the function is executed
   * @memberof Graceful
   * @instance
   * @param {function} fn will be wrapped fn
   *
   * @return {function} Be wrapped function
   */
  const runner = fn => (...args) => {
    // 当前状态正在退出，阻止执行函数
    if (exiting) throw Error("process exiting...");
    count += 1;
    try {
      const res = fn(...args);
      count -= 1;
      return res;
    } catch (e) {
      count -= 1;
      throw e;
    }
  };

  /**
   * Wrap the function asynchronous version,
   * Once the be wrapped function is executed,
   * the process will not exit until the function is executed
   * @memberof Graceful
   * @instance
   * @param {AsyncFunction} fn will be wrapped fn (asynchronous)
   *
   * @return {function} Be warpped function
   */
  const runnerAsync = fn => async (...args) => {
    // 当前状态正在退出，阻止执行函数
    if (exiting) throw Error("process exiting");
    count += 1;
    try {
      const res = await fn(...args);
      count -= 1;
      return res;
    } catch (e) {
      count -= 1;
      throw e;
    }
  };

  /**
   * The process status
   * @memberof Graceful
   * @instance
   *
   * @return {boolean} status
   */
  const enabled = () => Boolean(!exiting);

  return {
    runner,
    runnerAsync,
    enabled,
    exit
  };
}

module.exports = Graceful;
