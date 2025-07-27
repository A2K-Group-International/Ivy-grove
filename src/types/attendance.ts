type Student = {
  class_id: string;
  id: string;
  student_id: string;
  attendance: {
    id: string;
    time_in: string | null;
    time_out: string | null;
  }[];
  students: {
    id: string;
    first_name: string;
    last_name: string;
    parent_id: {
      id: string;
      first_name: string;
      last_name: string;
      address: string;
    } | null;
  };
};

export type { Student };
