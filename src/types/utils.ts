import type { Database } from "./database";

export type TableName = keyof Database["public"]["Tables"];
type ColumnName<T extends TableName> =
  keyof Database["public"]["Tables"][T]["Row"];
type ColumnValue<
  T extends TableName,
  C extends ColumnName<T>
> = Database["public"]["Tables"][T]["Row"][C];
type TableColumns<T extends TableName> = Database["public"]["Tables"][T]["Row"];

interface PaginateParams<T extends TableName> {
  key: T;
  page?: number;
  pageSize?: number;
  query?: Partial<TableColumns<T>>;
  filters?: {
    gte?: Partial<TableColumns<T>>;
    lte?: Partial<TableColumns<T>>;
    ilike?: Partial<Record<ColumnName<T>, string>>;
    is?: Partial<TableColumns<T>>;
    eq?:
      | { column: ColumnName<T>; value: ColumnValue<T, ColumnName<T>> }
      | Array<{ column: ColumnName<T>; value: ColumnValue<T, ColumnName<T>> }>;
    id?: Array<TableColumns<T>["id"]>;
    in?: { column: ColumnName<T>; value: Array<ColumnValue<T, ColumnName<T>>> };
    not?: {
      column: ColumnName<T>;
      operator: string;
      value: ColumnValue<T, ColumnName<T>>;
    };
    or?: Array<{
      column: ColumnName<T>;
      operator: string;
      value: ColumnValue<T, ColumnName<T>>;
    }>;
    active?: "active" | "inactive" | "all";
  };
  order?: Array<{ column: ColumnName<T>; ascending: boolean }>;
  select?: string;
}

interface PaginateResult<T> {
  items: T[];
  currentPage: number;
  nextPage: boolean;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

type ImageLoaderType = {
  src: string;
  alt?: string;
  className?: string;
};

export type { PaginateParams, PaginateResult, ImageLoaderType };
