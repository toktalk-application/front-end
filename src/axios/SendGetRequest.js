import axios from "axios";
import {REACT_APP_API_URL} from '@env';
import handleErrorMessage from "./ErrorMessageHandler";

const sendGetRequest = async({ token, endPoint, requestParams, onSuccess, onFailure, disableDefaultAlert }) => {
    /* console.log("token: ", token);
    console.log("endPoint: ", endPoint);
    console.log("requestParams: ", requestParams); */
    
    try{
        const response = await axios.get(
            REACT_APP_API_URL + endPoint, 
            {
                params: requestParams,
                headers: {
                    'Content-Type': 'application/json',
                    ... token && {Authorization: token},
                }
            },
        )
        if(response.status === 200){
            if(onSuccess) onSuccess(response.data);
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
export default sendGetRequest;