import {
  QueryClient,
  QueryClientConfig,
  environmentManager,
} from "@tanstack/react-query"
import { tanstackConfig } from "./config"

function makeQueryClient() {
  return new QueryClient(queryClientConfig)
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (environmentManager.isServer()) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: tanstackConfig,
}
