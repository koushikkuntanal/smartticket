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
import DateTimePicker from '@react-native-community/datetimepicker';

import { useNavigation } from "@react-navigation/native";
import { ProfileApi } from "./Api";


const Userregistration=({route}) =>{

  const Data = route.params.data;
  console.log('profile screen data',Data);
 const [profile,setProfile] = useState({});
  const navigation = useNavigation('');
  const [name,setName] = useState('');
  const [gender, setGender] = useState('Unknown');
   const noImage = require('../assets/icon.png');
  const [image,setImage]  = useState('');
const [hasPermission,setHasPermission] = useState(); 
const [profilepic,setProfilePic] = useState(false);

const today = new Date();
const [date, setDate] = useState(new Date());
const [showDatePicker, setShowDatePicker] = useState(false);
const [loading,setLoading] = useState();

const onChange = (event, selectedDate) => {
  const currentDate = selectedDate;
  setShowDatePicker(Platform.OS === 'ios');
  setDate(currentDate);
  console.log('selected',currentDate);
  let dob=currentDate.getFullYear() + '-'+ (currentDate.getMonth()+1) + '-' + currentDate.getDate();
    console.log('emp do',dob );
    var  dd =currentDate.getDate();
    var mm =currentDate.getMonth()+1;
    var yyyy = currentDate.getFullYear();

    if(dd<10){
      dd='0'+dd;
    }
    if(mm<10){
      mm='0'+mm;
    }
    dob = dd+'-'+mm+'-'+yyyy;
    console.log('after',dob);
};

const showDatepicker = () => {
  setShowDatePicker(true);
};

    const onPressHandler = () => {
      setLoading(true);
      navigation.navigate('Edit Profile',{data:Data});
      setLoading(false);
    }
    
  

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
         {console.log(Data.Uphoto)}
             <StatusBar hidden={false} style="light" backgroundColor='#f9e5f3'  />
            <Text style={styles.head}>Profile</Text>
            
             {(Data.Uphoto == '')?  
            <View style={{borderWidth:1,borderRadius:60}}>
           <Image
              style={styles.image}
              resizeMode='cover'
              
              source={require('../assets/Noimage.png')}
              
             />  
              
           </View>
       :
            
            Data.Uphoto && <View style={{borderWidth:1,borderRadius:60}}><Image resizeMode='contain' source={{uri:Data.Uphoto}} style={styles.image}/>
             
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
            width:"70%",}}>
           <View style={styles.container}>
            <Text style={styles.text}>Name</Text>
            <Field
             width="100%"
             value={`: ${(Data.Uname)}`}
             editable={true}
             placeholder="Name" 
           onChangeText={(value)=>setName(value)}
            />
            </View>
            <View style={styles.container}>
            <Text style={styles.text}>Email</Text>
            <Field
             width="100%"
             value={`: ${(Data.Uemail)}`}
             editable={false}
             placeholder="Email" 
           
            />
            </View>
            <View style={[styles.container,{height:40},]}>
            <Text style={styles.text}>Gender</Text>
            { <Picker
              itemStyle={{height:40}}
              value={`: ${(Data.Ugender)}`}
              selectedValue={Data.Ugender}
              //selectedValue='Male'
              onValueChange={(value, index) => setGender(value)}
              mode="dropdown" // Android only
              style={styles.picker}
            >
              <Picker.Item style={styles.pickerItem} label="Select Gender" value="Unknown" />
              <Picker.Item style={styles.pickerItem} label=": Male" value="Male" />
              <Picker.Item style={styles.pickerItem} label=": Female" value="Female" />
              <Picker.Item style={styles.pickerItem} label=": Others" value="NA" />
            </Picker> }

            </View>
            <View style={styles.container}>
            <Text style={styles.text}>Mobile</Text> 
            <Field width="100%"
            value={`: ${(Data.Umobile)}`}
             editable={true}
            keyboardType="numeric"
         placeholder="Mobile Number" 
       // onChangeText={(value)=>setNumber(value)}
            />
            </View>

          
            {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          maximumDate={today}
          value={date}
          mode="date"
          is24Hour={false}
          display="default"
          onChange={onChange}
        />
      )}
         <View style={styles.container}>
         
         <Text style={styles.text}>DOB</Text>
                   <Field 
                   value= {`: ${(Data.UDoB)}`}
                placeholder={"DOB"}
              width="57%"
             
                />
                   
                <Ionicons.Button
                    name="calendar"
                    color='black'
                    onPress={showDatepicker}
                    backgroundColor={background}
                  
                    />
                    

         </View>
            <View style={styles.container}>
            <Text style={styles.text}>Adress 1</Text> 
            <Field width="100%"
             value= {`: ${(Data.UAddr1)}`}
             editable={true}                                              
            placeholder="Address line 1" 
            multiline={true}
            
          // onChangeText={(value)=>setNumber(value)}
               />

            </View>
            <View style={styles.container}>
            <Text style={styles.text}>Adress 2</Text>  
            <Field width="100%"
             value= {`: ${(Data.UAddr2)}`}
             editable={true}
            placeholder="Address line 2" 
            multiline={true}
            
          // onChangeText={(value)=>setNumber(value)}
               />

            </View>
            <View style={styles.container}>
            <Text style={styles.text}>City</Text>   
            <Field width="100%"
             value= {`: ${(Data.Ucity)}`}
             editable={true}
            placeholder="City" 
           
            
          // onChangeText={(value)=>setNumber(value)}
               />

            </View>
            <View style={styles.container}>
            <Text style={styles.text}>Pincode</Text>   
            <Field width="100%"
             value= {`: ${(Data.UPinCode)}`}
             editable={true}
            placeholder="Pin-Code" 
           keyboardType='numeric'
            
          // onChangeText={(value)=>setNumber(value)}
               />

            </View>
            <View style={styles.container}>
            <Text style={styles.text}>Aadhar</Text>   
            <Field width="100%"
              value= {`: ${(Data.Uaadhar)}`}
             editable={true}
            keyboardType="numeric"
         placeholder="Aadhar Number" 
       // onChangeText={(value)=>setNumber(value)}
            />
            
            </View>
             
            </View>  
           </View>
           {loading ?  <Image  source={require('../assets/loading.gif')} /> : null}
           <Btn
            textColor="white"
            bgColor={btnColor}
            btnLabel="Edit"
            Press={onPressHandler}
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
      //marginTop:Constants.statusBarHeight
    },
    head:{
        fontSize:30,
        //fontWeight: 'bold',
       color:'#000000',
       marginTop: 20,
          
      
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
        marginTop:12,
        
      },
      container1: {
        flexDirection: 'row',                       //alert views
       backgroundColor: background,
       // flexDirection:'center',
        //alignItems:'center',
       justifyContent:'space-between',
       borderRadius:8,
       
      },
      image:{
        //backgroundColor:'lightblue',
       
        borderRadius:125,
        borderWidth:7,
        borderColor:background,
        alignSelf:'center',
        width:120,
        height:120,
        //marginBottom:10,
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
      width: "70%",
      height:40,
      
 
   
      
    },
    pickerItem:{
      //backgroundColor:'gold',
      width:40, 
      height:40,
      fontSize:12         
    },
    
    datePickerStyle: {
      width: 200,
      marginTop: 20,
      
    },
    date:{
      borderWidth: 1,
      borderColor: 'black',
      marginBottom: 5
    },



    
});
export default Userregistration;