import axios from "axios";
import {REACT_APP_API_URL} from '@env';

const sendGetRequest = async({ token, endPoint, requestParams, onSuccess, onFailure }) => {
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
        console.log('요청 실패: ', error);
        console.log('response: ', error.response);
        console.log('message: ', error.message);

        if(onFailure) onFailure();
    }
}
export default sendGetRequest;