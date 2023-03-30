import React, { useState,useEffect } from "react";                  //Go to validate
import { View, Text, StyleSheet, Alert,Button,Image, TextInput,TouchableOpacity} from "react-native";
import { background } from "../components/Constants";


const TicketScreen = ({route}) =>{
  
  return (
    
       <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bus Ticket</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>From: {route.params.From}</Text>
        
        <Text style={styles.label}>To: {route.params.To}</Text>
       
        <Text style={styles.label}>Date:{route.params.Date}</Text>
        
        <Text style={styles.label}>Time:{route.params.Time}</Text>
       
        
        <Text style={styles.label}>Price:{'\u20B9'}{route.params.Fare}</Text>
     
      </View>
      <View style={styles.footer}>
        <Text style={styles.barcode}>LEKPAY</Text>
      </View>
    </View>
   
  );
}
const styles = StyleSheet.create({
    body: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:background
    },
    container: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      //fontWeight: 'bold',
    },
    content: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      //fontWeight: 'bold',
      marginBottom: 5,
    },
    value: {
      fontSize: 16,
      marginBottom: 10,
    },
    footer: {
      alignItems: 'center',
    },
    barcode: {
        opacity:0.25,
      fontSize: 20,
      padding: 10,
      backgroundColor: '#f2f2f2',
      borderRadius: 5,
    },
    
});

export default TicketScreen;