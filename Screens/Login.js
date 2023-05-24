

import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, Alert,Button,Image, TextInput,TouchableOpacity} from "react-native";
import Btn from "../components/Btn";
import { background, btnColor, darkPink, headColor } from "../components/Constants";
import Field from "../components/Field";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { LoginApi, ProfilePic} from "./Api";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from 'expo-checkbox';

const LekpayLogin = () =>{
  const [mNumber,setNumber]  = useState('');
  const [password,setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation=useNavigation();
  const [loading,setLoading] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecked, setChecked] = useState(false);
 const [image,setImage] = useState('');
  const onPressCheck =async (value)=>{
    let rbValue;
    if(value == false){
      rbValue='0';
    }
    else{
      rbValue='1'
    }
   await  AsyncStorage.setItem('RememberMe',rbValue);
   setChecked(value);

  }
  useEffect(()=>{
    setLoading(true);
    (async ()=>{
     
      const Mobile = await AsyncStorage.getItem('Mobile');
      const Password = await AsyncStorage.getItem('Password');
      console.log('creds',Mobile,Password);
      const RememberMe = await AsyncStorage.getItem('RememberMe');
      if(RememberMe == '1'){
        setChecked(true);
      }else {
        setChecked(false);
      }
      console.log('RememberMe',RememberMe);
      if (Mobile != null && Password != null && RememberMe == '1'){
        await LoginApi({
          "Mobile":Mobile,
          "Password":Password
        })
        .then(async res=>{console.log('data after login',res.data)
          if(res.data.message == "Wrong Phone number/Password!!"){
            // alert('Wrong Phone number/Password!!');
          }
          else if(res.data.data[0].Flag == 'E'){
          
            // alert('Emp');
            navigation.navigate('AllScreens',{
              ID:res.data.data[0].AuthID,
              flag:res.data.data[0].Flag,
              mobileNumber:res.data.data[0].MobileNo,
              Type:res.data.data[0].Type,
            });
          }
          else if(res.data.data[0].Flag == 'U') {
            // alert('Login Successful');
                await ProfilePic({
                  "UserId":res.data.data[0].AuthID
                }).then(resI=>{
                  console.log('aoui fro profiag hot',resI.data.length);// console.log('pro data',resI.data);
                  setImage(`data:image/jpeg;base64,${resI.data}`);
                  navigation.navigate('tab',{userData:res.data.data[0],imageData:`data:image/jpeg;base64,${resI.data}`}
                  )
                }).catch(err=>{
                  console.log('err pro sata',err)
                })
            
           
          }
          else alert('User does not exist.')
        })
        .catch(error=>{console.log(error)})  
      }
    })();
    setLoading(false);
  },[]) 

  const onPressRegister = () => {
        navigation.navigate('Signup');
       }

  const onPressForgot = () => {
    navigation.navigate('ForgotPassword')
  }     
  const onPressSubmit = async()=>{
    setLoading(true);
   
    try{
      if(mNumber.length == 10 && password.length>=8){
        await LoginApi({
          "Mobile":mNumber,
          "Password":password
        })
        .then(async res=>{console.log('data after login',res.data)
          if(res.data.message == "Wrong Phone number/Password!!"){
            alert('Wrong Phone number/Password!!');
          }
          else if(res.data.data[0].Flag == 'E'){
            console.log('Asy',mNumber)
            AsyncStorage.setItem('Mobile',mNumber);
            AsyncStorage.setItem('Password',password);
            // alert('Emp');
            navigation.navigate('AllScreens',{
              ID:res.data.data[0].AuthID,
              flag:res.data.data[0].Flag,
              mobileNumber:mNumber,
              Type:res.data.data[0].Type,
            });
          }
          else if(res.data.data[0].Flag == 'U') {
            // alert('Login Successful');
            AsyncStorage.setItem('Mobile',mNumber);
            AsyncStorage.setItem('Password',password);
            console.log('data',res.data.data[0])
            await ProfilePic({
              "UserId":res.data.data[0].AuthID
            }).then(resI=>{
              console.log('this should be format',res.data.data[0]);
              console.log('aoui fro profiag hot',resI.data.length);// console.log('pro data',resI.data);
              setImage(`data:image/jpeg;base64,${resI.data}`);
              
              navigation.navigate('tab',{userData:res.data.data[0],imageData:`data:image/jpeg;base64,${resI.data}`}
              )
            }).catch(err=>{
              console.log('err pro sata',err)
            })
          }
          else alert('User does not exist.')
        })
        .catch(error=>{console.log(error)})  
      }
      else if(mNumber.length == 0){
        alert('Enter phone number');
      }else if(mNumber.length != 10){
        alert('Please enter valid number');
      }else if(password.length<8){
        alert('Please enter password of length more than 8.')
      }

    }catch(error){
      alert(error);
    }
    setNumber('');
    setPassword('');
    setLoading(false);
  }
  return (
    <View style={styles.body}>
      <StatusBar  backgroundColor='#f9e5f3' style={{backgroundColor: '#FFFFFF'}}></StatusBar>
        <Image
        style={styles.image}
        resizeMode='cover'
        source={require('../assets/appLogo.png')}
        
      />
       <Text style={styles.head}>Login</Text>
        <View style={styles.parent}>
        <View style={styles.container}>
        <Field width="70%"
        keyboardType='numeric'
         placeholder="Mobile Number"
         value={mNumber} 
        onChangeText={(value)=>setNumber(value)}
            />
        </View>
        <View style={styles.container}>
        <Field width="57%"
        secureTextEntry={!showPassword}
        password={true}
         placeholder="Password" 
         value={password}
         onChangeText={(value)=>setPassword(value)}
            />
             <Ionicons.Button
      name={showPassword ? 'eye' :'eye-off'}
      onPress={() => setShowPassword(!showPassword)}
      backgroundColor={background}
      iconStyle={{color:'black'}}
    
      />
        </View>
        <View style={{flexDirection:'row'}}>
         <Text>Remember Me </Text>
         <Checkbox style={styles.checkbox} value={isChecked} onValueChange={(value)=>onPressCheck(value)} />
        
       
       </View>
        <Btn
              textColor="white"
              bgColor={btnColor}
              btnLabel="Submit"
              Press={onPressSubmit}
            
            />

        <TouchableOpacity onPress={onPressForgot}>
         <Text>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={{flexDirection:'row'}}>
         <Text>Do you have an account? </Text>
         <TouchableOpacity  onPress={onPressRegister}><Text style={styles.textR}>Register</Text>
       
        
       </TouchableOpacity>
       </View>
       
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
      backgroundColor:'#F9E5F3',
    },
    parent:{
      //height:400,
      paddingVertical:50,
      width:"90%",
      backgroundColor:'white',
      alignItems:'center',
      justifyContent:'center',
      borderRadius:25,
      //borderWidth:0.5, 
    },
    container:{
      flexDirection:'row',
      borderWidth:0.5,
      alignItems:'center',
      borderRadius:8,
      marginBottom:10
    },
    head:{
      fontSize:32,
      //fontWeight:"bold",
     color:headColor,
     marginBottom:50
    },
    image: {
      marginBottom: 20,
      width:100,
      height:100,
      borderRadius:70
    },

    textR:{
      textDecorationLine: 'underline',
    }
});

export default LekpayLogin;