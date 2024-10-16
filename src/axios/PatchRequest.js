import axios from "axios";
import {REACT_APP_API_URL} from '@env';
import handleErrorMessage from "./ErrorMessageHandler";

const sendPatchRequest = async({ token, endPoint, requestBody, onSuccess, onFailure, disableDefaultAlert }) => {
    console.log('REACT_APP_API_URL:', REACT_APP_API_URL);
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
        const errorStatus = error.response.status;
        const errorMessage = error.response.data.message;
        console.error('요청 실패: ', error);
        console.error('message: ', error.message);
        console.error('server message: ', errorMessage);

        if(!disableDefaultAlert) handleErrorMessage(errorStatus, errorMessage);
        if(onFailure) onFailure(errorStatus, errorMessage);
    }
}
export default sendPatchRequest;