
declare var require: any;
const CrossStorage = require("cross-storage");

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storage: any;
  _isConnected: boolean = false;
  _onConnectCallbacks: any = [];
  set: any;
  get: any;
  async initStorage(crossStorageUrl: string) {
    var self = this;
    self.storage = new CrossStorage.CrossStorageClient(crossStorageUrl);
    /* on init */
    try {
      await self.storage.onConnect()
      /* switch is connected flag */
      self._isConnected = true;
      /* call all connected callbacks */
      self._onConnectCallbacks.forEach((f: any) => {
        f.apply(null, []);
      });
    } catch (err) {
      self._onConnectCallbacks.forEach((f: any) => {
        f.apply(null, [err]);
      });
    }


    /* Storage Operations */
    self.set = (k: any, v: any) => {
      console.log("setted", this._isConnected)
      if (!this._isConnected) return this.set(k, v);
      if (typeof v === 'string') {
        localStorage.setItem(k, v)
        return self.storage.set(k, v);
      } else {
        localStorage.setItem(k, JSON.stringify(v))
        return self.storage.set(k, JSON.stringify(v));
      }
    };
    self.get = (k: any) => {
      return self.storage.get(k) || localStorage.getItem(k);
    };
  }
}
