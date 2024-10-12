import axios from "axios";
import {REACT_APP_API_URL} from '@env';

const sendPostRequest = async({ token, endPoint, requestBody, onSuccess, onFailure }) => {
    try{
        console.log('REACT_APP_API_URL:', REACT_APP_API_URL);
        
        if(requestBody) console.log("requestBody:", requestBody);

        const response = await axios.post(
            REACT_APP_API_URL + endPoint, 
            requestBody,
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                }
            },
        )
        /* console.log("response: ", response); */
        if (response.status === 200 || response.status === 201) {
            if (onSuccess) onSuccess();
        }
    }catch(error){
        console.error('요청 실패: ', error);
        console.error('status: ', error.status);
        /* console.error('error response: ', error.response); */
        console.error('message: ', error.message);

        if(onFailure) onFailure();
    }
}
export default sendPostRequest;