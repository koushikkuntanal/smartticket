import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, Alert,Button,Image, TextInput,TouchableOpacity, ImageBackground} from "react-native";
import { background } from "../components/Constants";

const AssetTicketReport =() =>{
    return(
        <View style={styles.body}>
           <View style={styles.card}> 
            <View style={{alignSelf:'center'}}>
            <Text>Date:24/02/2023</Text>
            <Text>Bus Id:123</Text>
            <Text>Total tickets:80</Text>
            
            </View>
            <View><Text>Cash Collected:{'\u20B9'}560</Text></View>
           </View>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
      flex: 1,
      alignItems: 'center',
     // justifyContent: "center",
      backgroundColor:background,
      //paddingHorizontal:20
      //marginTop:Constants.statusBarHeight
    },
    card: {
       
        width:"97%",
        height:80,
        flexDirection:'row',
       justifyContent:'space-between',
        backgroundColor: '#ffffff',
        borderRadius: 9,
        padding: 16,
        margin: 8,
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
});

export default AssetTicketReport;