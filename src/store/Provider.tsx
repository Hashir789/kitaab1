'use client';

import { store } from './index';
import { Provider } from 'react-redux';
import { ViewportWatcher } from './slices/ViewportWatcher';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>
    <ViewportWatcher />
    {children}
  </Provider>;
};