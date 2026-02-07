import { fetchMissionRankStudents } from '../services/student-service';

export async function missionLoader() {
  const students = await fetchMissionRankStudents();
  return { students };
}
