import { useNavigation } from "@react-navigation/native";
import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, Alert,Button,Image, TextInput,TouchableOpacity} from "react-native";
import Btn from "../components/Btn";
import { background, btnColor, darkPink, headColor } from "../components/Constants";
import Field from "../components/Field";
import { sendOtp } from "./Api";

const Otp = ({route}) =>{
    const eId = route.params.eId;
    const flag = route.params.flag;

    const [otp,setOtp] = useState('');
    const navigation = useNavigation();
    const [loading,setLoading] = useState();
    const onPressSubmit = async() =>{  
      setLoading(true);
      console.log('otpS',eId,flag);
        try{
            if(otp.length !=0 )  {                   // otp 
                //alert('Verifying Otp...');
                await sendOtp({
                  "id":eId,
                  "otp":otp
                })
                .then(res =>{
                 console.log(res.data);
                  if(res.data.data == "Verified"){
                    alert('Successful!');
                    navigation.navigate('SetPassword',{
                      EID:eId,
                      flag:flag
                    });
                  }
                  else {alert('Wrong OTP!!');}
                })
                .catch(error =>{console.log(error)})
              
            }
              else if(otp.length == 0) {
                alert('Please enter your OTP.')
            }        
         
        }catch(error){
            alert(error);
        }
        setLoading(false);
    }
  return (
    <View style={styles.body}>
      
        <Text style={styles.head}>Verification</Text>
       <View style={styles.parent}>
            <View style={styles.container}>
            <Field width="70%"
            placeholder="Enter OTP" 
            keyboardType="numeric" 
            onChangeText={(value)=>setOtp(value)}
            />
            </View>
            <Btn
              textColor="white"
              bgColor={btnColor}
              btnLabel="Submit"
              Press={onPressSubmit}
            />
            
            {loading ?  <Image  source={require('../assets/loading.gif')} /> : null}
       </View>
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
    parent:{
       // height:400,
       paddingVertical:50, 
       width:"90%",
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:25,
        borderWidth:0.5,
        
        
      },
      container:{
        flexDirection:'row',
        borderWidth:0.5,
        alignItems:'center',
        borderRadius:8,
      },
      head:{
        fontSize:32,
        //fontWeight:"bold",
       color:headColor,
       marginBottom:50
      },
      
});

export default Otp;