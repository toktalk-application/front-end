import axios from "axios";
import {REACT_APP_API_URL} from '@env';

const sendPatchRequest = async({ token, endPoint, requestBody, onSuccess, onFailure }) => {
    try{
        console.log('REACT_APP_API_URL:', REACT_APP_API_URL);
        
        if(requestBody) console.log("requestBody:", requestBody);

        const response = await axios.patch(
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
        if (response.status === 200) {
            if (onSuccess) onSuccess();
        }
    }catch(error){
        console.error('요청 실패: ', error);
        console.error('status: ', error.status);
        console.error('message: ', error.message);

        if(onFailure) onFailure();
    }
}
export default sendPatchRequest;