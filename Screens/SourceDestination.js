import React, { useState, useEffect } from "react";                  //Go to validate
import { View, Text, StyleSheet, Alert, Button, Image, TextInput, TouchableOpacity } from "react-native";
import { background, btnColor } from "../components/Constants";
import { Picker } from "@react-native-picker/picker";
import Btn from "../components/Btn";
import { useNavigation } from "@react-navigation/native";
import Field from "../components/Field";
import { getAssetIdApiForEmp, getFareForUsers, getRevRouteFlagApi, getRouteIdApi, getStagesApi, getStagesIDApi, getTicketType, transactionforUsers } from "./Api";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';

const SourceDestination = ({ route }) => {
  const emailData = route.params.emailData;
  const assestdata = route.params.data;
  var [revRoute, setRevRoute] = useState();
  const navigation = useNavigation();
  const [from, setFrom] = useState('');    
  const [fromName, setFromName] = useState('');
  const [to, setTo] = useState('');
  const [toName, setToName] = useState('');

  let distance;
  let fare, date, time;
  const perKmFees = 5;                          //Assume per km fees is 5 rs
  let orderId = 'Kou111001', customerId = 'kou50';
  const [email, setEmail] = useState('');
  const [cphone, setCphone] = useState('');
  const [upi, setUpi] = useState('');
  const [passengerNumber, setPassengerNumber] = useState(1);
  const reg = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w\w+)+$/;
  const [routeId, setRouteId] = useState('');
  const [stages, setStages] = useState([]);
  let stag = [];
  const [reversedStages, setReversedStages] = useState([]);
  const [fromIndex, setFromIndex] = useState('');
  const [toIndex, setToIndex] = useState('');
  const [revData, setRevData] = useState();
  const [loading, setLoading] = useState();
  const [apiFare, setApiFare] = useState();
  const [TicketTypeData,setTicketDataType] = useState([]); 
  const [SelectTicket,setSelectTicket] = useState('');
  const [actualIndex,setActualIndex] = useState('');
  const [tripData,setTripData] = useState('');
  useEffect(() => {
    // console.log('sending asset id',assestdata);
     console.log('recieved email data',emailData,from,to);
    console.log('from to values', from, to);
    setEmail(emailData.Uemail);
    setCphone(emailData.Umobile);
    setUpi(emailData.UPI);
    (async () => {
      await getAssetIdApiForEmp({
        "id": assestdata
      }).then(async res => {
        console.log('response when getAssetIdApiForEmp() is hit ',res.data)

            {
              console.log('getting rev rouet flag with asset id', res.data.AstId)
              await getRevRouteFlagApi({

                "AstId": res.data.AstId
              }).then(res => {
                console.log('revRoute Flag', res.data)
                setLoading(true);
                setTripData(res.data[(res.data).length-1].Trip);
                setRevData(res.data[(res.data).length - 1].revRoute);
                setLoading(false);
              }).catch(err => {
                console.log('err whne revRoute is get', err)
                alert(err);
              })
            }
        await getRouteIdApi({
          "AssetID": res.data.AstId
        }).then(async res => {
            console.log('res when getRouteIdApi jhgskjadjsgj  is hit',res.data)
          setRouteId(res.data.RouteID)
           setActualIndex(res.data.idx);
          
                 await getTicketType({
                  "RouteID" : res.data.RouteID 
                 }).then(res=>{
                  console.log('Tocket type',res.data.data);
                 setTicketDataType(res.data.data);
                }).catch(err=>{console.log(err)})
                for(let i = 0; i<=2; i++)
          await getStagesIDApi({
            "RouteID": res.data.RouteID 

          }).then(async res => {
              console.log('res when getStagesIDApi is hit', res.data);
             
            const data = [];
            for (let i = 0; i < (res.data.data).length; i++) {
              console.log('data sending to api',i ,(res.data.data)[i].StageID )
              setTimeout(() => {
                console.log(i);
              }, 1 * 1000); 
              await getStagesApi({
                "StageID": (res.data.data)[i].StageID
              }).then(res => {
                 console.log(`res when stag  id is hit for ${i} usng id`,res.data)
                 
                data.push(res.data);
                
              }).catch(err=>{console.log('err stage id',err)})  
            }
            console.log('daata',data);
            setStages(data);
            setReversedStages([...(data)].reverse());
            // console.log('adding stage', stages);
            
            // console.log('reverser staged',reversedStages)


          }
          ).catch(error => {
            console.log(error)
            
          }).catch(error => {
            console.log(error)
            alert(error)
          })
        }).catch(err => {
          console.log(err)
          alert(err);
        })
      })
    })();




  }, [])
  const handleIncrement = () => {
    setPassengerNumber(passengerNumber + 1);
  };

  const handleDecrement = () => {
    if (passengerNumber > 0) {
      setPassengerNumber(passengerNumber - 1);
    }
  }

 
  const handleSubmit = async (tripdata) => {
   
    // Handle form submission
    setLoading(true);
    let i =parseInt(actualIndex)+parseInt(fromIndex);
    let j = parseInt(actualIndex)+parseInt(toIndex)+1;
     console.log('from igi',from,fromIndex,'to',to,toIndex,'actual',actualIndex);
     console.log('stages i hs',stages[i].StageName,stages[j].StageName)
    if (from === to) {
      alert('Please enter all the details.');
    }
    else if(emailData.UPI == ''){
      alert("Please complete your profile");
    
    }else if (to == null) {
      alert('Please enter To address');
    } else if (from == null) {
      alert('Please enter From address');
    } else if (passengerNumber == 0) {
      alert('Passenger Number cannot be zero!');
    }
    else {
      // calculateDistance();
      // console.log(fare);
      date = new Date().toDateString();   
      time = new Date().toLocaleTimeString();   
      console.log('details fro upi', email, cphone, upi,revData,reversedStages[fromIndex].StageName,reversedStages[1+fromIndex+toIndex].StageName);
      let count;
      if(SelectTicket == 'ST'){
        count = 1;
      }
      else if(SelectTicket == 'RT'){
        count = 2;
      }
      else {count = 0;}
      
      await transactionforUsers({
        "Id":emailData.UserId,
        "RouteName": routeId,//(revData == 'F')  ? (stages[0].StageName + '-' + stages[stages.length - 1].StageName) : (reversedStages[0].StageName + '-' + reversedStages[reversedStages.length - 1].StageName),
        "StartStage":from,//(revData == 'F')  ? stages[fromIndex].StageName : reversedStages[fromIndex].StageName,
        "EndStage":to,//(revData == 'F')  ? stages[1+fromIndex+toIndex].StageName : reversedStages[1+fromIndex+toIndex].StageName ,
        "Fare":apiFare * passengerNumber,
        "Passengers":passengerNumber,
        "Ttype":SelectTicket,
        "Trip":tripdata,
        "Counter":count
      }).then(res=>{console.log('res ehrn transactionforUsers is hit ',res.data.data)
     if(res.data.message == 'OrderID generated'){
      navigation.navigate('PaymentScreen', {
        From: (revData == 'F')  ? stages[i].StageName : reversedStages[i].StageName,
        To: (revData == 'F')  ? stages[j].StageName : reversedStages[j].StageName ,
        routeName:(revData == 'F')  ? (stages[0].StageName + '-' + stages[stages.length - 1].StageName) : (reversedStages[0].StageName + '-' + reversedStages[reversedStages.length - 1].StageName),
        Fare: apiFare*passengerNumber,
        Date: date,
        Time: time,
        //Fare:fare,
        passengerNumber: passengerNumber,
        mail: email.trim(),
        cphone: cphone,
        upi: upi,
        Orderid: res.data.data.orderid,
        customerid: emailData.UserId,
        busNo:assestdata,
         ttype:SelectTicket,
         tripData:tripData
      });
     }
    })
      .catch(err=>{console.log('when id api',err)})
       
      console.log((revData == 'F')  ? (stages[0].StageName + '-' + stages[stages.length - 1].StageName) : (reversedStages[0].StageName + '-' + reversedStages[reversedStages.length - 1].StageName))
      
      setLoading(false);
    }
  };

  const getFareFrom = async (fromV) => {
    setLoading(true);
    console.log('from and to', fromV, to);
    await getFareForUsers({
      "from": fromV,
      "to": to,
      "ttype":SelectTicket
    }).then(res => {
      console.log('data when get fare is hit getFareFrom', res.data)
      setApiFare(res.data.Fare);
    }).catch(err => { console.log('err when get fare is hit', err) })
    setLoading(false);
  }

  const getFareTo = async (toV,SelectTicket) => {
    console.log('getFae to')
    setLoading(true);
    console.log('from and to i getFareTo ', from, toV);
    await getFareForUsers({
      "from": from,
      "to": toV,
      "ttype":SelectTicket
    }).then(res => {
      console.log('data when get fare is hit', res.data.Fare)
      setApiFare(res.data.Fare);
    }).catch(err => { console.log('err when get fare is hit', err) })
    setLoading(false);
  }


  const getFareBoth = async (fromV, toV,select) => {
    setLoading(true);
    console.log('from and to i getFareBoth ', fromV, toV);
    await getFareForUsers({
      "from": fromV,
      "to": toV,
      "ttype":select
    }).then(res => {
      console.log('data when get fare is hit', res.data)
      setApiFare(res.data.Fare);
    }).catch(err => { console.log('err when get fare is hit', err) })
    setLoading(false);
  }
  return (

    <View style={styles.body}>
      {/* {console.log("jfsjgjh",TicketTypeData)}
      {console.log("jfsjgjh",SelectTicket)} */}
      
      {console.log('email data',emailData.Uemail,emailData.Umobile,emailData.UserId,emailData.UPI,from,to)}
      {/* {console.log('qr data',assestdata)}
      {console.log('route id when useeffect is hit',routeId)}
      
          {console.log('index',fromIndex)}
          
      {/* {console.log('rev stages', reversedStages)}
      {console.log('revDta', revData)} */}
     
      <View elevation={5} style={styles.parent}>
        {/* {console.log('final stages',stages)} */}

        {/* {console.log('rev stages',reversedStages)} */}
        <Text style={styles.title}>Bus Ticket Booking</Text>
        <Text style={{ fontSize: 18, marginVertical: 10 }}>Bus info : {assestdata}</Text>
        <View style={styles.card}>

          {(reversedStages.length == 0) ? <Text style={styles.routeName}>loading</Text> :
            (revData == 'T') ? <Text style={styles.routeName}>{reversedStages[0].StageName}</Text> :
              (stages.length == 0) ? <Text style={styles.routeName}>loading</Text> : <Text style={styles.routeName}>{stages[0].StageName}</Text>
          }
          <AntDesign style={{ alignSelf: 'center' }} name="arrowright" size={32} color="black" onPress={null} />

          {(reversedStages.length == 0) ? <Text style={styles.routeName}>loading</Text> :
            (revData == 'T') ? <Text style={styles.routeName}>{reversedStages[reversedStages.length - 1].StageName}</Text> :
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
                      console.log('actual i',actualIndex)
                      setTo(stages[index + 1].StageID);
                      // setToName(stages[index + 1].StageName);
                      getFareBoth(stages[actualIndex].StageID,(stages[actualIndex+1] != undefined) ?  stages[actualIndex + 1].StageID : null,SelectTicket)
                    }
                    else if (stages[index + 1] == undefined) {
                      setTo(stages[index].StageID);
                      // setToName(stages[index].StageName);

                      alert('Destination cannot be selected!! ')
                    }
                  }
                   if (revData == 'T') {
                    console.log('stages ', reversedStages[index + 1]);
                    if (reversedStages[index + 1] != undefined) {
                      setTo(reversedStages[index + 1].StageID);
                      // setToName(reversedStages[index + 1].StageName);
                      setFrom(reversedStages[actualIndex].StageID);
                      getFareBoth(value, reversedStages[index + 1].StageID,SelectTicket)
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
                {(revData === 'T') ? reversedStages.map((item, index) => {
                  if(index == actualIndex){
                  return (<Picker.Item
                    style={styles.pickerItem}
                    key={item.StageID}
                    label={item.StageName}
                    value={item.StageID}
                  />);}
                })
                  :
                  stages.map((item, index) => {
                    if(index == actualIndex){
                    return (<Picker.Item
                      style={styles.pickerItem}
                      key={item.StageID}
                      label={item.StageName}
                      value={item.StageID}
                    />);}
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
                  if(revData == 'F')
                  
                  {
                    setFrom(stages[actualIndex].StageID)
                    getFareBoth(stages[actualIndex].StageID,value,SelectTicket);}
                  else{
                    setFrom(reversedStages[actualIndex].StageID);
                    getFareBoth(reversedStages[actualIndex].StageID,value,SelectTicket);
                  }
                  
                }}
                mode="dropdown" // Android only
                style={styles.picker}
              >
                {(revData == 'T') ? reversedStages.map((item, index) => {
                  if (index > actualIndex) {
                    return (
                    <Picker.Item
                      style={styles.pickerItem}
                      key={item.StageID}
                      label={item.StageName}
                      value={item.StageID}   
                    />);  
                  }
                })
                  :
                  stages.map((item, index)=>{
                    if (index > actualIndex) {

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
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>Ticket Type</Text>
            
            {/* <View style={styles.input}>
           <Picker
           selectedValue={SelectTicket}
           mode="dropdown"
           style={styles.picker}
           >
            {
            TicketType.map((item,index) => {

              return(
              <Picker.item
               style={styles.pickerItem}
               key={index}
               label={item.ttname}
               value={item.ttshortname}
              onValueChange={(value)=>setSelectTicket(value)}
              />);


            }
            
              
            
            
            )}


            
           </Picker>
           </View> */}
           <View style={styles.input}>
              <Picker
                
                selectedValue={SelectTicket}
                onValueChange={ (value ) => {
                  setSelectTicket(value);
                  getFareBoth(from, to,value)
                  
                }}
                mode="dropdown" // Android only
                style={styles.picker}
              >
                { TicketTypeData.map((item, index) => {
                   {
                    return (
                    <Picker.Item
                      style={styles.pickerItem}
                      key={index}
                      label={item.ttname}
                      value={item.ttshortname}
                    />);
                  }
                })
                  
                  }
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
    </View> */}
        {/* {(apiFare != undefined) ? <View style={[styles.input, { marginTop: 12 }]}>
          <Field
            width="100%"
            editable={true}

            placeholder="UPI ID"
            onChangeText={(value) => setUpi(value)}
          />
        </View> : null} */}
        {/* {console.log(apiFare)} */}
        {(apiFare != undefined && apiFare * passengerNumber != 0 && from != null && to != null) ? <View style={styles.fare}><Text style={styles.textfare}>Amount : {'\u20B9'} {apiFare * passengerNumber}</Text></View> : null}

      </View>
      {
        (apiFare != undefined) ?
          <Btn
            textColor="white"
            bgColor={btnColor}
            btnLabel="Book Ticket"
            Press={()=>handleSubmit(tripData)}
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

export default SourceDestination;