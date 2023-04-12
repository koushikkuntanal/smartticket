import React, { useState, useEffect } from "react";                  //Go to validate
import { View, Text, StyleSheet, Alert, Button, Image, TextInput, TouchableOpacity } from "react-native";
import { background, btnColor } from "../components/Constants";
import { Picker } from "@react-native-picker/picker";
import Btn from "../components/Btn";
import { useNavigation } from "@react-navigation/native";
import Field from "../components/Field";
import { getAssetIdApiForEmp, getFareForUsers, getRevRouteFlagApi, getRouteIdApi, getStagesApi, getStagesIDApi } from "./Api";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';

const SourceDestination = ({ route }) => {
  const emailData = route.params.emailData;
  const assestdata = route.params.data;
  var [revRoute, setRevRoute] = useState();
  const navigation = useNavigation();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
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
  const [revData, setRevData] = useState();
  const [loading, setLoading] = useState();
  const [apiFare, setApiFare] = useState();


  useEffect(() => {
    // console.log('sending asset id',assestdata);
    // console.log('recieved email data',emailData);
    console.log('from to values', from, to);
    setEmail(emailData.Uemail);
    setCphone(emailData.Umobile);
    (async () => {
      await getAssetIdApiForEmp({
        "id": assestdata
      }).then(async res => {
        console.log('response when getAssetIdApiForEmp() is hit ')

        {
          // console.log('getting rev rouet flag with asset id', res.data.AstId)
          await getRevRouteFlagApi({

            "AstId": res.data.AstId
          }).then(res => {
            console.log('revRoute Flag', res.data)
            setLoading(true);
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
          // console.log('res when getRouteIdApi is hit')
          setRouteId(res.data[0].RouteID)

          await getStagesIDApi({
            "RouteID": res.data[0].RouteID
          }).then(async res => {
            // console.log('res when getStagesIDApi is hit', res.data);

            const data = [];
            for (let i = 0; i < (res.data).length; i++) {
              await getStagesApi({
                "StageID": (res.data)[i].StageID
              }).then(res => {
                // console.log('res when stag name id hit',)
                data.push(res.data);

              })
            }
            setStages(data);

            console.log('adding stage', stages);
            setReversedStages([...(data)].reverse());
            console.log('to ad frrom', to, from)


          }).catch(error => {
            console.log(error)
            alert(error)
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

  //   const calculateDistance = () =>{
  //     if(from =='OP1R1S1' && to == 'OP1R1S2' || from =='OP1R1S2' && to == 'OP1R1S1'){
  //       distance=10;
  //     }else if(from =='Destination A' && to == 'Destination B' || from =='Destination B' && to == 'Destination A'){
  //     distance=4;
  //     }else if(from =='Destination B' && to == 'Destination C' || from =='Destination C' && to == 'Destination B'){
  //      distance=6;
  //     }
  //     fare=(distance*perKmFees)*passengerNumber;
  //   }


  const handleSubmit = () => {
    // Handle form submission

    if (from === to || upi == '') {
      alert('Please enter all the details.');
    } else if (to == null) {
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
      console.log('details fro upi', email, cphone, upi)
      navigation.navigate('PaymentScreen', {
        From: from,
        To: to,
        Fare: apiFare,
        Date: date,
        Time: time,
        //Fare:fare,
        mail: email.trim(),
        cphone: cphone,
        upi: upi,
        orderid: orderId,
        customerid: customerId
      });
    }
  };

  const getFareFrom = async (fromV) => {
    setLoading(true);
    console.log('from and to', fromV, to);
    await getFareForUsers({
      "from": fromV,
      "to": to,
    }).then(res => {
      console.log('data when get fare is hit getFareFrom', res.data.Fare)
      setApiFare(res.data.Fare);
    }).catch(err => { console.log('err when get fare is hit', err) })
    setLoading(false);
  }

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
      {/* {console.log('qr data',assestdata)}
      {console.log('route id when useeffect is hit',routeId)}
      
      {/* {console.log('index',fromIndex)}
      {console.log('email data',emailData.Uemail,emailData.Umobile)} */}
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
                      getFareBoth(value, stages[index + 1].StageID)
                    }
                    else if (stages[index + 1] == undefined) {
                      setTo(stages[index].StageID);
                      alert('Destination cannot be selected!! ')
                    }
                  }
                  else if (revData == 'T') {
                    console.log('stages ', reversedStages[index + 1]);
                    if (reversedStages[index + 1] != undefined) {
                      setTo(reversedStages[index + 1].StageID);
                      getFareBoth(value, reversedStages[index + 1].StageID)
                    }
                    else if (reversedStages[index + 1] == undefined) {
                      alert('Destination cannot be selected!! ')
                      setTo(reversedStages[index].StageID);
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
                  console.log('to value in to picker', to)
                  getFareTo(value);
                  // console.log('from and to',from,value);
                  //     await getFareForUsers({
                  //         "from":from,
                  //         "to":value,
                  //     }).then(res=>{console.log('data when get fare is hit',res.data.Fare)
                  //     setApiFare(res.data.Fare);
                  //    }).catch(err=>{console.log('err when get fare is hit',err)})
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
        {(apiFare != undefined) ? <View style={[styles.input, { marginTop: 12 }]}>
          <Field
            width="100%"
            editable={true}

            placeholder="UPI ID"
            onChangeText={(value) => setUpi(value)}
          />
        </View> : null}
        {/* {console.log(apiFare)} */}
        {(apiFare != undefined && apiFare * passengerNumber != 0 && from != null && to != null) ? <View style={styles.fare}><Text style={styles.textfare}>Amount : {'\u20B9'} {apiFare * passengerNumber}</Text></View> : null}

      </View>
      {
        (apiFare != undefined) ?
          <Btn
            textColor="white"
            bgColor={btnColor}
            btnLabel="Book Ticket"
            Press={handleSubmit}
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