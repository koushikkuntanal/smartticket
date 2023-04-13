import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, Alert,Button,Image, TextInput,TouchableOpacity} from "react-native";
import { background, btnColor, headColor } from "../components/Constants";
import Field from "../components/Field";
import Ionicons from '@expo/vector-icons/Ionicons';
import { darkPink } from "../components/Constants";
import Btn from "../components/Btn";
import { useNavigation } from "@react-navigation/native";
import { setPasswordApi, UsersChangePasswordApi } from "../Screens/Api";

const UsersPasswordChange = ({ route }) => {
    const id = route.params.ID;
    const Flag = route.params.flag;

    const [password,setPassword] = useState('');
    const[confirmPassword,setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigation=useNavigation();
    const [loading,setLoading] = useState();

    const onPressSubmit = async() =>{
        setLoading(true);
       
        try{
          if(password == confirmPassword && password != '' && confirmPassword != '' && password.length>=8)
          {
            //Alert.alert('Success!!','Redirecting to Login Screen.');
            await UsersChangePasswordApi({
              "Id":id,
              "Password":password,
              "flag":Flag
            })
            .then(res=>{console.log(res.data.message)
              if(res.data.message == 'Employee Password Changed'){
               alert('Password is changed!');
              }
              else alert('Try again');
             
            })
            .catch(error=>{console.log(error)})
          
  
  
          }else if(password == '' || confirmPassword == ''){
            Alert.alert('Alert!','Please enter both the fields.');
          }else if(password != confirmPassword ){
            Alert.alert('Alert','Password mismatch.')
          }else if(password.length <8){
            alert('Password must be atleast 8 characters in length.')
          }
  
        }catch(error){
          console.log(error);
        }
        setLoading(false);
      }
    return(
        <View style={styles.body}>
        <Text style={styles.head}>Password Setup</Text>
      <View style={styles.parent}>
     <View style={styles.container}>
     <Field width="58%"
         placeholder="Enter New Password" 
         secureTextEntry={!showPassword}
         password={true}
            onChangeText={(value)=>setPassword(value)}
            />
            {/* <Button
        title={showPassword ? "Hide" : "Show"}
        onPress={() => setShowPassword(!showPassword)}
      /> */}
      <Ionicons.Button
      name={showPassword ? 'eye' :'eye-off'}
      onPress={() => setShowPassword(!showPassword)}
      backgroundColor={background}
      iconStyle={{color:'black'}}
    
      />
     </View>

        <View style={styles.container}>
        <Field width="70%"
         placeholder="Confirm New Password" 
         secureTextEntry={true}
         password={true}
            onChangeText={(value)=>setConfirmPassword(value)}
           
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

export default UsersPasswordChange