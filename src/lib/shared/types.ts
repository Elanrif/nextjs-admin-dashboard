export type PageResponse<T> = {
  content: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
};

/** Discriminated union for API responses — use `res.ok` to narrow. */
export type Result<T, E> =
  | {
      ok: true;
      data: T;
    }
  | { ok: false; error: E };
