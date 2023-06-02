import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View,Image, ToastAndroid, ScrollView, TouchableOpacity } from "react-native";
import { background, btnColor } from "../components/Constants";
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-paper";
import { EditprofileApi, ProfilePic, UploadPicApi } from "./Api";
import Field from "../components/Field";
import { Picker } from "@react-native-picker/picker";
import Btn from "../components/Btn";
import mime from "mime";
import axios from "axios";
import moment from "moment";
import * as DocumentPicker from 'expo-document-picker';




let numreg = /^[0-9]+$/;
const EditProfile =({route}) =>{
    const data = route.params.data;
    
    const navigation = useNavigation();
    
    const [name,setName] = useState('');
    const [gender,setGender] = useState('');
    const [mobile,setMobile] = useState('');
    const [Dob,setDob] = useState('');
    const [Upi,setUpi] = useState('');
    const [address1,setAddress1] = useState('');
    const [address2,setAddress2] = useState('');
    const [city,setCity] = useState('');
    const [pin,setPin] = useState('');
    const [aadhar,setAadhar] = useState('');
    const [email,setEmail] = useState('');
    const [image,setImage]  = useState('https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1371229056.1675413808&semt=sph');
    const [profilepic,setProfilePic] = useState(false);
    const [hasPermission,setHasPermission] = useState();
    const [loading,setLoading] = useState(); 
    let numreg = /^[0-9]+$/;
    

    const validateEmail = (email) => {
      const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(email);
    };

    const validateUPIID = (upiId) => {
      const regex = /^[\w.-]+@[\w-]+.[\w]{1,}$/;
      return regex.test(upiId);
    };
    
    
    useEffect(()=>{
       setLoading(true);
        (async()=> {
          const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
          setHasPermission(mediaPermission.status ==="granted");

          await ProfilePic({
            "UserId":data.UserId
          }).then(res=>{
            console.log('pro data',res.data.length);
            setImage(`data:image/jpeg;base64,${res.data}`);
          }).catch(err=>{
            console.log('err pro sata',err)
          })

          
        }



        
        
        )();
        setName(data.Uname);
        setGender(data.Ugender);
        setMobile(data.Umobile);
        setDob(moment(data.UDoB).format("DD-MM-YYYY"));
        setUpi(data.UPI)
        setAddress1(data.UAddr1);
        setAddress2(data.UAddr2);  
        setCity(data.Ucity);
        setPin((data.UPinCode).toString());
        setAadhar(data.Uaadhar);
        setEmail(data.Uemail);
        // if(data.Uphoto != ''){
        //   setImage(data.Uphoto);
        // }
        // else{setImage('https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1371229056.1675413808&semt=sphyyy')}
      setLoading(false);
      },[]);
        
      if(hasPermission === undefined){
        return <View style={styles.container1}>
        <Text>Requesting for Permissions.</Text>
        
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
        setLoading(true);
          // setImage(result.assets[0].uri);
          setProfilePic(true);
          
          const Fdata = new FormData();
            const newImageUri =  "file:///" + result.assets[0].uri.split("file:/").join("");
            Fdata.append('image',{
              uri : newImageUri,
              type: mime.getType(newImageUri),
              name: data.UserId
             
            });
            console.log('dara',Fdata)
          
          try{ const res = await axios.post('https://lekpay.com/upload/userProfile',Fdata,{
            headers:{
              'Content-Type':'multipart/form-data'
            }
          });
          console.log("case 64",res.data);
          setImage(`data:image/jpeg;base64,${res.data.data}`);
        }catch(err){console.log(err)}
         setLoading(false); 
          // await UploadPicApi(data).then(res=>{console.log(res.data,'res pic uploaf')}).catch(err=>{console.log('pic upload err',err)})
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
  
          if (result) {                   //open camera code
            // setImage(result.assets[0].uri);
            setProfilePic(true);
            const Fdata = new FormData();
            const newImageUri =  "file:///" + result.assets[0].uri.split("file:/").join("");
            Fdata.append('image',{
              uri : newImageUri,
              type: mime.getType(newImageUri),
              name: data.UserId
             
            });
            Fdata.append('userId',data.UserId);
            console.log('dara',Fdata)
          
          try{ const res = await axios.post('https://lekpay.com/upload/userProfile',Fdata,{
            headers:{
              'Content-Type':'multipart/form-data'
            }
          });
          console.log("case 64",res.data);
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
        setImage('https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1371229056.1675413808&semt=sph')
        ToastAndroid.show('Profile pic removed',ToastAndroid.LONG)
      
      }
         
      // const handleFileUpload = async () => {
      //   try {
      //     const file = await DocumentPicker.getDocumentAsync({
      //       type: 'application/pdf',
      //     });
      
      //     if (file.type === 'success') {
      //       const fileInfo = await FileSystem.getInfoAsync(file.uri);
      //       const formData = new FormData();
      //       formData.append('file', {
      //         uri: file.uri,
      //         type: 'application/pdf',
      //         name: fileInfo.uri.split('/').pop(),
      //       });
      
      //       // Use your preferred method (e.g., fetch) to upload the file to a server
      //       // Replace 'YOUR_UPLOAD_ENDPOINT' with the actual endpoint URL
      //       const response = await fetch('https://lekpay.com/doc/upload', {
      //         method: 'POST',
      //         body: formData,
      //         headers: {
      //           'Content-Type': 'multipart/form-data',
      //         },
      //       });
            
      //       // Handle the response accordingly
      //       console.log('File uploaded successfully',response);
      //     } else {
      //       console.log('File selection canceled');
      //     }
      //   } catch (error) {
      //     console.error('Error occurred during file upload', error);
      //   }
      // };

     
      const handleDocumentUpload = async () => {
        
          // const result = await DocumentPicker.pick({
          //   type: [DocumentPicker.types.doc, DocumentPicker.types.docx],
          // });

          try{const result = await DocumentPicker.getDocumentAsync({
            type:'application/pdf',
          });



          if (result) {
            // console.log('res',result)
            const formData = new FormData();
            formData.append('file', {
              uri:result.uri,
              type:'pdf',
              name:data.UserId,
            });
            console.log('formData',formData)
            
            //  const res = await fetch('https://lekpay.com/doc/upload', {
            //   method: 'POST',
            //   body: formData,
            //   headers: {
            //     'Content-Type': 'multipart/form-data',
            //   },
            // });
           try{ 
            console.log('fromayuasb',formData)
            const res = await axios.post('https://lekpay.com/doc/upload',formData,{
            headers:{
              'Content-Type':'multipart/form-data'
            }
          });
      console.log('res',res,formData)
    }catch(err){
        console.log('err in api call',err)
      }
            // Handle the response accordingly
          
          } else {
            console.log('File selection canceled');
          }}catch(error){
            console.log('err ',error)
          }
        
      };
      
      
      const onPressSave = async()=>{
        setLoading(true);
       if(image == '')
       {setImage('https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1371229056.1675413808&semt=sph')}
       if(numreg.test(name) === false && name.length!=0 && gender != 'Unknown' && address1.length !=0 && address2.length !=0 &&(city.length !=0 && (numreg.test(city)==false)) && pin.length !=0 && pin.length == 6 && aadhar.length !=0 && aadhar.length == 12 && (validateEmail(email)) == true && (validateUPIID(Upi)) == true ) {
       await EditprofileApi({
            "flag":data.Flag,
            "Id":data.UserId,
            "Name":name,
            "Gender":gender,
            "City":city,
            "Aadhar":aadhar,
            "Pin":pin,
            "Address1":address1,
            "Address2":address2,
            
            "Email":email,
            "Upi":Upi
        })
        .then(async res=>{console.log(res.data.message)
          if(res.data.message == 'Edit Success'){
            await ProfilePic({
              "UserId":data.UserId
            }).then(resI=>{
              console.log('aoui fro profiag hot',resI.data.length);// console.log('pro data',resI.data);
              setImage(`data:image/jpeg;base64,${resI.data}`);
              console.log('this is my format',data)
              navigation.navigate('tab',{userData:data,imageData:`data:image/jpeg;base64,${resI.data}`});
            }).catch(err=>{
              console.log('err pro sata',err)
            })
            alert('Profile Changed!!');
        // navigation.navigate('Screen_A');

        
            
      } else {
          alert('Profile not changed please try again');
        }
      })
        .catch(error=>{console.log(error)
        alert(error)})
       }
       
        
     else if(name.length == 0){
      Alert.alert('Warning','Enter Uname');    
      }
      else if(numreg.test(name) === true)
      {
        Alert.alert('Warning','Enter a valid name');
      }
      else if(gender == 'Unknown'){
          Alert.alert('Warning','Select gender');
         }
      else if(Upi.length == 0){
        Alert.alert('Warning','Enter UPI ID');
      } 
      else if(validateUPIID(Upi) == false){
        Alert.alert('Warning','Enter valid upi id');
      }  
      else if(address1.length == 0)
       {
         Alert.alert('Warning','Enter address1');
       }
       else if(address2.length == 0){
         Alert.alert('Warning','Enter address2');
       }
        else if(city.length == 0)
   {
      Alert.alert('Warning','Enter city name');
   }
   else if(numreg.test(city) === true)
   {
     Alert.alert('Warning','Enter valid city name');
   }
   else if(pin.length == 0)
    {
      Alert.alert('Warning','Enter pincode');
    }
    else if(pin.length !== 6)
    {
      console.log(pin.length)
      Alert.alert('Warning','Enter valid pincode');
    }
      else if(aadhar.length == 0)
   {
     Alert.alert('Warning','Enter Aadhar number');
   }

   else if(aadhar.length != 12)
   {
     Alert.alert('Warning','Enter valid Aadhar number');
   }
   else if(email.length == 0){
    alert('Please enter email!')
   }
   else if((validateEmail(email))== false){
    alert('Please enter valid email');
   }
   setLoading(false);
    }
      
      
    return(
        <ScrollView style={{backgroundColor:'#FFFFFF' ,flex:1}}>
        <View style={styles.body}>
            {console.log('link of img to be sent',image.length)}
            {console.log('data in edit',data)}
             {  
            image && <View style={{borderWidth:1,borderRadius:60}}><Image resizeMode='contain' source={{ uri: image }} style={styles.image}/>
             <View style={{backgroundColor:'pink',position:'absolute',right:1,bottom:1,padding:11,borderRadius:100}}><Ionicons name='camera' size={28} color="black" onPress={openDialog}/></View>
            </View>
            }
            <View style={styles.parent}>
           <View elevation={5} style={{backgroundColor:background,padding:35,borderRadius:15,
            width:"70%",}}>
           <View style={styles.container}>
            <Text style={styles.text}>Name</Text>
            <Field
             width="100%"
             value={`${(name)}`}
             editable={true}
             placeholder="Name" 
           onChangeText={(value)=>setName(value)}
            />
            </View>
            <View style={styles.container}>
            <Text style={styles.text}>Email</Text>
            <Field
             width="100%"
             value={`${(email)}`}
             editable={true}
             placeholder="Email" 
           onChangeText={(value)=>setEmail(value)}
            />
            </View>
            <View style={[styles.container,{height:40},]}>
            <Text style={styles.text}>Gender</Text>
            { <Picker
              itemStyle={{height:40}}
              value={` ${(gender)}`}
              selectedValue={gender}
              //selectedValue='Male'
              onValueChange={(value, index) => setGender(value)}
              mode="dropdown" // Android only
              style={styles.picker}
            >
              <Picker.Item style={styles.pickerItem} label="Select Gender" value="Unknown" />
              <Picker.Item style={styles.pickerItem} label="Male" value="Male" />
              <Picker.Item style={styles.pickerItem} label="Female" value="Female" />
              <Picker.Item style={styles.pickerItem} label="Others" value="NA" />
            </Picker> }

            </View>
            <View style={styles.container}>
            <Text style={styles.text}>Mobile</Text> 
            <Field width="100%"
            value={`${(mobile)}`}
             editable={false}
            keyboardType="numeric"
         placeholder="Mobile Number" 
       // onChangeText={(value)=>setNumber(value)}
            />
            </View>
            <View style={styles.container}>
         
         <Text style={styles.text}>DOB</Text>
                   <Field 
                   value= {`${(Dob)}`}
                placeholder={"DOB"}
              width="57%"
             editable={false}
                />
                </View>

           <View style={styles.container}>
           <Text style={styles.text}>UPI ID</Text>
           <Field width="100%"
            value={`${(Upi)}`}
            editable={true}
            placeholder="UPI ID"
            onChangeText={(value)=>setUpi(value)}
           />
           </View>
            
         
            <View style={styles.container}>
            <Text style={styles.text}>Address 1</Text> 
            <Field width="100%"
             value= {`${(address1)}`}
             editable={true}
            placeholder="Address line 1" 
            multiline={true}
            
          onChangeText={(value)=>setAddress1(value)}
               />

            </View>
            <View style={styles.container}>
            <Text style={styles.text}>Address 2</Text>  
            <Field width="100%"
             value= {`${(address2)}`}
             editable={true}
            placeholder="Address line 2" 
            multiline={true}
            
          onChangeText={(value)=>setAddress2(value)}
               />

            </View>
            <View style={styles.container}>
            <Text style={styles.text}>City</Text>   
            <Field width="100%"
             value= {`${(city)}`}
             editable={true}
            placeholder="City" 
           
            
          onChangeText={(value)=>setCity(value)}
               />

            </View>
            <View style={styles.container}>
            <Text style={styles.text}>Pincode</Text>   
            <Field width="100%"
             value= {`${(pin)}`}
             editable={true}
            placeholder="Pin-Code" 
           keyboardType='numeric'
            
          onChangeText={(value)=>setPin(value)}
               />

            </View>
            <View style={styles.container}>
            <Text style={styles.text}>Aadhar Card No</Text>   
            <Field width="100%"
              value= {`${(aadhar)}`}
             editable={true}
            keyboardType="numeric"
         placeholder="Aadhar Number" 
       onChangeText={(value)=>setAadhar(value)}
            />
            
            </View>
          

            <View style={styles.container}>
            <Text style={styles.text}>Document</Text>   
            
          

            <Btn
            textColor="white"
            bgColor={btnColor}
            btnLabel="Upload PDF"
            Press={handleDocumentUpload}
            />
            </View>

             
            </View>
            
           </View>
           {loading ?  <Image  source={require('../assets/loading.gif')} /> : null}
           <Btn
            textColor="white"
            bgColor={btnColor}
            btnLabel="Save"
            Press={onPressSave}
            />
            
        </View>
        </ScrollView>       
    );
}

const styles = StyleSheet.create({
    body: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:'#F9E5F3'
    },
    container1: {
        flexDirection: 'row',                       //alert views
       backgroundColor: background,
       justifyContent:'space-between',
       borderRadius:8,
       
      },
      image:{
        borderRadius:125,
        borderWidth:7,
        borderColor:background,
        alignSelf:'center',
        width:120,
        height:120,
       
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
      text:{
        fontSize:12,
        width:70
      },
});
export default EditProfile;