type Student = {
  class_id: string;
  id: string;
  student_id: string;
  attendance: {
    time_in: string | null;
    time_out: string | null;
  }[];
  students: {
    id: string;
    first_name: string;
    last_name: string;
  };
};

export type { Student };
