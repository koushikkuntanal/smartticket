import React, { useState,useEffect } from "react";                  //Go to validate
import { View, Text, StyleSheet, Alert,Button,Image, TextInput,TouchableOpacity} from "react-native";
import { background, btnColor } from "../components/Constants";
import { Picker } from "@react-native-picker/picker";
import Btn from "../components/Btn";
import { useNavigation } from "@react-navigation/native";
import Field from "../components/Field";


const Screen_D = () =>{
  const navigation = useNavigation();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  let distance;
  let fare,date,time;
  const perKmFees=5;                          //Assume per km fees is 5 rs
  let orderId = 'Kou72',customerId = 'kou40';
  const [email,setEmail] = useState();
  const [cphone,setCphone] = useState('');
  const [upi,setUpi] = useState('');
  const [passengerNumber, setPassengerNumber] = useState(0);
  const reg =  /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w\w+)+$/;
  const handleIncrement = () => {
    setPassengerNumber(passengerNumber + 1);
  };

  const handleDecrement = () => {
    if (passengerNumber > 0) {
      setPassengerNumber(passengerNumber - 1);
    }
  }

  const calculateDistance = () =>{
    if(from =='Destination A' && to == 'Destination C' || from =='Destination C' && to == 'Destination A'){
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
  return (
   
    <View style={styles.body}>
      <View elevation={5} style={styles.parent}>
    <Text style={styles.title}>Bus Ticket Booking</Text>
    <View style={styles.form}>
      {/* <TextInput
        style={styles.input}
        placeholder="From"
        value={from}
        onChangeText={setFrom}
      /> */}
      <View style={styles.input}>
       <Picker
             // itemStyle={{height:40}}
              selectedValue={from}
              onValueChange={(value, index) => setFrom(value)}
              mode="dropdown" // Android only
              style={styles.picker}
            >
              <Picker.Item style={styles.pickerItem} label="Select Source" value="Unknown" />
              <Picker.Item style={styles.pickerItem} label="Destination A" value="Destination A" />
              <Picker.Item style={styles.pickerItem} label="Destination B" value="Destination B" />
              <Picker.Item style={styles.pickerItem} label="Destination C" value="Destination C" />
       </Picker>
       </View>
       <View style={styles.input}>
       <Picker
             // itemStyle={{height:40}}
              selectedValue={to}
              onValueChange={(value, index) => setTo(value)}
              mode="dropdown" // Android only
              style={styles.picker}
            >
              <Picker.Item style={styles.pickerItem} label="Select Destination" value="Unknown" />
              <Picker.Item style={styles.pickerItem} label="Destination A" value="Destination A" />
              <Picker.Item style={styles.pickerItem} label="Destination B" value="Destination B" />
              <Picker.Item style={styles.pickerItem} label="Destination C" value="Destination C" />
       </Picker>
       </View>
      {/* <TextInput
        style={styles.input}
        placeholder="To"
        value={to}
        onChangeText={setTo}
      /> */}
      {/* <TextInput
        style={styles.input}
        placeholder="Date"
        value={date}
        onChangeText={setDate}
      /> */}
      {/* <View style={styles.input}>
      <TextInput
       fontSize={14}
       keyboardType="numeric"
       placeholder="Number of Passengers"
       value={passengerNumber}
       onChangeText={setPassengerNumber}
     />
     
      </View> */}
    <View >
    <View style={styles.buttonsContainer}>
        <Text>Number of Passenger</Text>
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
    <View style={styles.input}>
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
    </View>
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
      backgroundColor:background
    },
    parent:{
      backgroundColor:'red',
      //height:400,
      paddingVertical:50,
      width:"90%",
      backgroundColor:'white',
      alignItems:'center',
      justifyContent:'center',
      borderRadius:25,
     // borderWidth:0.5,
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      //fontWeight: 'bold',
      marginBottom: 20,
    },
    form: {
      width: '80%',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 5,
      marginBottom: 20,
      borderRadius: 5,
     
    },
    picker: {    
      alignSelf:'center',
      width: "100%",
      //height:40,
    },
    pickerItem:{
      //backgroundColor:'gold',
      width:40,
     // height:40,
      fontSize:12      
    },
    buttonsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'space-between',
     
    },
    button: {
      width:50,
      backgroundColor: '#ccc',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginHorizontal: 10,
    },
    buttonText: {
      fontSize: 14,
      textAlign:"center"
     // fontWeight: 'bold',
    },
    count: {
      fontSize: 14,
      marginHorizontal: 10,
    },
   
});

export default Screen_D;