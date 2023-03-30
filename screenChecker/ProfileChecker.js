import React, { useState,useEffect } from "react";
import { ScrollView,View, Text, StyleSheet, Alert,Button,Image, TextInput,TouchableOpacity,ToastAndroid, ImageBackground} from "react-native";
import { background, btnColor, darkPink, headColor } from "../components/Constants";
import Field from "../components/Field";
import { StatusBar } from 'react-native';
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from "@react-native-picker/picker";
import Btn from "../components/Btn";


const ProfileChecker=() =>{

  const [gender, setGender] = useState('Unknown');
   const noImage = require('../assets/appLogo.png');
  const [image,setImage]  = useState('');
const [hasPermission,setHasPermission] = useState(); 
const [profilepic,setProfilePic] = useState(false);

useEffect(()=>{
  (async()=> {
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasPermission(mediaPermission.status ==="granted");
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
    setImage(result.assets[0].uri);
    setProfilePic(true);
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
      setImage(result.assets[0].uri);
      setProfilePic(true);
     
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
      <ScrollView style={{backgroundColor:'#F9E5F3' ,flex:1}}>
        
        <View style={styles.body}>
             <StatusBar hidden={false} style="light" backgroundColor={background}  />
            <Text style={styles.head}>Profile</Text>
            
            { !profilepic?  
            <View>
           <Image
              style={styles.image}
              resizeMode='cover'
              
              source={require('../assets/noProfile.jpeg')}
              
             />  
              <View style={{backgroundColor:'pink',position:'absolute',right:1,bottom:1,padding:11,borderRadius:100}}><Ionicons name='camera' size={28} color="black" onPress={openDialog}/></View>
           </View>
       :
            
            image && <View><Image resizeMode='contain' source={{uri:image}} style={styles.image}/>
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
            width:"85%",}}>
           <View style={styles.container}>
            <Field width="100%"
             editable={false}
         placeholder="Name" 
       // onChangeText={(value)=>setNumber(value)}
            />
            </View>
            <View style={[styles.container,{height:40},]}>
            <Picker
              itemStyle={{height:40}}
              //selectedValue={gender}
              selectedValue='Male'
              onValueChange={(value, index) => setGender(value)}
              mode="dropdown" // Android only
              style={styles.picker}
            >
              <Picker.Item style={styles.pickerItem} label="Select Gender" value="Unknown" />
              <Picker.Item style={styles.pickerItem} label="Male" value="Male" />
              <Picker.Item style={styles.pickerItem} label="Female" value="Female" />
              <Picker.Item style={styles.pickerItem} label="Others" value="NA" />
            </Picker>

            </View>
            <View style={styles.container}>
            <Field width="100%"
             editable={false}
            keyboardType="numeric"
         placeholder="Mobile Number" 
       // onChangeText={(value)=>setNumber(value)}
            />
            </View>
            <View style={styles.container}>
            <Field width="100%"
             editable={false}
            placeholder="Address line 1" 
            multiline={true}
            
          // onChangeText={(value)=>setNumber(value)}
               />

            </View>
            <View style={styles.container}>
            <Field width="100%"
             editable={false}
            placeholder="Address line 2" 
            multiline={true}
            
          // onChangeText={(value)=>setNumber(value)}
               />

            </View>
            <View style={styles.container}>
            <Field width="100%"
             editable={false}
            placeholder="City" 
           
            
          // onChangeText={(value)=>setNumber(value)}
               />

            </View>
            <View style={styles.container}>
            <Field width="100%"
             editable={false}
            placeholder="Pin-Code" 
           keyboardType='numeric'
            
          // onChangeText={(value)=>setNumber(value)}
               />

            </View>
            <View style={styles.container}>
            <Field width="100%"
             editable={false}
            keyboardType="numeric"
         placeholder="Aadhar Number" 
       // onChangeText={(value)=>setNumber(value)}
            />
            </View>
            
            </View>
           </View>
           <Btn
            textColor="white"
            bgColor={btnColor}
            btnLabel="Save"
            />
            
        </View>
        </ScrollView>
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
    picker: {
      
      alignSelf:'center',
      width: "100%",
      height:40,
 
   
      
    },
    pickerItem:{
      //backgroundColor:'gold',
      width:40, 
      height:40,
      fontSize:12         
    },
    
});
export default ProfileChecker;