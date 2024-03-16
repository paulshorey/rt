# Redux Store in Next JS 13

![cover.png](/resources/cover.png)

## Example Repository

Github (Redux Store initialled):

### Technology

- Redux
- Nexjs 13.2.4 ( Most stable version I have try)

### Initialize Project

1. We create the app by create next app command

```bash
npx create-next-app@13.2.4 my-project --typescript --eslint
npm i @reduxjs/toolkit react-redux

```

1. Confirm we are enabled **app Dir.**

```tsx
// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
```

1. Create Features userSlice in features folder

   ```tsx
   // /src/features/user/userSlice.ts

   import { createSlice } from "@reduxjs/toolkit";
   import type { PayloadAction } from "@reduxjs/toolkit";
   import type { RootState } from "@/lib/store";

   // Define a type for the slice state
   interface userState {
     value: number;
   }

   // Define the initial state using that type
   const initialState: userState = {
     value: 0,
   };

   export const userSlice = createSlice({
     name: "user",
     // `createSlice` will infer the state type from the `initialState` argument
     initialState,
     reducers: {
       increment: (state) => {
         state.counter += 1;
       },
       decrement: (state) => {
         state.counter -= 1;
       },
       // Use the PayloadAction type to declare the contents of `action.payload`
       incrementByAmount: (state, action: PayloadAction<number>) => {
         state.counter += action.payload;
       },
     },
   });

   export const { increment, decrement, incrementByAmount } = userSlice.actions;

   // Other code such as selectors can use the imported `RootState` type
   export const selectCount = (state: RootState) => state.user.counter;

   export default userSlice.reducer;
   ```

1. Create Folder store.ts and hooks.ts in lib folder

```tsx
// /src/lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/features/user/userSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
```

```tsx
// lib/hooks.ts
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

1. Create Provider

   In Nextjs 13, app dir is using server side components by Default, Redux is a Client side globe state manage tools, add “use client” will make the code run in client side and prevent errors.

   ```tsx
   // components/redux-provider.tsx

   "use client";

   import { store } from "@/lib/store";
   import React, { ReactNode } from "react";
   import { Provider } from "react-redux";

   type ReduxProviderType = {
     children: ReactNode;
   };

   function ReduxProvider({ children }: ReduxProviderType) {
     return <Provider store={store}>{children}</Provider>;
   }

   export default ReduxProvider;
   ```

2. Folder Structure

```jsx
// Folder Structure
.
+-- _config.yml
+-- src
|   +-- app
|      +-- page.tsx
|      +-- layout.tsx
|   +-- components
|   +-- features
|      +-- user
|         +--userSlice.tsx
|   +-- libs
|      +-- hooks.tsx
|      +-- store.tsx
+-- next.config.js
+-- package.json
+-- tsconfig.json
```

1. We want to keep the benefit of server side render, since we only will use “use client”, in the small component.

```tsx
// src/app/page.tsx

import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import user from "@/features/user/user"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={styles.main}>
     <nav>

			{/* we use serverside page and only import small client side component*/}
			<user />
    </main>
  )
}
```

```tsx
// src/features/user/user.tsx

"use client";
import React from "react";
import type { RootState } from "@/lib/store";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "./userSlice";

function user() {
  const count = useSelector((state: RootState) => state.user.counter);
  const dispatch = useDispatch();

  return (
    <div className="w-full ">
      <div className="flex justify-center gap-5">
        <button className="border-1px" aria-label="Increment value" onClick={() => dispatch(increment())}>
          Increment
        </button>
        <span>{count}</span>
        <button aria-label="Decrement value" onClick={() => dispatch(decrement())}>
          Decrement
        </button>
      </div>
    </div>
  );
}

export default user;
```

Example and demo:

it indicate the how is the server side and client side components work.

![cover-border.png](/resources/cover-border.png)
