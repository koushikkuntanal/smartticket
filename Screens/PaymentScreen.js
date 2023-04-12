import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { View, StyleSheet, Text } from "react-native";
import { checkOrder, createOrder, orderPay, transactionStatusApi } from "./Api";
const axios = require("axios");
import * as Linking from "expo-linking";
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const PaymentScreen = ({ route }) => {
  const [data, setData] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const orderId = route.params.orderid;
  const customerId = route.params.customerid;
  const navigation = useNavigation();
  const phone = route.params.cphone;
  const Upi = route.params.upi;
  const amount = route.params.Fare;
  const email = route.params.mail;
  const [trancData, setTrancData] = useState("");
  const from = route.params.From;
  const to = route.params.To;
  const [status, setStatus] = useState("");

  const checkPaymentWithDelay = () => {
    console.log('satus',status)
    if (status == "paid") {
      clearTimeout(checkPaymentWithDelay);
    }
    setTimeout(function () {
      checkOrder(orderId)
        .then(async (res) => {
          if (res.data.order_status == "PAID") {
            clearTimeout(checkPaymentWithDelay);
            clearTimeout(setTimeout);
            setStatus("paid");
            setTrancData(res.data);
            await transactionStatusApi({
              "transid": res.data.cf_order_id,
              "OrderID": res.data.order_id,
              "status":res.data.order_status,
              "timestamp":res.data.created_at.toString()
            })
              .then((res) => {
                // console.log(res.data);
                
              })
              .catch((err) => {
                console.log(err);
              });
           
          }
        })
        .catch((error) => {
          console.log(error);
        });
      //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
      // Alert.alert("Alert Shows After 5 Seconds of Delay.")
    }, 500);
    if (status == "paid") {
      clearTimeout(setTimeout);
    }
  };

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
    <View style={styles.container}>
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
          {trancData.order_amount}
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
            // checkPaymentWithDelay();
            setInterval(checkPaymentWithDelay, 5000);
          }}
        />
      ) : null}
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
});

export default PaymentScreen;
