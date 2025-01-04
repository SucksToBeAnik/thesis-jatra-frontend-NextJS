import { createClient } from "@/utils/supabase/client";

export type db = ReturnType<typeof createClient>;

export interface BaseQueryResult {
  success: boolean;
  message: string;
}

export interface SuccessQueryResult<T> extends BaseQueryResult {
  success: true;
  data: T;
}

export interface ErrorQueryResult extends BaseQueryResult {
  success: false;
}

export type DbQueryResult<T = undefined> =
  | SuccessQueryResult<T>
  | ErrorQueryResult;



