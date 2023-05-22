import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "preact/hooks";
import { createContext } from "preact";

export type Variables = Record<string, any> | undefined;
export interface UseQueryOptions {
  variables?: Variables;
  loading?: boolean | undefined;
}
export interface QueryState {
  loading: boolean;
  error?: Record<string, any>;
  data?: Record<string, any>;
}
export interface SubscribeOptions {
  endpoint: URL;
  headers?: Headers;
}

export const debounce = (callback: (...args: any[]) => any, delay = 250) => {
  let timeoutId: number | null;
  return (...args: any[]) => {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      callback(...args);
    }, delay);
  };
};

export interface ApiContextProps {
  url: URL;
  headers: Headers;
  wss?: URL;
}

export const ApiContext = createContext<ApiContextProps | null>(null);

export const createQuery =
  (url: URL, options: RequestInit | undefined) =>
  (query: string, variables: Variables) =>
    fetch(url, {
      ...(options ?? {}),
      method: "POST",
      body: JSON.stringify({ query, variables }),
    })
      .then((r) => r.json())
      .catch((error) => ({ error }));

export const useFetch = (url: URL, options: RequestInit = {}) => {
  const [state, setState] = useState({ loading: false });
  const refetch = useCallback(
    (newOptions?: RequestInit) => {
      setState((state) => ({ ...state, loading: true }));
      fetch(url, { ...(options ?? {}), ...(newOptions ?? {}) })
        .then((r) =>
          r.headers.get("content-type")?.match(/application\/json/g)
            ? r.json()
            : r.text()
        )
        .then((data) => setState((state) => ({ ...state, data })))
        .catch((error) => setState((state) => ({ ...state, error })))
        .finally(() => setState((state) => ({ ...state, loading: false })));
    },
    [url, JSON.stringify(options)]
  );
  return { refetch, ...state };
};

export type Trigger = ({
  variables,
}?: UseQueryOptions) =>
  | { loading: boolean; error?: unknown; data?: unknown }
  | Promise<{ loading: boolean; error?: unknown; data?: unknown }>;

export const useLazyQuery = (
  query: string,
  { variables, loading = false }: UseQueryOptions = {
    variables: undefined,
    loading: false,
  }
): [Trigger, QueryState] => {
  const { url, headers } = useContext(ApiContext) ?? {};
  const [state, setState] = useState<QueryState>({ loading });
  const variablesStr =
    useMemo(() => JSON.stringify(variables), [variables]) ?? "null";
  const key = useMemo(() => {
    const entries = Object.fromEntries(headers?.entries?.() ?? []);
    return JSON.stringify({ url, headers: entries, variablesStr });
  }, [url, headers, variablesStr]);

  const trigger: Trigger = useCallback(
    ({ variables } = {}) => {
      if (!url) {
        const state = {
          loading: false,
          error: { message: "URL context not provided" },
        };
        setState(state);
        return state;
      }
      setState((s: QueryState) => ({ ...s, loading: true }));
      const queryFn = createQuery(url, { headers });
      return queryFn(query, variables ?? JSON.parse(variablesStr)).then(
        ({ data, errors: e, error } = {}) => {
          const state = { loading: false, error: error ?? e, data };
          setState(state);
          return state;
        }
      );
    },
    [query, variablesStr, key]
  );
  return [trigger, state];
};

export const noopTag = (strs: TemplateStringsArray, ...keys: string[]) =>
  strs.slice(0, strs.length - 1).reduce((p, s, i) => p + s + keys[i], "") +
  strs[strs.length - 1];

export const gql = noopTag;

const createCache = () => {
  const cache: Record<string, string> = {};
  return {
    setItem: (k: string, v: unknown) => (cache[k] = JSON.stringify(v)),
    getItem: (k: string) => {
      const item = cache[k];
      return item ? JSON.parse(item) : null;
    },
  };
};

const cache = createCache();
export const useQuery = (
  query: string,
  params?: UseQueryOptions | undefined
) => {
  const [trigger, { data, ...state }] = useLazyQuery(query, {
    ...params,
    loading: true,
  });
  useEffect(() => void trigger(), [trigger]);
  const key = JSON.stringify({ query, params });
  if (!state.loading && !state.error) cache.setItem(key, data);
  const cached = cache.getItem(key);
  return {
    ...state,
    error: state.error,
    data: cached ?? data,
    loading: cached && state.loading ? false : state.loading,
    refetch: trigger,
  };
};

export const ID = ((i) => (()=> i++))(0); // prettier-ignore

type SubscribeCallback = (args: {
  payload?:
    | { data?: Record<string, any> | undefined; errors?: Record<string, any> }
    | undefined;
}) => void;

export const createSubscribe = async ({
  endpoint,
  ...options
}: SubscribeOptions) => {
  const ws = new WebSocket(endpoint, "graphql-ws");
  await new Promise((res) =>
    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({ type: "connection_init", payload: options }));
      res(true);
    })
  );
  return {
    subscribe: (payload: unknown, callback: SubscribeCallback) => {
      const id = ID().toString();
      ws.send(JSON.stringify({ type: "start", id, payload }));
      const filter = ({ data = "{}" }) =>
        JSON.parse(data)?.id === id ? callback(JSON.parse(data)) : null;
      ws.addEventListener("message", filter);
      return () => ws.send(JSON.stringify({ type: "stop", id }));
    },
  };
};

export const useSubscription = (
  query: string,
  { variables }: UseQueryOptions = { variables: undefined }
) => {
  const { wss, headers } = useContext(ApiContext) ?? {};
  const [state, setState] = useState<QueryState>({ loading: true });
  const variablesStr = useMemo(() => JSON.stringify(variables), [variables]);

  useEffect(() => {
    setState((s) => ({ ...s, loading: !!query }));
    if (!query) return;
    if (!wss) {
      const state = {
        loading: false,
        error: { message: "WSS context not provided" },
      };
      return void setState(state);
    }
    let clearFn;
    createSubscribe({
      endpoint: wss,
      headers,
    }).then(({ subscribe }) => {
      clearFn = subscribe(
        { query, variables: JSON.parse(variablesStr) },
        ({
          payload,
          payload: { data = undefined, errors: e = undefined } = {},
        }) => {
          if (payload) setState({ loading: false, error: e, data });
        }
      );
    });
    return clearFn;
  }, [query, variablesStr]);

  return state;
};

export const gqlify = (queryOrName: string | any, args?: any) => {
  if (typeof queryOrName === "string")
    return `${queryOrName}${
      Object.entries(args).length > 0
        ? `(${JSON.stringify(args)
            .replace(/"/g, "")
            .replace(/{(.*)}/gs, "$1")})`
        : ""
    }`;
  else
    return JSON.stringify(queryOrName, null, 4)
      .replace(/"([^"]+)":(\s*true|)/g, "$1")
      .replace(/'/g, '"')
      .replace(/{(.*)}/gs, "$1");
};
