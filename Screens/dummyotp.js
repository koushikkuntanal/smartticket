import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, Alert,Button,Image, TextInput,TouchableOpacity} from "react-native";
import Btn from "../components/Btn";
import { background, btnColor, darkPink, headColor } from "../components/Constants";
import Field from "../components/Field";
import { getAxiosApi, postAxiosApi, postAxiosApiOtp } from "./Api";
import { StatusBar } from "expo-status-bar";

const Dummyotp = () =>{
  const route = useRoute();
//    const [Umobile,setUmobile] = useState('');
    const [Uotp,setUotp] = useState('');
    const [userlist,setuserlist] = useState();
    const [remainingTime, setRemainingTime] = useState(60);
    const navigation = useNavigation();
    
    const uid = (route.params.Uid);
    const onPressSubmit = () =>{
    //   console.log(route.params.Otp);
    //   console.log('os');

        try{
           console.log('otp s',uid);
            if(Uotp.length !=0 ) {                   // otp 
               // alert('Verifying phonenumber and Otp...');
                postAxiosApiOtp({
                 "id":uid,
                 "otp":Uotp,
              })
              .then(Response=>{console.log(Response.data);

               if(Response.data.data == "Verified"){
                alert('Verified');
                navigation.navigate('Login');
              }
                else 
                 {alert('Wrong OTP!!')}
              })
              .catch(error =>{alert(error)})
              
            }
            
        //     else if(Umobile.length == 0)
        //     {
        //       Alert.alert('warning','Enter number');
        //     }
        //    else if(Umobile.length != 10)
        //    {
        //       Alert.alert('Warning','Enter valid phone number');
        //    }
            
            else if(Uotp.length == 0 ) {
                alert('Please enter your OTP.')
            }   
            // else if(Uotp !== route.params.Otp){
            //   alert('Wron')
            // }     
         
        }catch(error){
            alert(error);
        }
    }

    

    // useEffect(() => {
    //     (async () =>{
    //         await getAxiosApi()
    //         .then(res=>{console.log(res.data)})
    //         .catch(error=>{console.log(error)})
            
    //       })();

    // }, []);

    useEffect(() => {
      if (remainingTime === 0) {
        // Handle OTP expiration here
        console.log('OTP expired');
      } else {
        const timerId = setInterval(() => {
          setRemainingTime(prevTime => prevTime - 1);
        }, 1000);
        return () => clearInterval(timerId);
      }
    }, [remainingTime]);
  return (
    <View style={styles.body}>
          <StatusBar hidden={false} style="light" backgroundColor='#f9e5f3'  />
        <Text style={styles.head}>Verification</Text>
        
       <View style={styles.parent}>
            {/* <View style={styles.container}>
            <Field width="70%"
             editable={true}
            keyboardType="numeric"
         placeholder="Mobile Number" 
         onChangeText={(value)=>setUmobile(value)}
            />
            </View> */}
            <View style={styles.container}>
            <Field width="70%"
            placeholder="Enter OTP" 
            keyboardType="numeric" 
            onChangeText={(value)=>setUotp(value)}
            />
            </View>
            <Btn
              textColor="white"
              bgColor={btnColor}
              btnLabel="Submit"
              Press={onPressSubmit}
             
            />

            <TouchableOpacity>
              <Text>Resend OTP</Text>
            </TouchableOpacity>
          
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>OTP countdown: {remainingTime}</Text>
            </View>
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
       // borderWidth:0.5,
        
        
      },
      container:{
        flexDirection:'row',
        borderWidth:0.5,
        alignItems:'center',
        borderRadius:8,
        marginTop:10
      },
      head:{
        fontSize:32,
        //fontWeight:"bold",
       color:headColor,
       marginBottom:15
      },
    
});

export default Dummyotp;