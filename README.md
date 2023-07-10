# Offline Sync Handler ☁️

Offline Sync Handler - data layer is implemented using IndexedDB allowing for offline data storage and synchronization with the server.

## Installation 📜

```sh
$ npm install --save offline-sync-handler
$ yarn add offline-sync-handler
```

## How to Use

- Wrap your application with `OfflineProvider` in `app.tsx` file.

```ts
import { OfflineSyncProvider } from 'offline-sync-handler';

const MyApp = ({ Component, pageProps, flagsmithState }) => {
  return (
    <OfflineSyncProvider>
      <Component {...pageProps} />
    </OfflineSyncProvider>
  );
};
```

- Using the `useOfflineSyncContext` hook for the offline submission of Data.

```ts
import { useOfflineSyncContext } from 'offline-sync-handler';

export default const Sample: React.FC = () => {
  const { callApi } = useOfflineSyncContext();

  const submitReview = async () => {
    callApi({
      id: 'Sample',
      body: {
        user: getCookie('username'),
        rating,
        ratingText,
      },
      endpoint: 'https://sample.com',
      method: 'post',
      authRequired: true,
    })
      .then(res => {
        if (res === 'offline') setModaleOpen(true);
      })
      .catch(err => {
        console.log({ err });
      });
  };

  return (
    <>
      <Button
        className="sumbit-button"
        onClick={submitReview}        
      />
    </>
  );
};

export default Feedback;
```

## Code of Conduct

<p align="center"><img src="https://media.giphy.com/media/qHRwTyhWIj4UU/200w_d.gif" width=35%></p>

## License

<p align="center"><img src="https://media.giphy.com/media/xUPGcJGy8I928yIlAQ/giphy.gif" width=35%></p>

## Contribute
Show your ❤️ and support by giving a ⭐. Any suggestions are welcome! Take a look at the contributing guide.

