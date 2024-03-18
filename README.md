# Redux Toolkit + Next JS

## Features:

1. saves `counter` to `localStorage`
2. fetches initial data from multiple remote APIs, pieces them together into the same Redux Toolkit "slice" (Redux "reducer")

## Considerations - not just for this but any other state management solution:

### Limited to client-side "use client" files.

To be fair, React Context and most other solutions also have this limitation.

I could not get it to work on server-side. It's possible with NextJS `/pages` directory and another NPM module called `next-redux-wrapper`. But with the `/app` directory, I could not find a way to use Redux Toolkit or plain Redux hooks inside "use server" pages and components.

So, pre-fetching any data must be done inside a useEffect to avoid Hydration errors.

### React Query

is possible, but `useApi` is a hook, so can only be called from a Component. This is awkward.

### Sync to localStorage

is possible, but not automated. Must manually program the get/set for each property.
