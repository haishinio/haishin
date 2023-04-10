import type { ParsedUrlQuery } from "querystring"

export interface UrlQuery extends ParsedUrlQuery {
  url: string
}

export default UrlQuery
