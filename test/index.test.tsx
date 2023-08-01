import * as React from 'react';
import { OfflineSyncProvider, useOfflineSyncContext } from '../src';

import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

describe('OfflineSyncProvider', () => {
  let container: HTMLDivElement | null = null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container !== null) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  it('renders children and ToastContainer', () => {
    act(() => {
      render(
        <OfflineSyncProvider>
          <div>Test Children</div>
        </OfflineSyncProvider>,
        container
      );
    });

    expect(container?.textContent).toContain('Test Children');
    expect(container?.querySelector('.ToastContainer')).toBeTruthy();
  });

  it('renders children with render prop', () => {
    act(() => {
      render(
        <OfflineSyncProvider
          render={({ isOnline }) => (
            <div>
              Test Children with render prop. isOnline:{' '}
              {isOnline ? 'true' : 'false'}
            </div>
          )}
        >
          <div>Hello</div>
        </OfflineSyncProvider>,
        container
      );
    });

    expect(container?.textContent).toContain('Test Children with render prop');
  });

  it('provides context value to children', () => {
    const ChildComponent = () => {
      const { data, setData, sendRequest } = useOfflineSyncContext();
      return (
        <div>
          Test Child Component. Data: {JSON.stringify(data)}. setData: {setData}
          . sendRequest: {sendRequest}
        </div>
      );
    };

    act(() => {
      render(
        <OfflineSyncProvider>
          <ChildComponent />
        </OfflineSyncProvider>,
        container
      );
    });

    expect(container?.textContent).toContain('Test Child Component');
  });

  // You can write more tests for other functions, event handlers, and edge cases
});
