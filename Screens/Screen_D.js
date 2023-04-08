import React, { useState,useEffect } from "react";                  //Go to validate
import { View, Text, StyleSheet,} from "react-native";


const Screen_D = () =>{
  
  
  return (
   
    <View style={styles.body}>
     <Text>Screen D</Text>
  </View>
       
 
  );
}
const styles = StyleSheet.create({
    body: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:'#F9E5F3'
    },
    
});

export default Screen_D;