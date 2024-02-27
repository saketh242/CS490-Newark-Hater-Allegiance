import axios from "axios"

class NHAService {

    postUser(firstName, lastName, email, uid) {
        const payload = { firstName, lastName, email, uid };
        console.log("ARE WE IN HERE?")
        console.log(payload)
        return axios.post(`http://localhost:3000/users/postUser`, payload)
      }

}

export default new NHAService()
