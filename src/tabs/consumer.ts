import { Observable } from 'rxjs/Observable';
import { Consumer } from '../common';
import { tabs } from './index';

const protectedProvidersWeakMap = new WeakMap<TabsConsumer, tabs.TabsProviderInterface>();

export class TabsConsumer extends Consumer implements tabs.TabsConsumer {

  public readonly namespace = 'tabs';

  getTabs() {
    return protectedProvidersWeakMap.get(this)!.getTabs(this.id);
  }

  getTabsObservable(): Observable<tabs.Tab[]> {
    return protectedProvidersWeakMap.get(this)!.getTabsObservable(this.id);
  }

  navToTab(tabId: string) {
    return protectedProvidersWeakMap.get(this)!.navToTab(tabId);
  }

  nav() {
    return protectedProvidersWeakMap.get(this)!.nav();
  }

  dispatchUrlInTab(tabId: string, url: string) {
    return protectedProvidersWeakMap.get(this)!.dispatchUrlInTab(tabId, url);
  }

  getTabWebContentsState(tabId: string) {
    return protectedProvidersWeakMap.get(this)!.getTabWebContentsState(tabId);
  }

  executeJavaScript(tabId: string, code: string) {
    return protectedProvidersWeakMap.get(this)!.executeJavaScript(tabId, code);
  }

  setProviderInterface(providerInterface: tabs.TabsProviderInterface) {
    protectedProvidersWeakMap.set(this, providerInterface);
  }
}
