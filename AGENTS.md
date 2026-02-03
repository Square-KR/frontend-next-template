# Square Frontend Architecture Guide

## Project Overview

- **Framework**: Next.js 16.1.0 + React 19 + TypeScript
- **Package Manager**: pnpm
- **Linter/Formatter**: Biome (NOT ESLint). Config: `biome.json`
- **Styling**: CSS (`global.css`). No CSS framework currently installed.
- **Server State**: `@tanstack/react-query` v5
- **HTTP Client**: Axios (single shared instance via Gateway)
- **Validation**: Zod v4
- **Auth**: HttpOnly cookies managed by MSA Gateway (no client-side token storage)

### Commands

```bash
pnpm dev      # Start dev server
pnpm build    # Production build
pnpm lint     # Biome check
pnpm format   # Biome format
```

### Biome Config

- Indent: tabs, width 4
- Line width: 100
- Rules: recommended + `noUnusedVariables: warn`
- Import organization: auto

---

## Architecture (Feature-Sliced Design)

```
src/
├── app/          # App Layer
├── entities/     # Domain Layer
├── features/     # Feature Layer
├── processes/    # Process Layer
├── widgets/      # Widget Layer
└── shared/       # Shared Layer
```

### Dependency Direction (one-way only)

```
Shared -> Entities -> Features -> Processes -> Widgets -> App
```

A lower layer MUST NOT import from a higher layer. Entities cannot import from Features. Features cannot import from Widgets. This prevents circular dependencies.

---

### App Layer (`src/app/`)

Routing and layouts only. No business logic, no server communication.

```typescript
// src/app/layout.tsx
import "src/app/global.css";
import Providers from "src/widgets/layouts/provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Square",
    description: "Square",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}
```

### Entities Layer (`src/entities/`)

Domain definitions: API functions, Zod schemas, constants. Each entity is independent — no cross-entity imports.

**File structure per entity:**

```
src/entities/{domain}/
├── api/{domain}.api.ts
├── schema/{domain}.schema.ts
└── constants/{domain}.constants.ts
```

**Schema example:**

```typescript
import { baseResponseSchema } from "src/shared/schema/response";
import { z } from "zod";

export const userZod = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
});

export type UserSchema = z.infer<typeof userZod>;

export const userResponseZod = baseResponseSchema(userZod);
export type UserResponseSchema = z.infer<typeof userResponseZod>;
```

**API example:**

```typescript
import { SquareAxios } from "src/shared/libs/api/axios";
import {
  type UserResponseSchema,
  userResponseZod,
} from "src/entities/user/schema/user.schema";

export const getUserApi = async (id: string): Promise<UserResponseSchema> => {
  const { data } = await SquareAxios.get(`/users/${id}`);
  return userResponseZod.parse(data);
};
```

### Features Layer (`src/features/`)

Use cases that combine entities. Contains hooks, React Query definitions, and state management.

**File structure per feature:**

```
src/features/{domain}/model/
├── {domain}.hook.ts
└── query/
    ├── keys.ts
    └── {domain}.query.ts
```

**Query keys:**

```typescript
export const UserQueryKeys = {
  detail: (id: string) => ["user", id] as const,
  list: ["users"] as const,
};
```

**Query:**

```typescript
import { useQuery } from "@tanstack/react-query";
import { getUserApi } from "src/entities/user/api/user.api";
import { UserQueryKeys } from "src/features/user/model/query/keys";

export const useUserQuery = (id: string) => {
  return useQuery({
    queryKey: UserQueryKeys.detail(id),
    queryFn: () => getUserApi(id),
  });
};
```

### Processes Layer (`src/processes/`)

Multi-step flows spanning multiple features (e.g. onboarding).

### Widgets Layer (`src/widgets/`)

UI composition blocks combining features and entities.

```typescript
// src/widgets/layouts/provider/index.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
    const [queryClient] = useState(
        () => new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 1000 * 30,
                    gcTime: 1000 * 60 * 5,
                    refetchOnWindowFocus: true,
                    refetchOnReconnect: true,
                    refetchOnMount: "always",
                    retry: 1,
                },
                mutations: { retry: 0 },
            },
        }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
```

### Shared Layer (`src/shared/`)

Domain-agnostic utilities. Everything here MUST NOT depend on any entity, feature, or widget.

```
src/shared/
├── constants/
│   └── api-paths.ts              # Centralized API path constants
├── hooks/
│   ├── error/use-api-error.ts    # Standardized API error toast
│   ├── toast/use-toast.ts        # Stub — needs real implementation
│   └── next/                     # Next.js hook wrappers
├── libs/
│   ├── api/
│   │   ├── axios/                # Axios instance + response interceptor (401 refresh)
│   │   └── zod/index.ts          # Zod-parsed HTTP helpers
│   └── ui/                       # DOM utilities (Portal, scroll, etc.)
└── schema/
    ├── error/parsed/index.ts     # ErrorResponseParsedSchema
    ├── error/schema/message.ts   # Error message schema
    └── response/index.ts         # baseResponseSchema, okResponseSchema
```

---

## Server Communication

### Gateway Architecture

All API requests route through the MSA Gateway. Authentication is handled via HttpOnly cookies — the frontend never stores or reads tokens directly.

- **Base URL**: `NEXT_PUBLIC_GATEWAY_URL` environment variable
- **Credentials**: `withCredentials: true` (cookies sent automatically)
- **No Bearer header**: Gateway reads the HttpOnly cookie directly
- **Token refresh**: On 401, the interceptor calls `POST /auth/refresh` (cookie-based, no body)

### API Path Constants

All API endpoint paths are centralized in `src/shared/constants/api-paths.ts`:

```typescript
export const API_PATHS = {
    AUTH: {
        REFRESH: "/api/v1/auth/token/refresh",
    },
} as const;
```

Always add new API paths here instead of hardcoding strings in API functions or interceptors.

### Axios Instance

Single shared instance at `src/shared/libs/api/axios/index.ts`:

```typescript
export const SquareAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GATEWAY_URL,
  withCredentials: true,
});
```

Response interceptor handles 401 → cookie-based refresh → retry queue. On refresh failure, redirects to `/signin`.

### Zod-Parsed Helpers

Use these instead of raw Axios for type-safe responses (`src/shared/libs/api/zod/index.ts`):

```typescript
export const getParsed = async <S extends z.ZodTypeAny>(
  url: string,
  schema: S,
  config?: Record<string, unknown>,
): Promise<z.infer<S>> => {
  try {
    const response = await SquareAxios.get<unknown>(url, config);
    return schema.parse(response.data);
  } catch (error) {
    return parseAxiosError(error);
  }
};

// Also available: postParsed, putParsed, patchParsed, deleteParsed
```

### Response Schemas

Base response wrapper (`src/shared/schema/response/index.ts`):

```typescript
export const baseResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z
    .object({
      status: z.number(),
      message: z.string(),
      data: dataSchema.optional().nullable(),
    })
    .passthrough();

export const okResponseSchema = z
  .object({
    status: z.number(),
    message: z.string(),
  })
  .passthrough();
```

### Error Parsing

All Axios errors are normalized via `parseAxiosError` (`src/shared/libs/api/axios/parsed/index.ts`):

```typescript
export const parseAxiosError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data;
    try {
      throw ErrorResponseParsedSchema.parse(responseData);
    } catch {
      throw {
        message: "Unknown server error.",
        status: error.response?.status ?? 500,
      };
    }
  }
  throw { message: "Network error.", status: 0 };
};
```

---

## Import Paths

Always use the `src/` prefix. Configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "src/*": ["./src/*"]
    }
  }
}
```

```typescript
// Correct
import { SquareAxios } from "src/shared/libs/api/axios";
import { useToast } from "src/shared/hooks/toast/use-toast";

// Wrong — never use relative paths across layers
import { SquareAxios } from "../../shared/libs/api/axios";
```

---

## Adding a New Feature

1. **Define entity**: Create `src/entities/{domain}/` with schema, API, and constants files
2. **Create feature**: Add `src/features/{domain}/model/` with hook, query keys, and query files
3. **Compose widget** (if needed): Build UI blocks in `src/widgets/`
4. **Add route**: Create page in `src/app/{route}/page.tsx`

---

## Rules

### Do

- Validate all server responses with Zod schemas
- Use `src/` prefix for all cross-layer imports
- Keep entities independent of each other
- Use React Query for server state management
- Use Biome for linting and formatting
- Follow the FSD layer dependency direction
- Use `SquareAxios` (or Zod-parsed helpers) for all HTTP requests

### Do Not

- Import from a higher layer into a lower layer
- Use raw `axios` directly — use the parsed helpers or `SquareAxios`
- Store or read auth tokens in JavaScript (HttpOnly cookies only)
- Suppress TypeScript errors with `as any`, `@ts-ignore`, `@ts-expect-error`
- Use ESLint (this project uses Biome)
- Add empty catch blocks
- Use arbitrary magic numbers for colors, spacing, or sizing
