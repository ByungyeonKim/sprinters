import { supabase } from '../../lib/supabase';

// 학생 조회/정렬/현재 미션 계산 로직

const studentMissionSelect = `
  *,
  mission_completions (
    missions (id, title)
  )
`;

function formatStudent(student) {
  const completions = student.mission_completions ?? [];
  const lastCompletion = completions.at(-1);

  return {
    ...student,
    mission: completions.length,
    currentTitle: lastCompletion ? lastCompletion.missions.title : null,
  };
}

function sortStudentsByMission(students) {
  return students.sort((a, b) => {
    if (b.mission !== a.mission) {
      return b.mission - a.mission;
    }
    return a.name.localeCompare(b.name, 'ko');
  });
}

export async function fetchMissionRankStudents() {
  const { data: students, error } = await supabase
    .from('students')
    .select(studentMissionSelect);

  if (error) {
    throw new Error('학생 데이터를 불러오는데 실패했습니다.');
  }

  return sortStudentsByMission(students.map(formatStudent));
}
