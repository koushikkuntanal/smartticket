import React, { useState,useEffect } from "react";                  //Go to validate
import { View, Text, StyleSheet, Alert,Button,Image, TextInput,TouchableOpacity} from "react-native";
import { background, btnColor } from "../components/Constants";
import { Picker } from "@react-native-picker/picker";
import Btn from "../components/Btn";
import { useNavigation } from "@react-navigation/native";
import Field from "../components/Field";
import { getAssetIdApiForEmp, getRouteIdApi, getStagesApi } from "./Api";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';

const Screen_D = ({route}) =>{
  const emailData= route.params.emailData; 
  const assestdata = route.params.data;
  var [revRoute,setRevRoute] = useState(false);
  const navigation = useNavigation();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  let distance;
  let fare,date,time;
  const perKmFees=5;                          //Assume per km fees is 5 rs
  let orderId = 'Kou90',customerId = 'kou49';
  const [email,setEmail] = useState();
  const [cphone,setCphone] = useState('');
  const [upi,setUpi] = useState('');
  const [passengerNumber, setPassengerNumber] = useState('1');
  const reg =  /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w\w+)+$/;
  const [routeId,setRouteId] = useState('');
  const [stages,setStages] = useState([]);
  const [reversedStages, setReversedStages] = useState([]);
  const [fromIndex,setFromIndex] = useState('');

  useEffect(()=>{
    console.log('sending asset id',assestdata);
    console.log('recieved email data',emailData);
  
   (async()=>{
    await getAssetIdApiForEmp({
      "id":assestdata
    }).then(async res=>{console.log('response when getAssetIdApiForEmp() is hit ',res.data)
  
  await getRouteIdApi({
    "AssetID" : res.data.AstId
   }).then(async res=>{console.log('res when getRouteIdApi is hit',res.data)
   setRouteId(res.data[0].RouteID)
   await getStagesApi({
    "RouteID" : res.data[0].RouteID
   }).then(res=>{console.log('res when getStagesApi is hit',res.data)
  setStages(res.data)
  setReversedStages([...(res.data)].reverse());
  }).catch(error=>{console.log(error)
    alert(error)
  }).catch(error=>{console.log(error)
    alert(error)
  })
  }).catch(err=>{console.log(err)
  alert(err);
  })
  })
  })();
 
  
 

  },[])
  const handleIncrement = () => {
    setPassengerNumber(passengerNumber + 1);
  };

  const handleDecrement = () => {
    if (passengerNumber > 0) {
      setPassengerNumber(passengerNumber - 1); 
    }
  }

  const calculateDistance = () =>{
    if(from =='OP1R1S1' && to == 'OP1R1S2' || from =='OP1R1S2' && to == 'OP1R1S1'){
      distance=10;
    }else if(from =='Destination A' && to == 'Destination B' || from =='Destination B' && to == 'Destination A'){
    distance=4;
    }else if(from =='Destination B' && to == 'Destination C' || from =='Destination C' && to == 'Destination B'){
     distance=6;
    }
    fare=(distance*perKmFees)*passengerNumber;
  }


  const handleSubmit = () => {
    // Handle form submission
    
    if(from === to || passengerNumber ==0 || from =='Unknown' || to=='Unknown'){
      alert('Source and destination cannot be same.');
    }
    else {
    calculateDistance();
    console.log(fare);
    date=new Date().toDateString();
    time=new Date().toLocaleTimeString();
   
    navigation.navigate('PaymentScreen',{
      From:from,
      To:to,
      Fare:fare,
      Date:date,
      Time:time,
      //Fare:fare,
      mail:email,
      cphone:cphone,
      upi:upi,
      orderid:orderId,
      customerid:customerId
    });
    }
  };
  function interchangeStrings(str1, str2) {
    return [str2, str1];
  }
  
  const onPressReverse =()=>{
    setRevRoute(!revRoute);
    console.log('values',from,to)
    const [newString2, newString1] = interchangeStrings(to, from);
    setFrom(newString1);
    setTo(newString2);

    console.log("changed",from,to)
  }
  return (
   
    <View style={styles.body}>
      {console.log('qr data',assestdata)}
      {console.log('route id when useeffect is hit',routeId)}
      {console.log('rev stages',reversedStages)}
      {console.log('index',fromIndex)}
      {console.log('email data',emailData.Uemail,emailData.Umobile)}

      <View elevation={5} style={styles.parent}>
 {console.log('stages',stages)}
 {console.log('rev stages',reversedStages)}
        <Text style={styles.title}>Bus Ticket Booking</Text>
        <Text style={{fontSize:18,marginVertical:10}}>Bus info : {assestdata}</Text>
        <View style={styles.card}>
                    
                    {    (stages.length == 0) ?<Text style={styles.routeName}>loading</Text>:
                      revRoute ? <Text style={styles.routeName}>{reversedStages[0].StageName}</Text>:
                <Text style={styles.routeName}>{stages[0].StageName}</Text>
              } 
                <AntDesign style={{alignSelf:'center'}} name="swap" size={32}  color="black" onPress={onPressReverse}/>

                    {    (stages.length == 0) ?<Text style={styles.routeName}>loading</Text>:
                    revRoute ?  <Text style={styles.routeName}>{reversedStages[stages.length-1].StageName}</Text> :
                <Text style={styles.routeName}>{stages[stages.length-1].StageName}</Text>
              }    
      </View>
   <View>
   
   </View>
    <View style={styles.form}>
    
     
      <View style={{flexDirection:'row',alignItems:'center',marginBottom:5}}>
        <Text style={{justifyContent:'center',alignItems:'center',flex:1}}>From</Text>
      <View style={styles.input}>
        
        <Picker
              // itemStyle={{height:40}}
               selectedValue={from}
               onValueChange={(value, index) => {setFrom(value)
               setFromIndex(index)
               }}
               mode="dropdown" // Android only
               style={styles.picker}
             > 
               {revRoute ? reversedStages.map((item,index)=>{
                       
                          return (<Picker.Item
                            style={styles.pickerItem}
                              key={index}
                              label={item.StageName}
                              value={item.StageID} 
                           />);
                         })
                         : 
              stages.map((item,index)=>{
                
                           return (<Picker.Item 
                              style={styles.pickerItem}
                              key={index}
                              label={item.StageName}
                              value={item.StageID} 
                           />);
                         })}
        </Picker>
        </View>
      </View>
      
       
      <View style={{flexDirection:'row',alignItems:'center',marginBottom:20}}>
      <Text style={{justifyContent:'center',alignItems:'center',flex:1}}>To</Text>
       <View style={styles.input}>
       <Picker
             // itemStyle={{height:40}}
              selectedValue={to}
              onValueChange={(value, index) => setTo(value)}
              mode="dropdown" // Android only
              style={styles.picker}
            >
             {revRoute ? reversedStages.map((item,index)=>{
                          if(index>fromIndex)
                          {return (<Picker.Item
                            style={styles.pickerItem}
                             key={index}
                             label={item.StageName}
                             value={item.StageID} 
                          />);}
                        })
                        : 
             stages.map((item,index)=>{
                        if(index>fromIndex)
                          {return (<Picker.Item
                            style={styles.pickerItem}
                             key={index}
                             label={item.StageName}
                             value={item.StageID} 
                          />
                          );}
                        })}
       </Picker>
       </View>
       </View>
     
    <View >
    <View style={styles.buttonsContainer}>
     
        <Text>No. of Passenger</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleDecrement}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.count}>{passengerNumber}</Text>
        <TouchableOpacity
       
          style={styles.button}
          onPress={handleIncrement}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
    </View>
    {/* <View style={styles.input}>
             <Field 
                width="100%"
                
                editable={true}
                placeholder="Email id"
                onChangeText={(value)=>setEmail(value)}
              />
    </View>
    <View style={styles.input}>
    <Field width="100%"
             editable={true}
            keyboardType="numeric"
         placeholder="Mobile Number" 
       onChangeText={(value)=>setCphone(value)}
            />
    </View>
    <View style={styles.input}>
        <Field 
            width="100%"
             editable={true}
            
         placeholder="UPI ID" 
       onChangeText={(value)=>setUpi(value)}
            />
    </View> */}
    <Btn
         textColor="white"
         bgColor={btnColor}
         btnLabel="Book Ticket"
         Press={handleSubmit}
      />
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
      paddingBottom:10,
      width:"90%",
      backgroundColor:'white',
      alignItems:'center', 
      borderRadius:25,
       marginTop:30
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
       marginTop: 20,
    },
    form: {
      width: '80%',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
     width:"80%",
     justifyContent:'center',
     alignItems:'center',
    },
    picker: {    
      alignSelf:'center',
      width: "100%",
    },
    pickerItem:{
      width:40,
     // height:40,
      fontSize:14     
    },
    buttonsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'space-between',
    },
    button: {
      width:50,
      backgroundColor: btnColor,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginHorizontal: 10,
    },
    buttonText: {
      fontSize: 18,
      textAlign:"center",
      color:'#ffffff'
     // fontWeight: 'bold',
    },
    count: {
      fontSize: 14,
      marginHorizontal: 10,
    },
    card: {
       
      width:"97%",
      height:80,
      flexDirection:'row',
      justifyContent:'space-between',
      backgroundColor: '#ffffff',
      borderRadius: 9,
      padding: 16,
      marginTop: 8,
      marginBottom:8,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      // elevation: 5,
      
    },
    item: {
      marginHorizontal: 5,
    },
    routeName:{
      textAlignVertical:'center',
      fontSize:14,
      width:120,
      // backgroundColor:'red',
      textAlign:'center'
    }
});

export default Screen_D;