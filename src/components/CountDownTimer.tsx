import React, { useState, useEffect } from "react";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from '@material-ui/icons/LockOpen';

interface ICountdown {
    hours: number;
    minutes: number;
    seconds: number;
    docRef?: any;
}

const CountDownTimer = ({
    hours = 0,
    minutes = 0,
    seconds = 60,
    docRef
}: ICountdown) => {
    const [time, setTime] = useState<ICountdown>({
        hours,
        minutes,
        seconds,
    });
    const [lock, setLock] = useState(true);

    const tick = () => {
        if (time.hours === 0 && time.minutes === 0 && time.seconds === 0)
            reset();
        else if (time.hours === 0 && time.seconds === 0) {
            setTime({ hours: time.hours, minutes: time.minutes-1, seconds: 59 });
        }
        else if(time.minutes === 0 && time.seconds === 0){
            setTime({ hours: time.hours -1, minutes: 59, seconds: 59 })
        }
        else if (time.seconds === 0) {
            setTime({
                hours: time.hours,
                minutes: time.minutes - 1,
                seconds: 59,
            });
        } else {
            setTime({
                hours: time.hours,
                minutes: time.minutes,
                seconds: time.seconds - 1,
            });
        }
    };

    const reset = () =>
        setTime({
            hours: time.hours,
            minutes: time.minutes,
            seconds: time.seconds,
        });

    // If you put an empty array to this useEffect, its not working!!!!!
    // tick function is called in every 1 second even we specify the empyt array!!!!!
    useEffect(() => {
        // if remaining time is 0, stop the timer tick
        if (time.hours == 0 && time.minutes == 0 && time.seconds == 0) {
            console.log("Tick done");
            docRef.update({
                opened: true,
            });
            setLock(false);
            return;
        }
        const timerId = setInterval(() => tick(), 1000);
        return () => {
            clearInterval(timerId);
        };
    });

    return (
        <>
            {lock ? (
                <div style={{ fontSize: 50, textAlign: "center" }}>
                    <LockIcon style={{fontSize:80}}></LockIcon>
                    <p>{`${time.hours
                        .toString()
                        .padStart(2, "0")}:${time.minutes
                        .toString()
                        .padStart(2, "0")}:${time.seconds
                        .toString()
                        .padStart(2, "0")}`}</p>
                </div>
            ) : (
                <div style={{textAlign: "center" }}>
                    <LockOpenIcon style={{fontSize:80}}></LockOpenIcon>
                    <p style={{fontSize: 35}}>Click the letter to unlock</p>
                </div>
            )}
        </>
    );
};

export default CountDownTimer;
