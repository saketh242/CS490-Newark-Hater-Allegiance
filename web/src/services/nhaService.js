import axios from "axios";
// import { useSelector } from 'react-redux';

class NHAService {

    async postUser(firstName, lastName, email, token) {
        try {
            const payload = { firstName, lastName, email };
            const headers = {
                Authorization: `Bearer ${token}`
            };
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}users/postUser`, payload, { headers });
            return response.data;
        } catch (error) {
            // console.error('Error posting user: ', error);
            return error.response.data;
        }
    }

    async postPrompt(user, sourceLanguage, desiredLanguage, inputCode) {
        try {
            const idToken = await user.getIdToken();
            const headers = {
                Authorization: `Bearer ${idToken}`
            };
            const payload = { inputCode, sourceLanguage, desiredLanguage };
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}openAI/postTranslation`, payload, { headers });
            return response.data;
        } catch (error) {
            // console.log('Error calling api:', error);
            return error.response.data
        }
    }

    async postHistory(user, dbUser, inputCode, translateCode, sourceLanguage, desiredLanguage) {
        try {
            const user_id = dbUser._id;
            const idToken = await user.getIdToken();
            const headers = {
                Authorization: `Bearer ${idToken}`
            };
            const payload = { user_id: user_id, inputCode, translateCode, sourceLanguage, desiredLanguage };
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}history/`, payload, { headers });
            return response.data;
        } catch (error) {
            // console.error('Error posting history:', error);
            return error.response.data;
        }
    }

    async postFeedback(user, dbUser, postId, Trating, Urating, ratingText) {
        try {
            const user_id = dbUser._id;
            const idToken = await user.getIdToken();
            const headers = {
                Authorization: `Bearer ${idToken}`
            };
            const payload = { user_id: user_id, postId, Trating, Urating, ratingText };
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}feedback/`, payload, { headers });
            return response.data;
        } catch (error) {
            // console.error('Error posting feedback:', error);
            return error.response.data;
        }
    }

    async getFeedback() {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}feedback/getFeedback`);
            //console.log(response.data);
            return response.data;
        } catch (error) {
            // console.error('Error fetching feedback:', error);
            return error.response.data;
        }
    }

    async getAllHistory(user, dbUser) {
        try {
            const user_id = dbUser._id;
            const idToken = await user.getIdToken();
            const headers = {
                Authorization: `Bearer ${idToken}`
            };
            const params = { user_id: user_id };
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}history/getAllHistory`, { headers, params });
            //console.log(response.data);
            return response.data;
        } catch (error) {
            // console.error('Error fetching histories:', error);
            return error.response.data;
        }
    }


    async getUser(user) {
        try {
            const idToken = await user.getIdToken();
            const headers = {
                Authorization: `Bearer ${idToken}`
            };
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}users/`, { headers });
            // console.log("User: ",response.data);
            return response.data;
        } catch (error) {
            // console.error('Error fetching user:', error);
            return error.response.data;
        }
    }

    async updateUser(user, email, firstName, lastName, newEmailFlag, newFirstNameFlag, newLastNameFlag) {
        try {
            const idToken = await user.getIdToken();
            const headers = {
                Authorization: `Bearer ${idToken}`
            };
            const payload = { email: email, firstName: firstName, lastName: lastName, newEmailFlag: newEmailFlag, newFirstNameFlag: newFirstNameFlag, newLastNameFlag: newLastNameFlag }
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}users/updateUser`, payload, { headers });
            return response.data;
        } catch (error) {
            // console.error('Error updating user:', error);
            return error.response.data;
        }
    }

    async deleteUser(user) {

        try {
            const idToken = await user.getIdToken();
            const headers = {
                Authorization: `Bearer ${idToken}`
            };
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}users/deleteUser`, { headers });
            return response.data;
        } catch (error) {
            // console.error("Error deleting user: ", error);
            return error.response.data;
        }
    }

    async getOpenAIStatus() {
        try {
          const response = await axios.get('https://status.openai.com/api/v2/summary.json');
          const jsonData = response.data;
      
          // Check if JSON data contains components array --> contains api status
          if (!jsonData || !jsonData.components || !Array.isArray(jsonData.components)) {
            // console.error('Invalid JSON data format');
            return false;
          }
      
          // Find the API component and check its status
          const apiComponent = jsonData.components.find(component => component.name === "API");
          const apiReady = apiComponent && apiComponent.status === 'operational';
          return apiReady;
        } catch (error) {
        //   console.error('Error fetching OpenAI API status:', error);
          return error.response.data;
        }
      }
      
      async emailDev(name, email, message) {
        try {
            const payload = {name, email, message};
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}issues`, payload);
            return response.data;
        }
        catch (error) {
            // console.error('Error with posting issue', error);
            return error.response.data;
        }
      }
      
}

export default new NHAService();
