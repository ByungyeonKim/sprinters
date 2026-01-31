import { supabase } from '../lib/supabase';

export async function missionLoader() {
  const { data: students, error } = await supabase.from('students').select(`
      *,
      mission_completions (
        missions (id, title)
      )
    `);

  if (error) {
    throw new Error('데이터를 불러오는데 실패했습니다.');
  }

  const sortedStudents = students
    .map((student) => {
      const lastCompletion = student.mission_completions.at(-1);
      const currentTitle = lastCompletion
        ? lastCompletion.missions.title
        : null;

      return {
        ...student,
        mission: student.mission_completions.length,
        currentTitle,
      };
    })
    .sort((a, b) => {
      if (b.mission !== a.mission) {
        return b.mission - a.mission;
      }
      return a.name.localeCompare(b.name, 'ko');
    });

  return { students: sortedStudents };
}
