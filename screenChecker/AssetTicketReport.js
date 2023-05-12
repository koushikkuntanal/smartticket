import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, Alert,Button,Image, TextInput,TouchableOpacity, ImageBackground} from "react-native";
import { background } from "../components/Constants";

const AssetTicketReport =({route}) =>{
    const countPassengers = route.params.countPassengers;
    const Asset = route.params.Asset;
  return(
        <View style={styles.body}>
           <View style={styles.card}> 
            <View style={{alignSelf:'center'}}>

            <Text>Bus Id : {Asset}</Text>
            <Text>Total Current Passengers : {countPassengers}</Text>
            
            </View>
            
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