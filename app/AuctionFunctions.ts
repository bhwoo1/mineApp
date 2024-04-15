import axios from "axios"

interface AuctionFucntions {
    convertToKoreanTime: (dateString: string) => void;
}

export const useAuctions = () => {
}

export const convertToKoreanTime = (dateString: string) => {
    // 주어진 시간을 Date 객체로 변환
    var date = new Date(dateString);
    
    // 한국 표준시의 시차는 UTC+9
    // 따라서 현재 시간에서 9시간을 빼줘야 함
    date.setHours(date.getHours() - 9);

    // 요일을 가져오기 위해 배열 생성
    var days = ['일', '월', '화', '수', '목', '금', '토'];

    // 변환된 시간의 요일을 가져옴
    var dayOfWeek = days[date.getDay()];

    // 변환된 시간을 반환
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        dayOfWeek: dayOfWeek,
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds()
    };
}