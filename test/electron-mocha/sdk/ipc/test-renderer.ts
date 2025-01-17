import bxsdk, { SDK } from '@getstation/sdk';
import * as assert from 'assert';
import { ipcRenderer } from 'electron';
import { from, Subscription } from 'rxjs';
import bxSDK from '../../../../app/sdk/index';

describe('browserX SDK IPC', () => {
  let sdk: SDK;
  let sdk2: SDK;
  let sdk2ReceivedSomething = false;
  let s: Subscription;

  before(() => {
    sdk = bxsdk(
      {
        id: 'test',
        name: 'test',
      },
      bxSDK
    );
    sdk2 = bxsdk(
      {
        id: 'test2',
        name: 'test2',
      },
      bxSDK
    );

    // @ts-ignore: limitation of Symbol.observable definition
    s = from(sdk2.ipc).subscribe(() => {
      sdk2ReceivedSomething = true;
    });
  });

  after(() => {
    s.unsubscribe();
    sdk.close();
    sdk2.close();
  });

  it('should forward message generated by main to renderer', (done) => {
    // @ts-ignore: limitation of Symbol.observable definition
    const subscription = from(sdk.ipc).subscribe((value) => {
      assert.deepEqual(value, {
        testKey: 'test value',
      });
      subscription.unsubscribe();
      done();
    });
    ipcRenderer.send('test:ipc:trigger-send-from-main');
  });

  it('should forward message generated by renderer to main, but not to itself', (done) => {
    ipcRenderer.once('test:ipc:trigger-send-from-renderer', (_e: any, value: any) => {
      assert.deepEqual(value, {
        testKey: 'test value 2',
      });
      done();
    });

    // @ts-ignore: limitation of Symbol.observable definition
    const subscription = from(sdk.ipc).subscribe(() => {
      subscription.unsubscribe();
      // If this callback is called, it will be interpreted as failed because `done`
      // must not be triggered multiple times
      done();
    });

    sdk.ipc.publish({
      testKey: 'test value 2',
    });
  });

  it('should not have forwarded anything to sdk2', (done) => {
    if (sdk2ReceivedSomething) {
      done(new Error('sdk2 should not have received any message'));
    } else {
      done();
    }
  });
});
