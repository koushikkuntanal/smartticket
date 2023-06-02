import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { View, StyleSheet, Text ,Image} from "react-native";
import { checkOrder, createOrder, orderPay, transactionQrApi, transactionStatusApi } from "./Api";
const axios = require("axios");
import * as Linking from "expo-linking";
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PagerView from 'react-native-pager-view';
import { btnColor } from "../components/Constants";
// import QRCode from "react-native-qrcode-svg";
// import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
const PaymentScreen = ({ route }) => {
  // const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-9003278618989837/9736516844';

  const tripData = route.params.tripData;
  const [data, setData] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const orderId = route.params.Orderid;
  const customerId = route.params.customerid;
  const navigation = useNavigation();
  const phone = route.params.cphone;
  const Upi = route.params.upi;
  const amount = route.params.Fare;
  const email = route.params.mail;
  const [trancData, setTrancData] = useState("");
  const from = route.params.From;
  const to = route.params.To;
  const routeName = route.params.routeName;
  const busNo = route.params.busNo;
  const [status, setStatus] = useState("");
  const [qrValue, setQrValue] = useState('Your String Value');
  const passengerNumber = route.params.passengerNumber;
   
  const ttype = route.params.ttype;
  const checkOrderS =() =>{
    var obj = setInterval(callCheck,1000);
    
     function callCheck(){
       checkOrder(orderId)
       .then(async (res) => {
        console.log('status',res.data.order_status)
                if (res.data.order_status == "PAID") {
                  clearInterval(obj);
                  setStatus("paid");
                  setTrancData(res.data);
                  await transactionStatusApi({
                    "transid": res.data.cf_order_id,
                    "OrderID": res.data.order_id,
                    "tstatus":res.data.order_status,
                    "timestamp":res.data.created_at.toString(),
                    "Tgen":'Q',
                    
                    
                  })
                    .then(async (res) => {
                       console.log('jgkhxkjskj',res.data);
                       await transactionQrApi({ 
                        "cid":customerId,
                        "orderid":orderId,
                        "route":routeName,
                        "from":from,
                        "to":to,
                        "fare":amount,        
                        "time":res.data.time, 
                        "Tgen":'Q', 
                        "passengers":passengerNumber,
                        "ttype": ttype,
                      }).then(res=>{console.log('res ehen qr is hit',res.data)
                    setQrValue('data:image/png;base64,'+res.data);
                    })
                      .catch(err=>{console.log('err ehwn qr is hiy',err)})
                    })
                    .catch((err) => {
                      console.log(err);
                    });

                   
                 
                }
                else if(res.data.order_status == "ACTIVE"){
                  clearInterval(obj);
                  alert('Please complete payment!! or Try again');
                  
                }
              })
              .catch((error) => {
                console.log(error);
              });
    }
  }


  const createOrderApi = async () => {
    await createOrder({
      customer_details: {
        customer_id: customerId,
        customer_email: email,
        customer_phone: phone.toString(),
      },
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
    })
      .then(async (res) => {
        // console.log(res);
        await orderPay({
          payment_method: {
            upi: {
              channel: "link",
              upi_id: Upi,
            },
          },
          payment_session_id: res.data.payment_session_id,
        })
          .then((res) => {
            // console.log(res.data.data.payload.phonepe)
            setData(res.data.data.payload.phonepe);
          })
          .catch((error) => {
            console.log('err when corder pay',error);
            alert('Request Failed. Please Try Again!!,when orderpay hit');
            navigation.goBack();
          });
      })
      .catch((error) => {
        console.log('err when create aorder hit',error);
        alert('Request Failed. Please Try Again!! when createOrderApi')
        navigation.goBack();
      });
  };
  const handlePayPress = () => {
    Linking.openURL(data);
    checkOrderS();
  };
  return status == "paid" ? (
  
    <View style={{flexDirection:'column'}}>
     {console.log('ttt',ttype)}
    <View style={styles.container}>
      
      {console.log('retur',status)}
     
      <View style={styles.row}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{trancData.created_at}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>OrderID:</Text>
        <Text style={styles.value}>{trancData.order_id}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Transaction ID:</Text>
        <Text style={styles.value}>{trancData.cf_order_id}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={[styles.value, styles.amount]}>
        {'\u20B9'} {trancData.order_amount}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, styles.orderStatus]}>
          {trancData.order_status}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{from} to {to}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Bus Number:</Text>
        <Text style={styles.value}>{busNo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Number of Passengers:</Text>
        <Text style={styles.value}>{passengerNumber}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Ticket Type:</Text>
        <Text style={styles.value}>{ttype}</Text>
      </View>

      {
        console.log('qr',qrValue)
      }  
     
         <View style={{alignItems:'center',justifyContent:'center',marginTop:20}}>
         <Image source={{uri:`${qrValue}`}} style={{width:150,height:150,}}></Image>
         </View>
      
      
    </View>

    <View>
      {/* <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
     /> */}
     </View>
    </View>
   
    
  ) : (
    <View style={styles.body}>

<View style={styles.card}>
<View style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>Payment Details</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>{'\u20B9'} {amount}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Currency:</Text>
          <Text style={styles.value}>INR</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Upi Id:</Text>
          <Text style={styles.value}>{Upi}</Text>
        </View>
      </View>
      {console.log("details in payment screen",  orderId,  phone,  email,  Upi,  amount,  from,  to)}
      </View>
      <TouchableOpacity onPress={createOrderApi} style={styles.button} >
        <Text style={styles.buttonText}>UPI Payment</Text>
        {console.log("trans data in view", trancData)}
      </TouchableOpacity>
      {data ? (
        <TouchableOpacity onPress={handlePayPress} style={styles.button}>
        <Text style={styles.buttonText}>Proceed To Pay</Text>
      </TouchableOpacity>
      ) : null}
     
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
   
    backgroundColor: "#ffffff",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  
  value: {
    fontSize: 16,
    color: "#666",
  },
  amount: {
    color: "#f00",
  },
  orderStatus: {
    color: "green",
  },

  container1:{
    backgroundColor: 'red',
    //flex:1,
    
   
    //marginBottom:355,
    marginTop:3,
    alignItems:'center',
    flex:1,
    justifyContent:'center',
   
    
  },

  parent:{
    // backgroundColor:'red',
    borderWidth:0.2,
    flex:1,
    borderRadius:12,
    // paddingLeft:5
    
  },

  pager:{
   
    height:150,
    
   
  },
  button: {
    backgroundColor: btnColor,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom:15
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 4,
    marginHorizontal: 16,
    marginVertical: 8,
    width: '90%',
    marginTop:25,
    marginBottom:20
  },
  cardHeader: {
    backgroundColor: btnColor ,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardHeaderText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardBody: {
    padding: 16,
    marginBottom:10,
    
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
