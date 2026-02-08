import axios from "axios";

const API = "http://localhost:8000/api/detect";

/* Upload + AI detection */
export async function analyzeMedia(file: File) {
  const form = new FormData();
  form.append("file", file);

  const res = await axios.post(`${API}/analyze`, form);
  return res.data;
}

/* Get digital footprint */
export async function fetchFootprint(caseId: string) {
  const res = await axios.get(`${API}/footprint/${caseId}`);
  return res.data;
}

/* Load all cases */
export async function fetchCases() {
  const res = await axios.get(`${API}/cases`);
  return res.data.cases;
}