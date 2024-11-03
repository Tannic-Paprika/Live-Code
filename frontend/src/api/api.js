import axios from "axios";
export const runCode = async (codeDetails) => {
  const url = 'https://emkc.org/api/v2/piston/execute'
  try {
    const response = await axios.post(url, codeDetails);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}