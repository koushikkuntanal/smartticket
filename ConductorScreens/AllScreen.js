import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, Alert,Button,Image, TextInput,TouchableOpacity, ImageBackground} from "react-native";
import Constants from 'expo-constants';
import Btn from "../components/Btn";
import { background, btnColor, darkPink } from "../components/Constants";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { createUserApi, ProfileApi, searchUserAPi, switchToUserApi } from "../Screens/Api";

const AllScreens =({route}) =>{
    const [dob,setDob]= useState();
    const id = route.params.ID;
    const Flag = route.params.flag;
    const mobileNumber = route.params.mobileNumber;
    const Type = route.params.Type;
    const navigation = useNavigation();
    const [loading, setLoading] = useState();
    const Profile = async()=>{
      await ProfileApi({
        "flag":Flag,
        "id":id
      })
      .then(res=>{
        // console.log('details in allscreen',res.data)
      navigation.navigate('lekpayProfile',{data:res.data});
    })
      .catch(error=>alert(error));


    }
    
const ScannerAsset = () =>{
    navigation.navigate('Capture Asset',{id:id});
}
const checkTickets = () =>{
    navigation.navigate('Check Tickets');
}
const issueTickets =async() =>{
  setLoading(true);
  await ProfileApi({
    "flag":Flag,
    "id":id
  })
  .then(res=>{
    // console.log('details in allscreen',res.data)
  navigation.navigate('Issue Tickets',{data:res.data});
})
  .catch(error=>alert(error));
    // navigation.navigate('Issue Tickets');
    setLoading(false);
}
const cashHandler=async () =>{
  setLoading(true);
  await ProfileApi({
    "flag":Flag,
    "id":id
  })
  .then(res=>{
    // console.log('details in allscreen',res.data)
  navigation.navigate('Cash Handler',{data:res.data});
})
  .catch(error=>alert(error));
    // navigation.navigate('Cash Handler');
  setLoading(false);
}

const onPressSetPass = async()=>{
  setLoading(true);
  await ProfileApi({
    "flag":Flag,
    "id":id
  })
  .then(res=>{
   
  navigation.navigate('Set Pass Stage',{data:res.data});
})
  .catch(error=>alert(error));
    
  setLoading(false);
}

const onPressCurrentTrip=async () =>{
  setLoading(true);
  await ProfileApi({
    "flag":Flag,
    "id":id
  })
  .then(res=>{
    // console.log('details in allscreen',res.data)
  navigation.navigate('Current Trip',{data:res.data});
})
  .catch(error=>alert(error));
    // navigation.navigate('Cash Handler');
  setLoading(false);
}

const switchU = async() =>{
  setLoading(true);
 await ProfileApi({
  "flag":Flag,
  "id":id
 })
 .then( async res=>{console.log(res.data)
  console.log(res.data.EmpDOB)
  setDob(res.data.EmpDOB);
  console.log('starting to find user with dob',res.data.EmpDOB);          /////////////////////////////
  await searchUserAPi({
    "Mobile":mobileNumber,
    "Dob":res.data.EmpDOB

  })
  .then(res=>{console.log('finding user',res.data)
  if(res.data[0] != undefined){if(res.data[0].Flag == 'U' ){
    navigation.navigate('tab',{userData:res.data})
  }}else if(res.data.data.flag == 'U'){
    navigation.navigate('tab'
    ,{screen:"Screen_A",params:{userData:res.data.data}})

  }
})
  .catch(error=>console.log(error))
  

})
 .catch(error=>{console.log(error)
alert(error);
})
setLoading(false);
}
    return(
        <View style={styles.body}>  
          
         <Text>{Type}</Text>
          
            <StatusBar hidden={false} style="dark" backgroundColor='#F9E5F3'  />
           
           { (Type == 'Conductor') ? 
             <View>
              <View style={styles.card}> 
            
            <TouchableOpacity onPress={Profile}>
            <Image style={styles.icon} resizeMode='contain'
            source={require('../assets/LekPay-Profile.png')}
            /><Text style={styles.text}>Profile</Text>
           </TouchableOpacity>

           <TouchableOpacity onPress={ScannerAsset}>
            <Image style={styles.icon} resizeMode='contain'
            source={require('../assets/LekPay-Asset.png')}
            />
            <Text style={styles.text}>Asset</Text>
           </TouchableOpacity>

           <TouchableOpacity onPress={checkTickets}>
            <Image style={styles.icon} resizeMode='contain'
            source={require('../assets/LekPay-CheckTicket.png')}
            />
            <Text style={styles.text}>Validate</Text>
           </TouchableOpacity>
           
           

            </View> 
            <View style={styles.card}>
            <TouchableOpacity onPress={issueTickets}>
            <Image style={styles.icon} resizeMode='contain'
            source={require('../assets/LekPay-Ticket.png')}
            />
            <Text style={styles.text}>Tickets</Text>
           </TouchableOpacity>

           <TouchableOpacity onPress={cashHandler}>
            <Image style={styles.icon} resizeMode='contain'
            source={require('../assets/LekPay-Cash.png')}
            />
            <Text style={styles.text}>Cash</Text>
           </TouchableOpacity>

           <TouchableOpacity onPress={() => navigation.navigate('ChangePasswordConductor',{
             ID : id,
             flag: Flag
           })}>
            <Image style={styles.icon} resizeMode='contain'
            source={require('../assets/LekPay-ResetPwd.png')}
            />
          <Text style={styles.text}>Change</Text>
          <Text style={styles.text}>Password</Text>
           </TouchableOpacity>
            </View>
            <View style={styles.card}>
            <TouchableOpacity onPress={onPressCurrentTrip}>
            <Image style={styles.icon} resizeMode='contain'
            source={require('../assets/LekPay-Ticket.png')}
            />
            <Text style={styles.text}>Current{'\n'}Trip</Text>
           </TouchableOpacity>

           <TouchableOpacity onPress={onPressSetPass}>
            <Image style={styles.icon} resizeMode='contain'
            source={require('../assets/LekPay-Ticket.png')}
            />
            <Text style={styles.text}>Passed Stage</Text>
           </TouchableOpacity>

            </View>
             </View>
            
          :  <View style={styles.card}>
          <TouchableOpacity onPress={()=>navigation.navigate('Map Asset')}>
          <Image style={styles.icon} resizeMode='contain'
          source={require('../assets/LekPay-Asset.png')}
          />
          <Text style={styles.text}>Asset</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={Profile}>
          <Image style={styles.icon} resizeMode='contain'
          source={require('../assets/LekPay-Profile.png')}
          />
          <Text style={styles.text}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>navigation.navigate('Report')}>
          <Image style={styles.icon} resizeMode='contain'
          source={require('../assets/LekPay-Report.png')}
          />
          <Text style={styles.text}>Report</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>navigation.navigate('Check')}>
          <Image style={styles.icon} resizeMode='contain'
          source={require('../assets/LekPay-CheckTicket.png')}
          />
          <Text style={styles.text}>Validate</Text>
          </TouchableOpacity>

          

       </View>
          }
            {/* <Text>Conductor Screens</Text> */}
             
          


             {/* <Text>Checker Screens</Text> */}


             
            <TouchableOpacity onPress={switchU} style={{backgroundColor:btnColor,width:170,height:30,alignItems:'center',justifyContent:'center'}}>
              <Text>Switch to User</Text>
            </TouchableOpacity>
              
            {loading ? <Image source={require('../assets/loading.gif')} /> : null}
        </View>
    )
}
const styles = StyleSheet.create({
    body: {
      flex: 1,
      alignItems: 'center',
     // justifyContent: "center",
      backgroundColor:background,
      //paddingHorizontal:20
      //marginTop:Constants.statusBarHeight
    },
    parent:{
        backgroundColor:'red',
     width:"100%",
     padding:12,
     flexDirection:'row'
    },
    card: {
        
        width:"90%",
        flexDirection:'row',
        justifyContent:'space-evenly',
        backgroundColor: '#ffffff',
        borderRadius: 9,
        padding: 16,
        margin: 8,
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      icon:{
        aspectRatio:1,
        width:60,
        height:60,
        alignSelf:'center'
      },
      text:{
        textAlign:'center',
        fontSize:12,
        
      }
});
export default AllScreens;
