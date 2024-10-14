import axios from "axios";
import {REACT_APP_API_URL} from '@env';

const sendDeleteRequest = async({ token, endPoint, requestParams, onSuccess, onFailure }) => {
    /* console.log("token: ", token);
    console.log("endPoint: ", endPoint);
    console.log("requestParams: ", requestParams); */
    
    try{
        const response = await axios.delete(
            REACT_APP_API_URL + endPoint, 
            {
                params: requestParams,
                headers: {
                    'Content-Type': 'application/json',
                    ... token && {Authorization: token},
                }
            },
        )
        if(response.status === 204){
            if(onSuccess) onSuccess(response.data);
        }
    }catch(error){
        console.error('요청 실패: ', error);
        console.error('message: ', error.message);
        console.error('server message: ', error.response.data.message);

        if(onFailure) onFailure();
    }
}
export default sendDeleteRequest;