import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, Alert,Button,Image, TextInput,TouchableOpacity} from "react-native";
import Btn from "../components/Btn";
import Field from "../components/Field";
import { background, btnColor, darkPink, headColor } from "../components/Constants"
import { ForgotPasswordForUser } from "./Api";
import { useNavigation } from "@react-navigation/native";


const ForgotPassword = () => {

    const navigation = useNavigation();
    const [mNumber,setNumber]  = useState('');
    const [loading,setLoading] = useState();

    const onclickGetOTP = async () => {
      setLoading(true);
     if( mNumber.length == 0){
      alert('Enter the mobile number')
     }else if(mNumber.length != 10){
       alert('Enter correct mobile number')
     }else{
      await ForgotPasswordForUser({
         "mobile":mNumber
      }).then(res=>{console.log(res.data)
      if(res.data.message ==  "OTP Generated" ){
         console.log('uid',res.data.data[0].UserId,res.data.data[0].Flag)
         navigation.navigate('ForgotPasswordOtp',{eId:(res.data.data[0].Flag == 'U') ? res.data.data[0].UserId : res.data.data[0].EmpId ,flag:res.data.data[0].Flag})
      }else{
        alert('Try again') 
      }
      }).catch(err=>(console.log(err)));
      
   }
     setLoading(false);
    }

    return (
       <View style={styles.body}>

        <Image
        style={styles.image}
        resizeMode='cover'
        source={require('../assets/appLogo.png')}
        
        />
        <Text style={styles.head}>Forgot Password</Text>
        <View style={styles.parent}>
        <View style={styles.container}>
        <Field width="80%"
        keyboardType='numeric'
         placeholder="Mobile Number"
         value={mNumber} 
        onChangeText={(value)=>setNumber(value)}
            />
        </View>
        </View>

        <Btn
         textColor="white"
         bgColor={btnColor}
         Press={onclickGetOTP}
         btnLabel="Get OTP"
        />

        {loading ?  <Image  source={require('../assets/loading.gif')} /> : null} 
       </View>

       
    );
};

const styles = StyleSheet.create({

   body:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:'#F9E5F3',
   },

   parent:{
    paddingVertical:85,
    width:"90%",
    backgroundColor:'white',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:25,
   },
   
   container:{
    flexDirection:'row',
      borderWidth:0.5,
      alignItems:'center',
      borderRadius:8,
      marginBottom:10
   },

   image:{
    marginBottom: 25,
      width:100,
      height:100,
      borderRadius:70
   },

   head:{
    fontSize:22,
    fontWeight:'bold',
    marginBottom:25
   }

});

export default ForgotPassword;
