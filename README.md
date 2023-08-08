**Offline Sync Provider - README**

![Offline Sync Provider](https://static.thenounproject.com/png/27953-200.png)

## Description

Offline Sync Provider is a JavaScript module designed to handle API requests in web applications with offline capabilities. It offers a robust solution to synchronize data with the server even when the device is offline and automatically retries failed requests upon reconnection. This module utilizes `axios` for making API requests and `localforage` for offline storage, ensuring data integrity and smooth synchronization.

## Installation

```bash
$ npm install --save offline-sync-handler
$ yarn add offline-sync-handler
```

## Demo
   You can find the working demo [here](https://sample-nextjs-pwa.vercel.app/)

## Usage

### Offline Sync Provider

Wrap your application with the `OfflineSyncProvider` component to enable offline sync and manage data synchronization.

```jsx
import { OfflineSyncProvider } from 'offline-sync-handler';
const App = () => {
  // Your application components and logic
};

const rootElement = document.getElementById('root');
ReactDOM.render(
  <OfflineSyncProvider>
    <App />
  </OfflineSyncProvider>,
  rootElement
);
```

### Sending API Requests

You can use the `sendRequest` function to send API requests. It handles retries in case of failure due to an unstable internet connection.
Refer to the `axios-create` documentation for available config options.

```javascript
import { useOfflineSyncContext } from from 'offline-sync-handler';
  const { sendRequest } = useOfflineSyncContext();
  const config = {
    method: 'POST',
    url: 'https://api.example.com/data',
    data: { name: 'John Doe', email: 'john@example.com' },
  };

try {
  const response = await sendRequest(config);
  console.log('API Response:', response);
} catch (error) {
  console.error('API Request failed:', error.message);
}

```

### Passing Custom Component to display during Offline

You can pass the custom component to show during offline using the `render` prop of the `OfflineSyncProvider`.

```jsx

import { OfflineSyncProvider } from './offline-sync-provider';

const App = () => {
  // Your application components and logic
};

const rootElement = document.getElementById('root');
ReactDOM.render(
  <OfflineSyncProvider
    render={({ isOnline }) => {
      return isOnline ? null : <div>I am offline</div>;
    }}
  >
    <App />
  </OfflineSyncProvider>,
  rootElement
);
```


### Track online status change to perform certain operation

You can track online status change using the `onStatusChange` prop of the `OfflineSyncProvider`.

```jsx
import { OfflineSyncProvider } from './offline-sync-provider';

const App = () => {
  // Your application components and logic
};


const rootElement = document.getElementById('root');
ReactDOM.render(
  <OfflineSyncProvider
    onStatusChange={(status)=>{
      console.log({status})
    }}
  >
    <App />
  </OfflineSyncProvider>,
  rootElement
);
```

### Usage with NextJS

You can dynamically import this package to use it with NextJs.

```jsx
export default function App({ Component, pageProps }: AppProps) {
  const [packageModule, setPackageModule] = useState<{
    OfflineSyncProvider: any | undefined;
  }>();

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const packageModule = await import("offline-sync-handler-test");
        setPackageModule(packageModule);
      } catch (error) {
        console.error("Error loading the npm package:", error);
      }
    };
    fetchPackage();
  }, []);

  if (packageModule) {
    return (
      <packageModule.OfflineSyncProvider
        render={renderOffline}
      >
        <>
          <Component {...pageProps} />
        </>
      </packageModule.OfflineSyncProvider>
    );
  }

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

```

### Passing Sync Success Callback

You can handle the Sync Success respnse by using the `onSyncSuccess` prop of the `OfflineSyncProvider`.

```jsx

export default function App({ Component, pageProps }: AppProps) {

  const onSyncSuccess = (response: any) => {
    // response consist of config and data where config is the object passed to sendRequest and data is the api response
    console.log({response});
  };

    return (
      <OfflineSyncProvider
        onSyncSuccess={onSyncSuccess}
      >
        <>
          <Component {...pageProps} />
        </>
      </OfflineSyncProvider>
    );
  }

```

## Roadmaps

 - [x] Passing callbacks functions to handle the success callback.
 - [x] Proper NextJs Support.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Issues and Contributions

If you encounter any issues or have suggestions for improvement, please [submit an issue](https://github.com/example/offline-sync-provider/issues). Contributions are welcome! Please fork the repository and create a pull request.

---

Thank you for using the Offline Sync Provider module! We hope it simplifies handling API requests and enhances the offline experience for your web application. If you have any questions or need further assistance, feel free to reach out to us. Happy coding!
