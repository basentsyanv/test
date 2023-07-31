import axios from "axios";

async function a () {
    const response = await axios.get(`http://127.0.0.1:3000/hello`);
    console.log(response)
}

a()
