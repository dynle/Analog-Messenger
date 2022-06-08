import React from 'react';
import CountDownTimer from './CountDownTimer';
import LockOpenIcon from '@material-ui/icons/LockOpen';


// Compare deliveryTime and currentTime
// If remainingTime < 0, change "opened": false -> true
// Timer visualization
let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
}

function calRemainingTime(deliveryTime: number) {
    let currTimeUTC = new Date().getTime() * 0.001;
    let remainingTimeUTC = (deliveryTime - currTimeUTC);
    console.log(remainingTimeUTC);
    if (remainingTimeUTC > 0) {
        timeLeft = {
            days: Math.floor(remainingTimeUTC / (60 * 60 * 24)),
            hours: Math.floor((remainingTimeUTC / (60 * 60)) % 24),
            minutes: Math.floor((remainingTimeUTC / 60) % 60),
            seconds: Math.floor((remainingTimeUTC) % 60)
        };
        console.log("Time Left: ",timeLeft);
        return 1;
    }
    else if (remainingTimeUTC <= 0 ) {
        return 0;
    }
}

export default function Timer({deliveryTime, docRef} :  {deliveryTime : number, docRef: any}) {
    //Create Timer
    let error = calRemainingTime(deliveryTime);
    console.log(error);
    if (error === 1) {
        console.log(error);
        return (
            <div>
                <CountDownTimer hours={timeLeft.hours} minutes={timeLeft.minutes} seconds={timeLeft.seconds} docRef={docRef}></CountDownTimer>
            </div>
        )
    }
    else if (error === 0) {
        console.log(error);
        //opened: false -> true / the remaining time has already passed when a user tries to open the letter
        docRef.update({
            "opened": true
        })
        return (
          <div style={{textAlign: "center" }}>
              <LockOpenIcon style={{fontSize:80}}></LockOpenIcon>
              <p style={{fontSize: 40}}>Click the letter again to read</p>
          </div>
        )
    }
    return (
        <div></div>
    )
}




