import { paginate } from "@/utils/paginate";
import type { PaginateResult } from "@/types/paginate";

export type UserRole = "admin" | "teacher" | "parent";

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  contact: string;
  address: string;
}

export class UserService {
  /**
   * Fetch parents
   */
  static async fetchParents(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginateResult<UserProfile>> {
    return paginate<"users", UserProfile>({
      key: "users",
      page,
      pageSize,
      filters: {
        eq: { column: "role", value: "parent" },
      },
      order: [{ column: "first_name", ascending: true }],
    });
  }

  /**
   * Fetch teachers
   */
  static async fetchTeachers(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginateResult<UserProfile>> {
    return paginate<"users", UserProfile>({
      key: "users",
      page,
      pageSize,
      filters: {
        eq: { column: "role", value: "teacher" },
      },
      order: [{ column: "first_name", ascending: true }],
    });
  }
}
