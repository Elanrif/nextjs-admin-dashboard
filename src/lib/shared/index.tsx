import { ApiError } from "./api-error";
import { PageResponse, Result } from "./types";

export const MAX_EXPORT_SIZE = 1000;

export function unwrapList<T>(result: Result<PageResponse<T>, ApiError>): T[] {
  return result.ok ? result.data.content : [];
}
