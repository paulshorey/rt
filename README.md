# Important:

See the branches of this repo. Each branch is a different state management provider.

# ...

## Features:

1. sync `counter` to and from `localStorage`
2. fetches initial data from multiple remote APIs, pieces them together into the same "slice" (Redux "reducer", RT "slice", Zustand "store", etc.)

## Limitations:

### For use in only client-side "use client" components

To be fair, React Context and most other solutions also have this limitation.

I could not get it to work on server-side. It's possible with NextJS `/pages` directory and another NPM module called `next-redux-wrapper`. But with the `/app` directory, I could not find a way to use Redux Toolkit or plain Redux hooks inside "use server" pages and components.

So, pre-fetching any data must be done inside a useEffect to avoid Hydration errors.

### Use React Query

is possible, but `useApi` is a hook, so can only be called from a Component. This is not ideal. Would be better to be able to call if from any library function.

### Sync to localStorage

Zustand allows for automatic caching to/from localStorage. This is very useful for complex states. In most state management solutions like ReduxToolkit, developer must manually handle each property. This is difficult for state properties which are objects.
