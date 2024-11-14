import axios from "axios";
export const runCode = async (codeDetails) => {
  const url = 'https://live-code-backend-ezzk.onrender.com'
  try {
    const response = await axios.post(url, codeDetails);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
