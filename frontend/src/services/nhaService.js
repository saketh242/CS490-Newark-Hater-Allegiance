import axios from "axios";

class NHAService {

    async postUser(firstName, lastName, email, token) {
        try {
            const payload = { firstName, lastName, email};
            const headers = {
                Authorization: `Bearer ${token}`
            };
            console.log("ARE WE IN HERE?");
            console.log(payload);
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}users/postUser`, payload, {headers});
            return response.data;
        } catch (error) {
            console.error('Error posting user: ', error);
            throw error;
        }
    }

    async postHistory(user, inputCode, translateCode, sourceLanguage, desiredLanguage) {
        try {
            const user_id = await this.getUser(user);
            const idToken = await user.getIdToken();
            const headers = {
                Authorization: `Bearer ${idToken}`
            };
            const payload = { user_id: user_id._id, inputCode, translateCode, sourceLanguage, desiredLanguage };
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}history/`, payload, { headers });
            return response.data;
        } catch (error) {
            console.error('Error posting history:', error);
            throw error;
        }
    }

    async postFeedback(user, postId, Trating, Urating, ratingText) {
        try {
            const user_id = await this.getUser(user);
            const idToken = await user.getIdToken();
            const headers = {
                Authorization: `Bearer ${idToken}`
            };
            const payload = { user_id: user_id._id, postId, Trating, Urating, ratingText};
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}feedback/`, payload, { headers });
            return response.data;
        } catch (error) {
            console.error('Error posting feedback:', error);
            throw error;
        }
    }

    async getFeedback(user) {
        try {
            const idToken = await user.getIdToken();
            const headers = {
                Authorization: `Bearer ${idToken}`
            };
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}feedback/getFeedback`, { headers});
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching feedback:', error);
            throw error;
        }
    }

    async getAllHistory(user) {
        try {
            const user_id = await this.getUser(user);
            const idToken = await user.getIdToken();
            const headers = {
                Authorization: `Bearer ${idToken}`
            };
            const params = { user_id: user_id._id };
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}history/getAllHistory`, { headers, params });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching histories:', error);
            throw error;
        }
    }
    
    
    async getUser(user) {
        try {
            const idToken = await user.getIdToken();
            const headers = {
                Authorization: `Bearer ${idToken}`
            };
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}users/`, {headers});
            console.log("User: ",response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }
}

export default new NHAService();
