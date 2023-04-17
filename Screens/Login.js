// import React, { useState,useEffect } from "react";
// import { View, Text, StyleSheet, Alert,Button,Image, TextInput,TouchableOpacity} from "react-native";
// import { StatusBar } from 'react-native';
// import Btn from "../components/Btn";
// import { background, btnColor, darkPink, headColor } from "../components/Constants";
// import Field from "../components/Field";
// import Ionicons from '@expo/vector-icons/Ionicons';
// import { useNavigation } from "@react-navigation/native";

// const Login = () =>{
//     //const reg =  /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w\w+)+$/;
//     const [number,setNumber] = useState('');
//   const [password,setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
  
//   const navigation=useNavigation();
//   const onPressRegister = () => {
//     navigation.navigate('Signup');
//   }
//   const onPressSubmit = ()=>{
//     try{
//       if((number.length === 10) && password.length>=8){
//         alert('Success!! Redirecting to Home Page...');
//         navigation.navigate('tab');
      
//       }else if(number.length == 0)
//       {
//         Alert.alert('warning','Enter number');
//       }
//        else if(number.length != 10)
//        {
//         Alert.alert('Warning','Enter valid phone number');
//        }
//       else if(password.length ==0){
//         Alert.alert('Warning','Enter password');
//       }
//       else if(password.length<8){
//         alert('Please enter correct password.')
//       }

//     }catch(error){
//       alert(error);
//     }
//   }
//   return (
//     <View style={styles.body}>
//          <StatusBar hidden={false} style="light" backgroundColor='#f9e5f3'  />

//         <Image
//         style={styles.image}
//         resizeMode='cover'
//         source={require('../assets/appLogo.png')}
        
//       />
//        <Text style={styles.head}>Login</Text>
//         <View style={styles.parent}>
//         <View style={styles.container}>
//                  <Field 
//                 width="70%"
//                 value={number}
//                 editable={true}
//                 keyboardType="numeric"
//                 placeholder="Phone number"
//                 onChangeText={(value)=>setNumber(value)}
//                 />
//         </View>
//         <View style={styles.container}>
//         <Field width="57%"
//         secureTextEntry={!showPassword}
//         password={true}
//          placeholder="Password" 
//          onChangeText={(value)=>setPassword(value)}
//             />
//              <Ionicons.Button
//       name={showPassword ? 'eye' :'eye-off'}
//       onPress={() => setShowPassword(!showPassword)}
//       backgroundColor={background}
//       iconStyle={{color:'black'}}
    
//       />
//         </View>

//       <TouchableOpacity>
//         <Text>Forgot Password?</Text>
//       </TouchableOpacity>

//       <View style={{flexDirection:'row'}}>
//         <Text>Do you have an account? </Text>
//         <TouchableOpacity  onPress={onPressRegister}><Text style={styles.textR}>Register</Text>
       
        
//       </TouchableOpacity>
//       </View>
        
//     </View>

//           <Btn
//               textColor="white"
//               bgColor={btnColor}
//               btnLabel="Submit"
//              Press={onPressSubmit}
            
//             />
//         </View>
//   );
// }
// const styles = StyleSheet.create({
//     body: {
//       flex: 1,
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor:'#F9E5F3'
//     },
//     parent:{
//       //height:400,
//       paddingVertical:50,
//       width:"90%",
//       backgroundColor:'white',
//       alignItems:'center',
//       justifyContent:'center',
//       borderRadius:25,
//       //borderWidth:0.5, 
//     },
//     container:{
//       flexDirection:'row',
//       borderWidth:1,
//       alignItems:'center',
//       borderRadius:8,
//       marginBottom:16
//     },
//     head:{
//       fontSize:27,
//       //fontWeight:"bold",
//      color:headColor,
//      marginBottom:7
//     },
//     image: {
//       marginBottom: 20,
//       width:90,
//       height:90,
//       borderRadius:70
//     },

//     textR:{
//       textDecorationLine: 'underline',
      
//     },

    
// });

// export default Login;

import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, Alert,Button,Image, TextInput,TouchableOpacity} from "react-native";
import Btn from "../components/Btn";
import { background, btnColor, darkPink, headColor } from "../components/Constants";
import Field from "../components/Field";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { LoginApi} from "./Api";

const LekpayLogin = () =>{
  const [mNumber,setNumber]  = useState('');
  const [password,setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation=useNavigation();
  const [loading,setLoading] = useState();

  const onPressRegister = () => {
        navigation.navigate('Signup');
       }
  const onPressSubmit = async()=>{
    setLoading(true);
    try{
      if(mNumber.length == 10 && password.length>=8){
        
        //alert('Success!! Redirecting to HomePage...');
        await LoginApi({
          "Mobile":mNumber,
          "Password":password
        })
        .then(res=>{console.log('data after login',res.data)
          if(res.data.message == "Wrong Phone number/Password!!"){
            alert('Wrong Phone number/Password!!');
          }
          else if(res.data.data[0].Flag == 'E'){
            alert('Emp');
            navigation.navigate('AllScreens',{
              ID:res.data.data[0].AuthID,
              flag:res.data.data[0].Flag,
              mobileNumber:mNumber,
              Type:res.data.data[0].Type,
            });
          }
          else if(res.data.data[0].Flag == 'U') {
            alert('Login Successful');
            navigation.navigate('tab',{userData:res.data.data[0]}
    )
          }

          else alert('User not exist.')
        })
        .catch(error=>{console.log(error)})

        
      }else if(mNumber.length != 10 || mNumber.length == 0){
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
        <Btn
              textColor="white"
              bgColor={btnColor}
              btnLabel="Submit"
              Press={onPressSubmit}
            
            />

        <TouchableOpacity>
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