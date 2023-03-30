import React from "react";
import { useState,useEffect } from "react";
import { Alert } from 'react-native';
import moment from 'moment';


import {StyleSheet,View,Text} from "react-native";
import Btn from "../components/Btn";
import { btnColor } from "../components/Constants";

// function checkBirthday() {
//   const dob = '1990-04-01'; // replace with person's date of birth
//   const today = moment().format('MM-DD');
//   const birthday = moment(dob).format('MM-DD');
//   if (today === birthday) {
//     Alert.alert('Happy Birthday', 'Best wishes on your special day!');
//   }
// }

// useEffect(() => {
//   checkBirthday();
// }, []);



const Screen_B = () => {

   


   
  return(

    <View style={styles.container}>
       <Text>ScreenB</Text>

       {/* <Btn 
        textColor="white"
        bgColor={btnColor}
        btnLabel="Save"
        Press={checkBirthday}
       /> */}
      
    </View>
  );

  
}

const styles = StyleSheet.create({

 container: {
   flex: 1,
   alignItems: 'center',
   justifyContent: 'center'
 }


});
export default Screen_B;