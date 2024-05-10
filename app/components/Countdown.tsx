import React, { useEffect, useState } from "react";

type Prop = {
    targetDateString: string
}



const Countdown: React.FC<Prop> = (props: Prop) => {
    const [times, setTimes] = useState<number[]>([0, 0, 0, 0]);
  
    useEffect(() => {
      const updateCountdown = () => {
        const targetDate = new Date(props.targetDateString);
        const currentDate = new Date();
  
        const timeDifference = targetDate.getTime() - currentDate.getTime();
  
        if (timeDifference <= 0) {
            setTimes([0, 0, 0, 0]); // 이벤트가 이미 지남
            return;
        }

        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        // times 상태를 업데이트
        setTimes([days, hours % 24, minutes % 60, seconds % 60]);
      };
  
      const interval = setInterval(updateCountdown, 1000);
  
      return () => clearInterval(interval);
    }, [props.targetDateString]);
  
    return (
        <div className="pb-4">
            <p className="font-bold text-xl">종료까지 남은 시간</p>
            <div className="flex flex-row">
                <div className="flex flex-col items-center">
                    <p className="text-3xl font-bold">{times[0]}</p>
                    <p className="text-sm font-bold">Days</p>
                </div>
                <p className="text-4xl mx-2 font-bold">/</p>
                <div className="flex flex-col items-center">
                    <p className="text-3xl font-bold">{times[1]}</p>
                    <p className="text-sm font-bold">Hours</p>
                </div>
                <p className="text-4xl mx-2 font-bold">/</p>
                <div className="flex flex-col items-center">
                    <p className="text-3xl font-bold">{times[2]}</p>
                    <p className="text-sm font-bold">Minutes</p>
                </div>
                <p className="text-4xl mx-2 font-bold">/</p>
                <div className="flex flex-col items-center">
                    <p className="text-3xl font-bold">{times[3]}</p>
                    <p className="text-sm font-bold">Seconds</p>
                </div>
            </div>
        </div>
    );
  };
  
  export default Countdown;