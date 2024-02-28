import axios from "axios";

class NHAService {

    async postUser(firstName, lastName, email, uid) {
        try {
            const payload = { firstName, lastName, email, uid };
            console.log("ARE WE IN HERE?");
            console.log(payload);
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}users/postUser`, payload);
            return response.data;
        } catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    }

    
    async getUser(uid) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}users/${uid}`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }
}

export default new NHAService();
