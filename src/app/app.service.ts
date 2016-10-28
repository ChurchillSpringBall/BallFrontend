import {Injectable} from '@angular/core';

export type InternalStateType = {
  [key: string]: any
};

/**
 * In memory AppState controller.
 * TODO: make this work through localStorage to persist between refreshes?
 */
@Injectable()
export class AppState {
  _state: InternalStateType = {};

  constructor() {
  }

  /**
   * Return a deep clone of the state
   * @returns {any}
   */
  get state() {
    return this._state = this._clone(this._state);
  }

  /**
   * Do not allow direct mutation to the state
   * @param value
   */
  set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }

  /**
   * Get a property from the cached state
   * @param prop
   * @returns {any}
   */
  get(prop?: any) {
    // use our state getter for the clone
    const state = this.state;
    return state.hasOwnProperty(prop) ? state[prop] : state;
  }

  /**
   * Set a property in the application state
   * @param prop
   * @param value
   * @returns {any}
   */
  set(prop: string, value: any) {
    // internally mutate our state
    return this._state[prop] = value;
  }

  /**
   * Deep clone the app state
   * @param object
   * @returns {any}
   * @private
   */
  private _clone(object: InternalStateType) {
    // simple object clone
    return JSON.parse(JSON.stringify(object));
  }
}
