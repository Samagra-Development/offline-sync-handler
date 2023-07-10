import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { OfflineSyncProvider } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<OfflineSyncProvider><div>Hello</div></OfflineSyncProvider>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
