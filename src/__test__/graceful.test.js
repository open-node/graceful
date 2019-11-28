const Graceful = require("../../");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("Graceful", () => {
  const info = jest.fn();

  const processExit = process.exit;
  const processOn = process.on;
  it("runner", async () => {
    process.on = jest.fn(processOn.bind(process));
    const graceful = Graceful(info);
    const fn = jest.fn();
    const fnGraceful = graceful.runner(fn);

    fn.mockReturnValueOnce("return1");
    process.on.mockReturnValueOnce("mock on");

    expect(fnGraceful(1, 2, 3)).toBe("return1");
    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls.pop()).toEqual([1, 2, 3]);

    const [sigint, exitFn] = process.on.mock.calls.pop();
    expect(sigint).toBe("SIGINT");
    expect(typeof exitFn).toBe("function");
    process.on = processOn;

    expect(graceful.enabled()).toBe(true);

    // 此时触发了退出命令
    exitFn();
    expect(graceful.enabled()).toBe(false);
    expect(() => fnGraceful()).toThrow("exiting");
    expect(fn.mock.calls.length).toBe(0);
    process.exit = jest.fn();

    await sleep(1001);

    expect(process.exit.mock.calls.length).toBe(1);
    expect(process.exit.mock.calls.pop()).toEqual([0]);
    expect(() => fnGraceful()).toThrow("exiting");

    process.exit = processExit;
  });

  it("runnerAsync", async () => {
    process.on = jest.fn(processOn.bind(process));
    const graceful = Graceful(info);
    const fn = jest.fn();
    const fnGraceful = graceful.runnerAsync(fn);

    fn.mockResolvedValueOnce("return1");
    process.on.mockReturnValueOnce("mock on");

    expect(await fnGraceful(1, 2, 3)).toBe("return1");
    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls.pop()).toEqual([1, 2, 3]);

    const [sigint, exitFn] = process.on.mock.calls.pop();
    expect(sigint).toBe("SIGINT");
    expect(typeof exitFn).toBe("function");
    process.on = processOn;

    expect(graceful.enabled()).toBe(true);

    // 此时触发了退出命令
    exitFn();
    expect(graceful.enabled()).toBe(false);
    await expect(fnGraceful()).rejects.toThrow("exiting");
    expect(fn.mock.calls.length).toBe(0);
    process.exit = jest.fn();

    await sleep(1001);

    expect(process.exit.mock.calls.length).toBe(1);
    expect(process.exit.mock.calls.pop()).toEqual([0]);
    await expect(fnGraceful()).rejects.toThrow("exiting");

    process.exit = processExit;
  });

  it("runnerAsync count gt 0", async () => {
    process.on = jest.fn(processOn.bind(process));
    const graceful = Graceful(info);
    const fn = jest.fn(async () => {
      await sleep(1000);
      return 20;
    });
    const fnGraceful = graceful.runnerAsync(fn);

    process.on.mockReturnValueOnce("mock on");

    expect(await fnGraceful(1, 2, 3)).toBe(20);
    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls.pop()).toEqual([1, 2, 3]);

    const [sigint, exitFn] = process.on.mock.calls.pop();
    expect(sigint).toBe("SIGINT");
    expect(typeof exitFn).toBe("function");
    process.on = processOn;

    expect(graceful.enabled()).toBe(true);

    // 此时触发了退出命令
    fnGraceful(2, 3, 4);
    exitFn();
    expect(graceful.enabled()).toBe(false);
    await expect(fnGraceful()).rejects.toThrow("exiting");
    expect(fn.mock.calls.length).toBe(1);
    process.exit = jest.fn();

    await sleep(2020);

    expect(process.exit.mock.calls.length).toBe(1);
    expect(process.exit.mock.calls.pop()).toEqual([0]);
    await expect(fnGraceful()).rejects.toThrow("exiting");
    expect(exitFn()).toBeUndefined();
    expect(info.mock.calls.pop()[0]).toMatch("process exiting");

    process.exit = processExit;
  });

  it("exit callback", () => {
    process.on = jest.fn(processOn.bind(process));
    const exitCallback = jest.fn();
    const graceful = Graceful(info);
    const fn = jest.fn(() => 20);
    const fnGraceful = graceful.runner(fn);

    graceful.exit(exitCallback);
    process.on.mockReturnValueOnce("mock on");

    expect(fnGraceful(1, 2, 3)).toBe(20);
    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls.pop()).toEqual([1, 2, 3]);

    const [sigint, exitFn] = process.on.mock.calls.pop();
    expect(sigint).toBe("SIGINT");
    expect(typeof exitFn).toBe("function");
    process.on = processOn;

    expect(graceful.enabled()).toBe(true);

    // 此时触发了退出命令
    exitFn();

    expect(exitCallback.mock.calls.length).toBe(1);

    process.exit = processExit;
  });
});
