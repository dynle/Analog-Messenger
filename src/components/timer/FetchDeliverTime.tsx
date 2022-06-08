// @ts-nocheck
import React, {useState, useEffect} from 'react';
import { db } from '../../fbase'
import Timer from "./Timer"

function FetchDeliverTime() {
    //Since deliveryTime is initialized 0 first, useState(0), the component got rendered and then re-rendered after fetching data.
    //how to solve it??
    const [deliveryTime,setDeliveryTime] = useState(0);
    useEffect(() => {
        var docRef = db.collection("users").doc("sxZ9ryLWEYMc5x6i5RiGMtUU6Yu2").collection("inbox").doc("mE61PYO8kWRIJEytwkSi5dcQINA3");
        docRef.get().then((doc) => {
            if (doc.exists) {
                let data = doc.data();
                console.log("Document data:", data!.deliverTime.seconds);
                setDeliveryTime(data!.deliverTime.seconds);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
      },[]);
    var docRef2 = db.collection("users").doc("sxZ9ryLWEYMc5x6i5RiGMtUU6Yu2").collection("inbox").doc("mE61PYO8kWRIJEytwkSi5dcQINA3");;
    if (deliveryTime !== 0) {
        return (
            <div>  
                <Timer deliveryTime={deliveryTime} docRef={docRef2}></Timer>
            </div>
        )
    }
    else {
        return (
            <div>
            </div>
        )
    }
}

export default FetchDeliverTime;