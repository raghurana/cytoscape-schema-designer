import { StoreApi, UseBoundStore } from 'zustand';

type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  // eslint-disable-next-line prefer-const
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  // eslint-disable-next-line prefer-const, @typescript-eslint/no-explicit-any
  for (let k of Object.keys(store.getState())) (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  return store;
};
