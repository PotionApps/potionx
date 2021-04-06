import { cacheExchange } from '@urql/exchange-graphcache';

export default (schema: any) => {
  return cacheExchange({
    schema
  })
}