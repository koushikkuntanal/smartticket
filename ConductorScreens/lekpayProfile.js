import React, { useState,useEffect } from "react";   //Not usig this LekpayProfile is used from Coductor profile
import { ScrollView,View, Text, StyleSheet, Alert,Button,Image, TextInput,TouchableOpacity,ToastAndroid, ImageBackground} from "react-native";
import { background, btnColor, darkPink, headColor } from "../components/Constants";
import Field from "../components/Field";
import { StatusBar } from 'react-native';
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from "@react-native-picker/picker";
import Btn from "../components/Btn";
import { ProfileApi, ProfilePic } from "../Screens/Api";
import mime from "mime";
import axios from "axios";


const LekpayProfile=({route}) =>{
 
  const [gender, setGender] = useState('Unknown');
   const noImage = require('../assets/appLogo.png');
  const [image,setImage]  = useState('');
const [hasPermission,setHasPermission] = useState(); 
const [profilepic,setProfilePic] = useState(false);
const empData = route.params.data;

useEffect(()=>{
  
  (async()=> {
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasPermission(mediaPermission.status ==="granted");

    await ProfilePic({
      "UserId":empData.EmpId
    }).then(res=>{
      console.log('pro data got img');
      setImage(`data:image/jpeg;base64,${res.data}`);
    }).catch(err=>{
      console.log('err pro sata',err)
    })
  } 
  )();
  

},[]);


if(hasPermission === undefined){
  return <View style={styles.container1}>
  <Text>Requesting for Permissions.</Text>
  {Alert.alert('Alert!','Permissions being requested',[{text:'Continue'}])}
 </View>
}else if(!hasPermission){
  //return <Text>Enable Permission</Text>
 return <View style={styles.container1}>
  <Text>Please provide Permission in settings and Restart.</Text>
  {Alert.alert('Alert!','Permissions of gallery not granted!',[{text:'OK'}])}
 </View>
}


const pickImage= async () =>{
 
   let result= await ImagePicker.launchImageLibraryAsync({
    mediaTypes:ImagePicker.MediaTypeOptions.Images,
    aspect:[4,3],
    allowsEditing:true,
    quality:1
    
  });
  
if(result){
    // setImage(result.assets[0].uri);
    setProfilePic(true);

    const Fdata = new FormData();
    const newImageUri =  "file:///" + result.assets[0].uri.split("file:/").join("");
    Fdata.append('image',{
      uri : newImageUri,
      type: mime.getType(newImageUri),
      name: empData.EmpId
     
    });
    console.log('dara',Fdata)
  
  try{ const res = await axios.post('https://lekpay.com/upload/userProfile',Fdata,{
    headers:{
      'Content-Type':'multipart/form-data'
    }
  });
  console.log(res.data);
  setImage(`data:image/jpeg;base64,${res.data.data}`);
  }
catch(err){console.log(err)}
  }


} 





  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.Images,
      aspect:[4,3],
      allowsEditing:true,
      quality:1
    });

    // Explore the result
    

    if (result) {
      // setImage(result.assets[0].uri);
      setProfilePic(true);
      const Fdata = new FormData();
      const newImageUri =  "file:///" + result.assets[0].uri.split("file:/").join("");
      Fdata.append('image',{
        uri : newImageUri,
        type: mime.getType(newImageUri),
        name: empData.EmpId
       
      });
      console.log('dara',Fdata)
    
    try{ const res = await axios.post('https://lekpay.com/upload/userProfile',Fdata,{
      headers:{
        'Content-Type':'multipart/form-data'
      }
    });
    console.log(res.data);
    setImage(`data:image/jpeg;base64,${res.data.data}`);
  }catch(err){console.log(err)}
    }
}

const openDialog = () =>{
  Alert.alert('Choose Image!!','Select from either Camera roll or Camera',[{text:'open camera',onPress:openCamera},{text:'Open Camera Roll',onPress:pickImage},{text:'Remove Profile Picture',onPress:removeProfile}],{cancelable:true})
 
}
const removeProfile = ()=>{
  //setImage('https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1371229056.1675413808&semt=sph');
  setProfilePic(false);
  ToastAndroid.show('Profile pic removed',ToastAndroid.LONG)
}
    


    return ( 
      <View style={{backgroundColor:'#F9E5F3' ,flex:1}}>
       
       {console.log('empData',empData)}
        <View style={styles.body}>
             <StatusBar hidden={false} style="light" backgroundColor={background}  />
            <Text style={styles.head}>Profile</Text>
            
           
             {
              image ? <View><Image resizeMode='contain' source={{uri:image}} style={styles.image}/>
              <View style={{backgroundColor:'pink',position:'absolute',right:1,bottom:1,padding:11,borderRadius:100}}><Ionicons name='camera' size={28} color="black" onPress={openDialog}/></View>
             </View> : <View>
           <Image
              style={styles.image}
              resizeMode='cover'
              
              source={require('../assets/noProfile.jpeg')}
              
             />  
              <View style={{backgroundColor:'pink',position:'absolute',right:1,bottom:1,padding:11,borderRadius:100}}><Ionicons name='camera' size={28} color="black" onPress={openDialog}/></View>
           </View>
             }
            {/* <TouchableOpacity
            onPress={openDialog}
            style={styles.button}
            >
              <Text style={{color:'#ffffff'}}>Edit</Text>
            </TouchableOpacity> */}
           <View style={styles.parent}>
           <View elevation={5} style={{backgroundColor:background,padding:35,borderRadius:15,
            width:"75%",}}>
           <View style={styles.container}>
            <Text style={styles.text}>Name</Text>
            <Field width="100%"
             editable={false}
         placeholder="Name" 
         value={`: ${empData.EmpName}`}
       // onChangeText={(value)=>setNumber(value)}
            />
            </View>
            <View style={styles.container}>
            <Text style={styles.text}>DOB</Text>
            <Field width="100%"
             editable={false}
         placeholder="DOB" 
         value={`: ${empData.EmpDOB}`}
       // onChangeText={(value)=>setNumber(value)}
            />
            </View>
           
            <View style={styles.container}>
            <Text style={styles.text}>Mobile</Text>
            <Field width="100%"
             editable={false}
         placeholder="Mobile" 
         value={`: ${(empData.EmpMobile).toString()}`}
       // onChangeText={(value)=>setNumber(value)}
            />
            </View>
            <View style={styles.container}>
            <Text style={styles.text}>Address 1</Text>
            <Field width="100%"
             editable={false}
            placeholder="Address line 1" 
            multiline={true}
            value={`: ${empData.EmpAddr1}`}
          // onChangeText={(value)=>setNumber(value)}
               />

            </View>
            <View style={styles.container}>
            <Text style={styles.text}>Address 2</Text>
            <Field width="100%"
             editable={false}
            placeholder="Address line 2" 
            multiline={true}
            value={`: ${empData.EmpAddr2}`}
          // onChangeText={(value)=>setNumber(value)}
               />

            </View>
            <View style={styles.container}>
            <Text style={styles.text}>City</Text>
            <Field width="100%"
             editable={false}
            placeholder="City" 
           value={`: ${empData.EmpCity}`}
            
          // onChangeText={(value)=>setNumber(value)}
               />

            </View>
            <View style={styles.container}>
            <Text style={styles.text}>Pin</Text>
            <Field width="100%"
             editable={false}
            placeholder="Pin-Code" 
           keyboardType='numeric'
            value={`: ${(empData.EmpPinCode).toString()}`}
          // onChangeText={(value)=>setNumber(value)}
               />

            </View>
            <View style={styles.container}>
            <Text style={styles.text}>Aadhar</Text>
            <Field width="100%"
             editable={false}
            keyboardType="numeric"
         placeholder="Aadhar Number" 
         value={`: ${(empData.EmpAadhar).toString()}`}
       // onChangeText={(value)=>setNumber(value)}
            />
            </View>
            
            </View>
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
      backgroundColor:'#F9E5F3',
      //paddingHorizontal:20
      marginTop:Constants.statusBarHeight
    },
    head:{
        fontSize:32,
       
       color:'#000000',
      
      },
      text:{
        fontSize:12,
        width:70
      },
      container:{
        
        flexDirection:'row',
        borderWidth:0,
        alignItems:'center',
        borderRadius:8,
        marginBottom:10,
        
      },
      parent:{
        alignItems: 'flex-start',
        marginTop:10
      },
      container1: {
        flex: 1,                       //alert views
       backgroundColor: background,
       // flexDirection:'center',
        alignItems:'center',
       justifyContent:'center'
       
      },
      image:{
        //backgroundColor:'lightblue',
       
        borderRadius:125,
        borderWidth:7,
        borderColor:background,
        alignSelf:'center',
        width:150,
        height:150,
        marginBottom:10,
       // aspectRatio:1,
    },
    button:{
      backgroundColor:btnColor,
      borderRadius: 100,
        alignItems: 'center',
        width: 70,
        marginBottom:10,
        paddingVertical: 5,
       // marginVertical: 10
    },
   
    
});
export default LekpayProfile;   