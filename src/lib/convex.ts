/**
 * Safe Convex helpers that work even when VITE_CONVEX_URL is not set.
 * When the URL is missing the query returns `undefined` and mutations
 * are replaced with a no-op so the app renders without crashing.
 */
import {
  useQuery as _useQuery,
  useMutation as _useMutation,
} from 'convex/react'
import type { FunctionReference } from 'convex/server'

export const isConvexConfigured = !!import.meta.env.VITE_CONVEX_URL

// Re-export raw hooks for pages that always have Convex available.
export { _useQuery as useConvexQuery, _useMutation as useConvexMutation }

/**
 * Safe query — returns `undefined` when Convex is not configured.
 * This avoids calling Convex React hooks without a provider.
 */
export function useSafeQuery<Q extends FunctionReference<'query'>>(
  queryRef: Q,
  args?: Q['_args']
): Q['_returnType'] | undefined {
  if (!isConvexConfigured) {
    return undefined
  }
  return _useQuery(queryRef as any, args as any) as Q['_returnType'] | undefined
}

/**
 * Safe mutation — returns a no-op async function when Convex is not
 * configured so pages don't crash during development without a backend.
 */
export function useSafeMutation<M extends FunctionReference<'mutation'>>(
  mutationRef: M
): (args: M['_args']) => Promise<M['_returnType']> {
  if (!isConvexConfigured) {
    return async (_args: M['_args']): Promise<M['_returnType']> => undefined as M['_returnType']
  }
  return _useMutation(mutationRef as any) as (args: M['_args']) => Promise<M['_returnType']>
}
