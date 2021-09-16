import axios from "axios"

export default axios.create({
    baseURL: `http://192.168.43.79:8000/`
});