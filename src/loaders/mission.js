import { fetchMissionRankStudents } from '../services/studentService';

export async function missionLoader() {
  const students = await fetchMissionRankStudents();
  return { students };
}
