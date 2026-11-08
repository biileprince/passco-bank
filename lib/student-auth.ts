const STUDENT_AUTH_DOMAIN = "students.oguaa.ucc.edu.gh";

export function getStudentAuthEmail(studentId: string) {
  const normalizedId = studentId.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `${normalizedId}@${STUDENT_AUTH_DOMAIN}`;
}
