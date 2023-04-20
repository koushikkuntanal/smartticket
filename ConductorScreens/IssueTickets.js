import React, { useState,useEffect } from "react";                  //Go to validate
import { View, Text, StyleSheet, Alert,Button,Image, TextInput,TouchableOpacity} from "react-native";
import { background, btnColor } from "../components/Constants";
import { Picker } from "@react-native-picker/picker";
import Btn from "../components/Btn";
import { useNavigation } from "@react-navigation/native";
import { getFareForUsers, getRouteIdEmp, getStagesApi, getStagesIDApi, transactionforUsers, transactionStatusApi } from "../Screens/Api";
import { AntDesign } from '@expo/vector-icons';

const IssueTickets = ({route}) =>{
  const empData = route.params.data;
  const navigation = useNavigation();
  const [from, setFrom] = useState('');
  const [to, setTo]  =useState('');
  const [routeId,setRouteId]  =useState('');
  const [revData,setRevRoute]  =useState('');
  const [stages,setStages]  =useState([]);
  const [reversedStages, setReversedStages] = useState([]);
  const [apiFare, setApiFare] = useState();
  const [fromIndex, setFromIndex] = useState('');
  const [toIndex, setToIndex] = useState('');
  const [loading, setLoading] = useState();
  const [passengerNumber, setPassengerNumber] = useState(1);
  let distance;
  let fare,date,time;
  
  const perKmFees=5;    
                        //Assume per km fees is 5 rs 
  useEffect(()=>{
    (async () =>{
    await getRouteIdEmp({
      "EmpId":empData.EmpId
    }).then(async res =>{
      console.log('api data',res.data);
      setRouteId(res.data.RouteID);
      setRevRoute(res.data.revRoute);
      await getStagesIDApi({
        "RouteID": res.data.RouteID
      }).then(async res => {
        // console.log('res when getStagesIDApi is hit', res.data);

        const data = [];
        for (let i = 0; i < (res.data).length; i++) {
          await getStagesApi({
            "StageID": (res.data)[i].StageID
          }).then(res => {
             console.log('res when stag name id hit',)
            data.push(res.data);

          }).catch(err=>{
            console.log('eerr whe getStages Id hit',err);
          })
        }
        setStages(data);

       
        setReversedStages([...(data)].reverse());
        


      }).catch(err=>{
        console.log('eerr whe getStages ame hit',err);
      })
    })
    
  })();
  
},[]);
 

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


  const handleSubmit = async () => {
   setLoading(true);
    // Handle form submission
    if(from === to || passengerNumber ==0 || from =='Unknown' || to=='Unknown'){
      alert('Source and destination cannot be same.');
    }
    else {
      const now = new Date();
      const timestamp = now.toLocaleTimeString(); 
      const datestamp = now.toLocaleDateString(); 
      await transactionforUsers({
        "Id":empData.EmpId,
        "RouteName": routeId,//(revData == 'F')  ? (stages[0].StageName + '-' + stages[stages.length - 1].StageName) : (reversedStages[0].StageName + '-' + reversedStages[reversedStages.length - 1].StageName),
        "StartStage":from,//(revData == 'F')  ? stages[fromIndex].StageName : reversedStages[fromIndex].StageName,
        "EndStage":to,//(revData == 'F')  ? stages[1+fromIndex+toIndex].StageName : reversedStages[1+fromIndex+toIndex].StageName ,
        "Fare":apiFare*passengerNumber,
      }).then(async res=>{
        console.log('rer whe emp cretes o id');
        console.log('sahj',res.data);
        
        if(res.data.message == 'OrderID generated'){
          await transactionStatusApi({
            "transid": '',
            "OrderID":res.data.data.orderid,
            "tstatus":'PAID',
            "timestamp": datestamp +' '+timestamp,
             "Tgen":'E'
          }).then(res=>{
            console.log('re whe issue tivcket i s hit',res.data);
            if(res.data.message == 'Edit Success' ){
              Alert.alert('Transaction Success','Ticket Issued.')
            }
          }).catch(err=>{
            console.log('err whe transactionStatusApi hit ',err)
            alert('Transaction Failed.Try again')
          })
        }
      }).catch(err=>{console.log('err hwhem creats o id',err)})
    }
    setLoading(false)
  };

  const getFareTo = async (toV) => {
    setLoading(true);
    console.log('from and to i getFareTo ', from, toV);
    await getFareForUsers({
      "from": from,
      "to": toV,
    }).then(res => {
      console.log('data when get fare is hit', res.data.Fare)
      setApiFare(res.data.Fare);
    }).catch(err => { console.log('err when get fare is hit', err) })
    setLoading(false);
  }


  const getFareBoth = async (fromV, toV) => {
    setLoading(true);
    console.log('from and to i getFareBoth ', fromV, toV);
    await getFareForUsers({
      "from": fromV,
      "to": toV,
    }).then(res => {
      console.log('data when get fare is hit', res.data.Fare)
      setApiFare(res.data.Fare);
    }).catch(err => { console.log('err when get fare is hit', err) })
    setLoading(false);
  }
  return (
    
    <View style={styles.body}>
    
   
   
    <View elevation={5} style={styles.parent}>
      
      <Text style={styles.title}>Bus Ticket Booking</Text>
    
      <View style={styles.card}>

        {(reversedStages.length == 0) ? <Text style={styles.routeName}>loading</Text> :
          (revData == 'T') ? <Text style={styles.routeName}>{reversedStages[0].StageName}</Text> :
            (stages.length == 0) ? <Text style={styles.routeName}>loading</Text> : <Text style={styles.routeName}>{stages[0].StageName}</Text>
        }
        <AntDesign style={{ alignSelf: 'center' }} name="arrowright" size={32} color="black" onPress={null} />

        {(reversedStages.length == 0) ? <Text style={styles.routeName}>loading</Text> :
          (revData == 'T') ? <Text style={styles.routeName}>{reversedStages[stages.length - 1].StageName}</Text> :
            (stages.length == 0) ? <Text style={styles.routeName}>loading</Text> : <Text style={styles.routeName}>{stages[stages.length - 1].StageName}</Text>
        }
      </View>
      <View>

      </View>
      <View style={styles.form}>


        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
          <Text style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>From</Text>
          <View style={styles.input}>

            <Picker
              // itemStyle={{height:40}}
              selectedValue={from}
              onValueChange={(value, index) => {
                setFrom(value);
               
                console.log('from value in from picker', from)
                setFromIndex(index);

                if (revData == 'F') {
                  if (stages[index + 1] != undefined) {
                    setTo(stages[index + 1].StageID);
                    // setToName(stages[index + 1].StageName);
                    getFareBoth(value, stages[index + 1].StageID)
                  }
                  else if (stages[index + 1] == undefined) {
                    setTo(stages[index].StageID);
                    // setToName(stages[index].StageName);

                    alert('Destination cannot be selected!! ')
                  }
                }
                else if (revData == 'T') {
                  console.log('stages ', reversedStages[index + 1]);
                  if (reversedStages[index + 1] != undefined) {
                    setTo(reversedStages[index + 1].StageID);
                    // setToName(reversedStages[index + 1].StageName);

                    getFareBoth(value, reversedStages[index + 1].StageID)
                  }
                  else if (reversedStages[index + 1] == undefined) {
                    alert('Destination cannot be selected!! ')
                    setTo(reversedStages[index].StageID);
                    // setToName(reversedStages[index].StageName);
                  }

                }
                // getFareFrom(value);
                // getFareTo(stages[index+1].StageID);

              }}

              mode="dropdown" // Android only
              style={styles.picker}
            >
              {(revData == 'T') ? reversedStages.map((item, index) => {

                return (<Picker.Item
                  style={styles.pickerItem}
                  key={item.StageID}
                  label={item.StageName}
                  value={item.StageID}
                />);
              })
                :
                stages.map((item, index) => {

                  return (<Picker.Item
                    style={styles.pickerItem}
                    key={item.StageID}
                    label={item.StageName}
                    value={item.StageID}
                  />);
                })}
            </Picker>
          </View>
        </View>


        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>To</Text>
          <View style={styles.input}>
            <Picker
              // itemStyle={{height:40}}
              selectedValue={to}
              onValueChange={async (value, index) => {
                
                setTo(value);
                setToIndex(index);
                console.log('to value in to picker', to)
                getFareTo(value);
              
              }}
              mode="dropdown" // Android only
              style={styles.picker}
            >
              {(revData == 'T') ? reversedStages.map((item, index) => {
                if (index > fromIndex) {
                  return (<Picker.Item
                    style={styles.pickerItem}
                    key={item.StageID}
                    label={item.StageName}
                    value={item.StageID}
                  />);
                }
              })
                :
                stages.map((item, index) => {
                  if (index > fromIndex) {

                    return (<Picker.Item
                      style={styles.pickerItem}
                      key={item.StageID}
                      label={item.StageName}
                      value={item.StageID}
                    />
                    );
                  }
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
      
      
      {/* {console.log(apiFare)} */}
      {(apiFare != undefined && apiFare * passengerNumber != 0 && from != null && to != null) ? <View style={styles.fare}><Text style={styles.textfare}>Amount : {'\u20B9'} {apiFare * passengerNumber}</Text></View> : null}

    </View>
    {
      (apiFare != undefined) ?
        <Btn
          textColor="white"
          bgColor={btnColor}
          btnLabel="Book Ticket"
        Press = {handleSubmit}
        /> : null
    }
    {loading ? <Image source={require('../assets/loading.gif')} /> : null}
  </View>
  //  <View>{console.log('array final',stages)}<Text>Hello</Text></View>

);
}
const styles = StyleSheet.create({
body: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: '#F9E5F3'
},
parent: {
  paddingBottom: 25,
  width: "90%",
  backgroundColor: 'white',
  alignItems: 'center',
  borderRadius: 25,
  marginTop: 30
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
  width: "80%",
  justifyContent: 'center',
  alignItems: 'center',
},
picker: {
  alignSelf: 'center',
  width: "100%",
},
pickerItem: {
  width: 40,
  // height:40,
  fontSize: 14
},
buttonsContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
button: {
  width: 50,
  backgroundColor: btnColor,
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
  marginHorizontal: 10,
},
buttonText: {
  fontSize: 18,
  textAlign: "center",
  color: '#ffffff'
  // fontWeight: 'bold',
},
count: {
  fontSize: 14,
  marginHorizontal: 10,
},
card: {

  width: "97%",
  height: 80,
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: '#ffffff',
  borderRadius: 9,
  padding: 16,
  marginTop: 8,
  marginBottom: 8,
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
routeName: {
  textAlignVertical: 'center',
  fontSize: 14,
  width: 120,
  // backgroundColor:'red',
  textAlign: 'center'
},

fare: {
  marginTop: 20
},

textfare: {
  fontSize: 18
}
});

export default IssueTickets;