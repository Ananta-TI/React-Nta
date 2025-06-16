import axios from 'axios'

const API_URL = "https://iuehfgfmcottssdhpzsi.supabase.co/rest/v1/notes";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1ZWhmZ2ZtY290dHNzZGhwenNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzMyODksImV4cCI6MjA2NTM0OTI4OX0.ZaBLVqwMct-R8m47ZiEXJ61Ad40KJFnTJjBXg_3qq4s"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

export const notesAPI = {
    async fetchNotes() {
        const response = await axios.get(API_URL, { headers });
        return response.data;
    },

    async createNote(data) {
        const response = await axios.post(API_URL, data, { headers });
        return response.data;
    },

    async deleteNote(id) {
        await axios.delete(`${API_URL}?id=eq.${id}`, { headers });
    },

    async updateNote(id, data) {
        const response = await axios.patch(
            `${API_URL}?id=eq.${id}`,
            data,
            { headers }
        );
        return response.data;
    },
};
