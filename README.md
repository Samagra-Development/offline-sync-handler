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
   You can find the working demo [here](https://offline-handler-demo.vercel.app)

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

### Passing callback for success 

You can pass a callback function to the request option and it will be triggered once you are connected back to the internet and api is successful.

```javascript
const { sendRequest } = useOfflineSyncContext();

          // Success Callback 
          const onSuccess = (response) => {
            console.log("callback response:",response)
          };
        
          // Function to trigger Post request
          const makePostRequest = () => {
            sendRequest({
              url: "your_url",
              method: "POST",
              data: { name, avatar },
              onSuccess, // callback to be triggered in case of success from offline queue
            }).then((response) => {
              console.log({ response});
            });
          };
```

### Clearing offline queue 

You can manually clear the offline sync queue by using `clearStoredRequests` function.

```javascript
   const { clearStoredRequests } = useOfflineSyncContext();
   clearStoredRequests()
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
    render={({ isOffline, isOnline }) => {
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

### Customizing Toast Notifications

You can customize toast notifications using the `toastConfig` prop of the `OfflineSyncProvider` component. Refer to the `react-toastify` documentation for available options.

```jsx
import { OfflineSyncProvider } from './offline-sync-provider';

const App = () => {
  // Your application components and logic
};

const toastConfig = {
  position: 'bottom-left',
  autoClose: 3000,
};

const rootElement = document.getElementById('root');
ReactDOM.render(
  <OfflineSyncProvider toastConfig={toastConfig}>
    <App />
  </OfflineSyncProvider>,
  rootElement
);
```

## Roadmaps

 * Passing callbacks functions to be triggered on request success/failure.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Issues and Contributions

If you encounter any issues or have suggestions for improvement, please [submit an issue](https://github.com/example/offline-sync-provider/issues). Contributions are welcome! Please fork the repository and create a pull request.

---

Thank you for using the Offline Sync Provider module! We hope it simplifies handling API requests and enhances the offline experience for your web application. If you have any questions or need further assistance, feel free to reach out to us. Happy coding!
