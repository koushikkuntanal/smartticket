import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { View,StyleSheet,Text } from "react-native";
import { checkOrder, createOrder, orderPay } from "./Api";
const axios = require('axios');
import * as Linking from 'expo-linking';
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const PaymentScreen= ({route})=>{
  const [data,setData] = useState('');
  const [paymentStatus,setPaymentStatus] = useState('');
  const orderId = (route.params.orderid);
  const customerId = (route.params.customerid);
  const navigation = useNavigation();
  const phone = (route.params.cphone);
  const Upi = (route.params.upi);
  const amount = (route.params.Fare);
  const email = (route.params.mail);
  const [dataPayment,setDataPayment] = useState([]); 


  const confirmPayment = (obj)=>{
        setDataPayment(obj);
        console.log('confirm',dataPayment);
  } 
 const checkPaymentWithDelay=()=>{
 
    setTimeout(function(){
       checkOrder(orderId)
      .then(res=>{console.log(res.data.order_status)
      setPaymentStatus(res.data.order_status);
      if(paymentStatus =='PAID'){
        // setDataPayment(res.data);
        // console.log('array',dataPayment)
        // navigation.navigate('Success');
        confirmPayment(res.data);
      }
      })
      .catch(error=>{console.log(error)})
      //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
     // Alert.alert("Alert Shows After 5 Seconds of Delay.")
     
    }, 500);
 
 
  }


  // const check = async()=>{
  //   await checkOrder('kou18')
  //   .then(res=>{console.log(res.data)})
  //   .catch(error=>{console.log(error)})
  // }

  // useEffect(() => {
  //   check()
  //  }, []);
 
  //  setInterval(check, 3000);


  
  const createOrderApi = async() =>{
    
    await createOrder(
      {
        customer_details: {
          customer_id: customerId,
          customer_email: email,
          customer_phone: phone
        },
        order_id: orderId,
        order_amount: amount,
        order_currency: 'INR'
      }
    ) 
    .then(res=>{
      console.log(res);
      orderPay({
        "payment_method": {
          "upi": {
            "channel": "link",
             "upi_id": Upi
          }
        },
       "payment_session_id":res.data.payment_session_id,
      })
      .then(res=>{console.log(res.data.data.payload.phonepe)
       setData(res.data.data.payload.phonepe)
      })
      .catch(error=>{console.log(error)})
    })
    .catch(error => { console.log(error) })
  }

    return (paymentStatus == 'PAID') ? <View style={{alignItems:'center',justifyContent:'center',flex:1}}><Text>Recieved</Text></View> :    
    <View style={styles.body}>
        <TouchableOpacity onPress={createOrderApi}>
        <Text>UPI Payment</Text>
       
        </TouchableOpacity>
        {
          data ? <Button  title="pay" 
          onPress={
            ()=>{
              
            Linking.openURL(data);
            // checkPaymentWithDelay();
            setInterval(checkPaymentWithDelay,5000);
            }
          } /> : null
        }

       
        
    </View>
}

const styles = StyleSheet.create({
    body: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:'#ffffff'
    },
});

export default PaymentScreen;