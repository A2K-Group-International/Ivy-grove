import { supabase } from "@/lib/supabase";
import type { TableName, Tables } from "@/types/database";
import type { PaginateParams, PaginateResult } from "@/types/utils";

export const paginate = async <T extends TableName, R = Tables<T>>({
  key,
  page = 1,
  pageSize = 10,
  query = {},
  filters = {},
  order = [],
  select = "*",
}: PaginateParams<T>): Promise<PaginateResult<R>> => {
  const from: number = (page - 1) * pageSize;
  const to: number = from + pageSize - 1;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const applyAllFiltersToQueryBuilder = (queryBuilderInstance: any) => {
    let currentQuery = queryBuilderInstance;

    // Apply .match() filter
    if (Object.keys(query).length > 0) {
      currentQuery = currentQuery.match(query);
    }

    // Apply gte and lte filters
    if (filters.gte) {
      for (const [column, value] of Object.entries(filters.gte)) {
        currentQuery = currentQuery.gte(column, value);
      }
    }
    if (filters.lte) {
      for (const [column, value] of Object.entries(filters.lte)) {
        currentQuery = currentQuery.lte(column, value);
      }
    }
    // Apply ilike filters
    if (filters.ilike) {
      for (const [column, value] of Object.entries(filters.ilike)) {
        currentQuery = currentQuery.ilike(column, `%${value}%`);
      }
    }
    if (filters.is) {
      for (const [column, value] of Object.entries(filters.is)) {
        currentQuery = currentQuery.is(column, value);
      }
    }
    // Apply eq filters
    if (filters.eq) {
      if (Array.isArray(filters.eq)) {
        filters.eq.forEach(({ column, value }) => {
          currentQuery = currentQuery.eq(column as string, value);
        });
      } else {
        const { column, value } = filters.eq;
        currentQuery = currentQuery.eq(column as string, value);
      }
    }
    // Apply 'id' as a specific 'in' filter (if filters.id is an array)
    if (filters.id && Array.isArray(filters.id)) {
      currentQuery = currentQuery.in("id", filters.id);
    }
    // Apply general 'in' filters
    if (filters.in) {
      // Expects { column: 'colName', value: ['val1', 'val2'] }
      const { column, value } = filters.in;
      if (Array.isArray(value)) {
        currentQuery = currentQuery.in(column as string, value);
      }
    }
    // Apply 'not' filters
    if (filters.not) {
      // Expects { column, operator, value } e.g. { column: 'status', operator: 'eq', value: 'archived' }
      const { column, operator, value } = filters.not;
      currentQuery = currentQuery.not(column as string, operator, value);
    }
    // Apply 'or' filters
    if (filters.or && Array.isArray(filters.or) && filters.or.length > 0) {
      const orFiltersString = filters.or
        .map((orFilter) => {
          // Ensure orFilter has column, operator, value
          if (
            orFilter.column &&
            orFilter.operator &&
            typeof orFilter.value !== "undefined"
          ) {
            return `${String(orFilter.column)}.${orFilter.operator}.${
              orFilter.value
            }`;
          }
          console.warn("Invalid 'or' filter object:", orFilter);
          return null;
        })
        .filter(Boolean) // Remove any nulls from invalid filter objects
        .join(",");
      if (orFiltersString) {
        currentQuery = currentQuery.or(orFiltersString);
      }
    }

    // Apply is_confirmed filter (specific logic from original code)
    // Consider making this a standard eq filter passed from the service
    if (filters.active && filters.active !== "all") {
      const isConfirmed = filters.active === "active";
      currentQuery = currentQuery.eq("is_confirmed", isConfirmed);
    }

    return currentQuery;
  };

  // Initialize query for paginated items
  let supabaseQuery = supabase.from(key).select(select);
  supabaseQuery = applyAllFiltersToQueryBuilder(supabaseQuery);

  // Apply ordering (only for data query)
  if (order.length > 0) {
    order.forEach(({ column, ascending }) => {
      supabaseQuery = supabaseQuery.order(column as string, { ascending });
    });
  }
  // Apply range (only for data query)
  supabaseQuery = supabaseQuery.range(from, to);

  // Initialize query for total count - use same select for count to ensure filters work
  let countQuery = supabase
    .from(key)
    .select(select, { count: "exact", head: true });
  countQuery = applyAllFiltersToQueryBuilder(countQuery);

  const { count, error: countError } = await countQuery;
  if (countError) {
    console.error("Supabase count query error:", {
      message: countError.message,
      details: countError.details,
      key,
      query,
      filters,
    });
    throw countError;
  }

  const { data: items, error: itemsError } = await supabaseQuery;
  if (itemsError) {
    console.error("Supabase items query error:", {
      message: itemsError.message,
      details: itemsError.details,
      key,
      query,
      filters,
      select,
      order,
      from,
      to,
    });
    throw itemsError;
  }

  const totalPages: number = Math.ceil((count || 0) / pageSize);
  const nextPage: boolean = page < totalPages;

  return {
    items: items as R[],
    currentPage: page,
    nextPage,
    totalPages,
    pageSize,
    totalItems: count || 0,
  };
};
