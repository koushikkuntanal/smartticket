import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { View, StyleSheet, Text ,Image} from "react-native";
import { checkOrder, createOrder, orderPay, transactionQrApi, transactionStatusApi } from "./Api";
const axios = require("axios");
import * as Linking from "expo-linking";
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PagerView from 'react-native-pager-view';
// import QRCode from "react-native-qrcode-svg";

const PaymentScreen = ({ route }) => {
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
                    "timestamp":res.data.created_at.toString()
                  })
                    .then((res) => {
                       console.log(res.data);
                      
                    })
                    .catch((err) => {
                      console.log(err);
                    });

                    await transactionQrApi({
                      "cid":customerId,
                      "orderid":orderId,
                      "route":routeName,
                      "from":from,
                      "to":to,
                      "fare":amount
                    }).then(res=>{console.log('res ehen qr is hit',res.data)
                  setQrValue('data:image/png;base64,'+res.data);
                  })
                    .catch(err=>{console.log('err ehwn qr is hiy',err)})
                 
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
      .then((res) => {
        // console.log(res);
        orderPay({
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
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return status == "paid" ? (
  
    <View>
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
      {
        console.log('qr',qrValue)
      }  
     
         <View style={{alignItems:'center',justifyContent:'center',marginTop:20}}>
         <Image source={{uri:`${qrValue}`}} style={{width:150,height:150,}}></Image>
         </View>
      
      
    </View>

    <View style={styles.container1}>
      <View style={styles.parent}>
        <PagerView
         style={styles.pager}
         initialPage={0}
        >
         <View key="1" style={{borderRadius:8}}>
              <Image
                  style={{width:"100%",height:"100%",borderRadius:11}}
                  resizeMode='stretch'
                  source={require('../assets/Scenry.png')}
                  
                />
             </View>
             <View key="2" style={{borderRadius:8}}>
             <Image 
                  style={{width:"100%",height:"100%",borderRadius:11}}
                  resizeMode='stretch'
                  source={require('../assets/Buildings.png')}
                  
                />
             </View> 
             <View key="3" style={{borderRadius:8}}>
             <Image 
                  style={{width:"100%",height:"100%",borderRadius:11}}
                  resizeMode='stretch'
                  source={require('../assets/Wow.png')}
                  
                />
             </View>    
        </PagerView>
      </View>
    </View>
    </View>
    
  ) : (
    <View style={styles.body}>
      {console.log(
        "details in payment screen",
        orderId,
        phone,
        email,
        Upi,
        amount,
        from,
        to
      )}
      <TouchableOpacity onPress={createOrderApi}>
        <Text>UPI Payment</Text>
        {console.log("trans data in view", trancData)}
      </TouchableOpacity>
      {data ? (
        <Button
          title="pay"
          onPress={() => {
            Linking.openURL(data);
            
            
            checkOrderS();
          }}
        />
      ) : null}
      <View>
      
        
      
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  container: {
    backgroundColor: "#fff",
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
    // backgroundColor: '#ffffff',
    //flex:1,
    // paddingRight:1,
    paddingLeft:13,
    //marginBottom:355,
    marginTop:3,
   
    width:372,
    height:150,
  },

  parent:{
    // backgroundColor:'red',
    borderWidth:0.2,
    flex:1,
    borderRadius:12,
    // paddingLeft:5
  },

  pager:{
    flex:1,
    alignSelf:'stretch',
    // backgroundColor:'red',
    
  },
});

export default PaymentScreen;
