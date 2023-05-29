import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { View, Text, StyleSheet, Alert,Button,Image, TextInput } from "react-native";
import { background, btnColor, darkPink, headColor } from "../components/Constants";
import Field from "../components/Field";
import Btn from "../components/Btn";
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { searchAxiosApi } from "./Api";
import dayjs from "dayjs";
import moment from "moment";


const SignUp = () =>{
    const navigation=useNavigation();
    const [mNumber,setNumber]  = useState('');
    const [loading,setLoading] = useState();
    const [selectedDate, setSelectedDate] = useState('');
   // const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dob,setDob] = useState('');
    //var date = new Date();
    const [year,setYear] = useState('');
    const [month,setMonth] = useState('');
    const today = new Date();
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
  
    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate;
      setShowDatePicker(Platform.OS === 'ios');
      setDate(currentDate);
      console.log(date);
    };
  
    const showDatepicker = () => {
      setShowDatePicker(true);
    };
  // const showDatePicker = () => {
  //    setDatePickerVisibility(true);
  // };

  // const hideDatePicker = () => {
  //   setDatePickerVisibility(false);
  // };

  // const handleConfirm = (date) => {
  //   setDob(date);     // complete dob of user
  //  // console.log(dob);
  //   setSelectedDate(date.getDate());   // only date of dob
  //   setYear(date.getFullYear());
  //   setMonth(date.getMonth()+1);
    
  //  // console.log(selectedDate,year,month);
  //   hideDatePicker();
  // };
  

  const onPressSearch = async () =>{
    
    setLoading(true);
    let dob=date.getFullYear() + '-'+ (date.getMonth()+1) + '-' + date.getDate();
    console.log('emp do',dob );
    var  dd =date.getDate();
    var mm =date.getMonth()+1;
    var yyyy = date.getFullYear();

    if(dd<10){
      dd='0'+dd;
    }
    if(mm<10){
      mm='0'+mm;
    }
    dob = yyyy+'-'+mm+'-'+dd;
    console.log('after',dob);
    await searchAxiosApi({
        "Mobile":mNumber,
        "Dob":dob
    })
    .then(res=>{
      console.log('sign s',res.data);
    //  console.log('sign status',res.data[0].Status);

    // if(res.data.message == "Employee Not Found"){
    //   alert('Employee not found!')
    // }  
                                                          if(res.data[0] != undefined){if(res.data[0].Flag == 'E')
                                                          {
                                                            alert('OTP sent.')
                                                            console.log('Id of employee',res.data[0].EmpId,res.data[0].Flag);  
                                                            navigation.navigate('Otp',{
                                                              eId:res.data[0].EmpId,
                                                              flag:(res.data[0].Flag)
                                                            }
                                                            );
                                                          }}
    // else if(res.data.message == "User Not Found"){
    //   console.log('esrdtfgyuhjk')
    //   alert('lodu')

    // }
                                                                 if(res.data[0] != undefined){ if(res.data[0].Flag=='U'){
                                                                          alert('Already exist.')  
                                                                          console.log('id of user',res.data[0].UserId);
                                                                          navigation.navigate('Login',{
                                                                            eId:res.data[0].UserId
                                                                          }
                                                                          );
                                                                        }}
     else if(res.data.data == 'user created' ){
      console.log('created user id',res.data)
      navigation.navigate('Otp',{eId:(res.data.id),flag:(res.data.flag)});
    }
    
    })
    
    .catch(error=>{console.log(error)})
    setLoading(false);
 }


    const onPressSubmit = () =>{
      //console.log(dob);
      try{
        if(mNumber.length == 10 && date != '' ) {
          //alert('Setting up your account ...');
          onPressSearch();
          // navigation.navigate('Otp');
         }else if(mNumber.length != 10 || mNumber.length == 0){
           Alert.alert('Warning','Please enter a valid Phone Number.');
           }else if(selectedDate == ''){
             Alert.alert('Warning','Please enter your DOB.');
           }
      }catch(error){
        Alert.alert(error);
      }
      setNumber('');
      setDob('');
    }




    return(
     
        <View style={styles.body}>

          
             <Image
        style={styles.image}
        resizeMode='cover'
        source={require('../assets/appLogo.png')}
        
      />
          <Text style={styles.head}>Register</Text>
          <View style={styles.parent}>
         <View style={styles.container1}>
         <Field width='70%' placeholder="Mobile Number" value={mNumber} keyboardType="numeric" onChangeText={(value)=>setNumber(value)}/>
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
                   <View style={styles.container1}>
                   <Field 
                   
                // value= { date.toLocaleDateString()}
                value={moment(date).format("DD-MM-YYYY")}
                placeholder={"DOB"}
              width="57%"
              onChangeText={(value)=>setDob(value)}
                />
                   
                <Ionicons.Button
                    name="calendar"
                    color='black'
                    onPress={showDatepicker}
                    backgroundColor={background}
                  
                    />
                    </View>

            </View>

          <Btn
              textColor="white"
              bgColor={btnColor}
              btnLabel="Signup"
              Press={onPressSubmit}
              // Press={() => {
              //   onPressSubmit
              //  // props.navigation.navigate('Login');
              // }}
            />
            
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
  datePickerStyle: {
    width: 200,
    marginTop: 20,
    
  },
  date:{
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 5
  },
  container:{
    flexDirection:'row',
    
    alignItems:'center',
    
  },
  container1:{
    flexDirection:'row',
    borderWidth:0.5,
    alignItems:'center',
    borderRadius:8,
    justifyContent:'space-between',
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
});

export default SignUp;