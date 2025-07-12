import { logger, ValidationError } from './logger';

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  maxPageSize?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export function validatePagination(params: PaginationParams): Required<Pick<PaginationParams, 'page' | 'pageSize'>> {
  const page = Math.max(1, params.page || 1);
  const maxAllowed = params.maxPageSize || MAX_PAGE_SIZE;
  const pageSize = Math.min(maxAllowed, Math.max(1, params.pageSize || DEFAULT_PAGE_SIZE));

  if (page < 1) {
    throw new ValidationError('Page must be a positive integer');
  }

  if (pageSize > maxAllowed) {
    logger.warn('Page size exceeded maximum allowed', {
      requested: params.pageSize,
      max: maxAllowed,
      adjusted: pageSize,
    });
  }

  return { page, pageSize };
}

export function calculatePagination(
  page: number,
  pageSize: number,
  total: number,
): PaginationResult<never>['pagination'] {
  const totalPages = Math.ceil(total / pageSize);

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

export function getPaginationOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

export async function paginateQuery<T>(
  queryFn: (skip: number, take: number) => Promise<T[]>,
  countFn: () => Promise<number>,
  params: PaginationParams,
): Promise<PaginationResult<T>> {
  const { page, pageSize } = validatePagination(params);
  const skip = getPaginationOffset(page, pageSize);

  const [data, total] = await Promise.all([queryFn(skip, pageSize), countFn()]);

  return {
    data,
    pagination: calculatePagination(page, pageSize, total),
  };
}

// Helper for creating safe database queries with automatic pagination
export class QueryBuilder {
  private static instance: QueryBuilder;

  public static getInstance(): QueryBuilder {
    if (!QueryBuilder.instance) {
      QueryBuilder.instance = new QueryBuilder();
    }
    return QueryBuilder.instance;
  }

  private constructor() {}

  async executeWithPagination<T>(
    operation: string,
    queryFn: (skip: number, take: number) => Promise<T[]>,
    countFn: () => Promise<number>,
    params: PaginationParams,
    context?: Record<string, unknown>,
  ): Promise<PaginationResult<T>> {
    try {
      logger.debug(`Executing paginated query: ${operation}`, {
        ...context,
        requestedPage: params.page,
        requestedPageSize: params.pageSize,
      });

      const result = await paginateQuery(queryFn, countFn, params);

      logger.info(`Query executed successfully: ${operation}`, {
        ...context,
        resultCount: result.data.length,
        totalRecords: result.pagination.total,
        page: result.pagination.page,
        pageSize: result.pagination.pageSize,
      });

      return result;
    } catch (error) {
      logger.error(`Query failed: ${operation}`, context, error);
      throw error;
    }
  }

  async execute<T>(operation: string, queryFn: () => Promise<T>, context?: Record<string, unknown>): Promise<T> {
    try {
      logger.debug(`Executing query: ${operation}`, context);

      const result = await queryFn();

      logger.info(`Query executed successfully: ${operation}`, context);

      return result;
    } catch (error) {
      logger.error(`Query failed: ${operation}`, context, error);
      throw error;
    }
  }
}

export const queryBuilder = QueryBuilder.getInstance();
