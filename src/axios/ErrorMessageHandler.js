import { Alert } from "react-native"

const handleErrorMessage = (status, message) => {
    console.log("status in handleErrorMessage: ", status);
    console.log("message in handleErrorMessage: ", message);
    
    Alert.alert("요청 실패", getPrettyMessage(status, message));
}

const getPrettyMessage = (status, message) => {
    switch(status){
        case 400:
            if(message.includes('params')) return '쿼리 파라미터를 최소 하나 이상 입력해야 합니다.'
            if(message.includes('discontinuous')) return '예약 시간은 연속돼야 합니다.'
            if(message.includes('cancel')) return '잘못된 취소 사유입니다.'
            if(message.includes('licenses')) return '자격증은 총 1~3개로만 등록할 수 있습니다.'
            if(message.includes('careers')) return '경력사항은 총 1~3개로만 등록할 수 있습니다.'
            if(message.includes('month')) return '달은 1월~12월이어야 합니다.'
            if(message.includes('status')) return '잘못된 예약 상태 파라미터입니다.'
            break;
        case 403:
            if(message.includes('denied')) return '요청이 거부되었습니다.'
            if(message.includes('usertype')) return '잘못된 유저 타입입니다.'
            if(message.includes('Member id')) return '회원 식별자가 맞지 않습니다.'
            if(message.includes('Counselor id')) return '상담사 식별자가 맞지 않습니다.'
            if(message.includes('Invalid counselor')) return '잘못된 상담사입니다.'
            if(message.includes('Cancellation')) return '예약은 24시간 전까지만 취소할 수 있습니다.'
            if(message.includes('Occupied')) return '예약이 있는 시간대를 삭제할 수 없습니다.'
            if(message.includes('timeslots')) return '예약을 위해 최소 하나의 시간대를 선택해야 합니다.'
            break;
        case 404:
            if(message.includes('score')) return '잘못된 우울증 점수입니다.'
            if(message.includes('finished')) return '완료되지 않은 상담입니다.'
            if(message.includes('Member')) return '존재하지 않는 회원입니다.'
            if(message.includes('TestResult')) return '존재하지 않는 검사 기록입니다.'
            if(message.includes('Counselor')) return '존재하지 않는 상담사입니다.'
            if(message.includes('Reservation')) return '존재하지 않는 상담 예약입니다.'
            if(message.includes('Chatroom not')) return '존재하지 않는 대화방입니다.'
            if(message.includes('Chatroom is')) return '종료된 대화방입니다.'
            if(message.includes('File')) return '존재하지 않는 파일입니다.'
            if(message.includes('Given date')) return '해당 날짜에 예약할 수 없습니다.'
            if(message.includes('Given time')) return '해당 시간에 예약할 수 없습니다.'
            if(message.includes('License')) return '존재하지 않는 자격증입니다.'
            if(message.includes('Career')) return '존재하지 않는 경력사항입니다.'
            if(message.includes('Payment_Amount')) return '잘못된 결제액입니다.'
            if(message.includes('Payment_Not')) return '존재하지 않는 결제정보입니다.'
            if(message.includes('Payment_Failed')) return '결제에 실패하였습니다.'
            break;
        case 409:
            if(message.includes('userid')) return '이미 사용중인 아이디입니다.'
            if(message.includes('nickname')) return '이미 사용중인 닉네임입니다.'
            if(message.includes('new password')) return '기존과 같은 비밀번호로 변경할 수 없습니다.'
            if(message.includes('occupied')) return '이미 예약된 시간입니다.'
            if(message.includes('Review')) return '리뷰가 이미 등록되었습니다.'
            if(message.includes('Report')) return '진단이 이미 등록되었습니다.'
            break;
        case 500:
            if(message.includes('credential')) return '서버 오류: 회원 정보에 오류가 있습니다.'
            if(message.includes('Month parameter')) return '서버 오류: 달 파라미터는 양수여야 합니다.'
            break;
    }
    return "처리되지 않은 예외가 발생하였습니다.";
}
export default handleErrorMessage;