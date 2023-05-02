import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { Alert, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { color } from 'react-native-reanimated';
import Btn from '../components/Btn';
import { btnColor } from '../components/Constants';
import { getStagesApi, getStagesIDApi, setRouteApi, setStagePassApi, TravelHandlerApi } from '../Screens/Api';

const SetPassStage = ({route}) => {
    const EmpData = route.params.data;    //gets EmpId for next APi 
    const [revData,setRevData] = useState('');
    const [stages, setStages] = useState([]);
    const [reversedStages, setReversedStages] = useState([]);
    const [selectedStage,setSelectedStage] = useState('');
    const [routeId,setRouteId] = useState('');
    const navigation = useNavigation();
    const [actualIndex,setActualIndex] = useState('');
    const [selectedIndex,setselectedIndex] = useState('');
    const [assetId,setAssetId] = useState('');
    
    useEffect(()=>{
        (async()=>{
            await TravelHandlerApi({              //api gets setRoute Data (ids of route)
                "EmpId":EmpData.EmpId 
              }).then(async res=>{console.log('bus data from travel|astroid',res.data)
                setRevData(res.data[res.data.length - 1].revRoute);
                setRouteId(res.data[res.data.length-1].RouteID);
                if(res.data.length > 2) {setAssetId(res.data[res.data.length-3].AstId)}else{setAssetId(res.data[res.data.length-1].AstId)}
                    await getStagesIDApi({
                       "RouteID": res.data[res.data.length-1].RouteID
                    
                     }).then(async res => {
                          // console.log('res when getStagesIDApi is hit', res.data);
                        
                        const data = [];
                        for (let i = 0; i < (res.data.data).length; i++) {
                          await getStagesApi({
                            "StageID": (res.data.data)[i].StageID
                          }).then(res => {
                             console.log('res when stag name id hit',res.data)
                            data.push(res.data);
                            
                          })
                        }
                        setStages(data);
                        setActualIndex(res.data.idx.idx);
                        // console.log('adding stage', stages);
                        setReversedStages([...(data)].reverse());
                        // console.log('reverser staged',reversedStages)
            
            
                      }).catch(error => {
                        console.log(error)
                        alert('Please Try again!! ')
                      });

            })
        })();
    },[]);
    const onPressDetach = async ()=>{
      let timestamp;
                  let datestamp;
                  const now = new Date();
                  var  dd =now.getDate();
                var mm =now.getMonth()+1;
                var yyyy = now.getFullYear();
                var  hh =now.getHours();
                var min =now.getMinutes();
                var ss = now.getSeconds();
            
                if(dd<10){
                  dd='0'+dd;
                }
                if(mm<10){
                  mm='0'+mm;
                }
                datestamp= yyyy+'-'+mm+'-'+dd;
                  
                if(min<10){
                  min = '0' + min;
                }
                if(ss<10){
                  ss = '0' + ss;
                }
                if(hh<10){
                  hh = '0' + hh;
                }
                timestamp = hh +':'+ min +':'+ss;
      await setRouteApi({
        "EmpId":EmpData.EmpId,
        "RouteID":'Detached',
        "AstId":assetId,
        "revRoute":'',
        "time":  datestamp + ' ' + timestamp
      }).then(res=>{console.log(res.data)
        if(res.data.message == 'Asset Route Map Success')
        {alert('Route successfully Detached!!');
      navigation.goBack();
      }
        else{alert('Please try again!!')}
      }).catch(error=>{'error when setting route',console.log(error)});
    }
    const onPressPassStage = () =>{
        Alert.alert('Confirm',`Do you want to pass this stage ${selectedStage} ? `, [
            
            {
                text: 'cancel',
                
                style: 'default',
            },
            {
                text: 'Pass Stage',
                onPress: async() => {
                  let timestamp;
                  let datestamp;
                  const now = new Date();
                  var  dd =now.getDate();
                var mm =now.getMonth()+1;
                var yyyy = now.getFullYear();
                var  hh =now.getHours();
                var min =now.getMinutes();
                var ss = now.getSeconds();
            
                if(dd<10){
                  dd='0'+dd;
                }
                if(mm<10){
                  mm='0'+mm;
                }
                datestamp= yyyy+'-'+mm+'-'+dd;
                  
                if(min<10){
                  min = '0' + min;
                }
                if(ss<10){
                  ss = '0' + ss;
                }
                if(hh<10){
                  hh = '0' + hh;
                }
                timestamp = hh +':'+ min +':'+ss;
                  
                  
                  await setStagePassApi({
                    "EmpId":EmpData.EmpId,
                    "RouteID":routeId,
                    "StageId":selectedStage,
                    "idx":parseInt(actualIndex)+1,
                    "TimeStamp":  datestamp + ' ' + timestamp
                  }).then(res=>{
                    console.log(res.data);
                    if(res.data.message == 'stage pass set'){
                      Alert.alert('Success!','Stage passed');
                      navigation.goBack();
                    }
                  }).catch(err=>
                    {
                    console.log(err);
                    alert(err);
                  })
                },
                style: 'default',
            },
        
        ])
        // ALalert('pressed Pass Stage');
    }
  return (
    <View style={styles.body}>
        {/* {console.log('csd',EmpData)} */}
        {/* {console.log('revDta',revData)} */}
        {/* {console.log('stages',stages)} */}
        <Text style={styles.title}>Route</Text>
       <View style={styles.titleView}>
        
       <Text style={styles.title}>
        {(reversedStages.length == 0) ? <Text style={styles.routeName}>loading</Text> :
            (revData == 'T') ? <Text style={styles.routeName}>{reversedStages[0].StageName}</Text> :
              (stages.length == 0) ? <View><Text style={styles.routeName}>loading</Text></View> : <View><Text style={styles.routeName}>{stages[0].StageName}</Text></View>
          }
          <AntDesign style={{ alignSelf: 'center' }} name="arrowright" size={24} color="black" onPress={null} />

          {(reversedStages.length == 0) ? <Text style={styles.routeName}>loading</Text> :
            (revData == 'T') ? <Text style={styles.routeName}>{reversedStages[stages.length - 1].StageName}</Text> :
              (stages.length == 0) ? <Text style={styles.routeName}>loading</Text> : <View><Text style={styles.routeName}>{stages[stages.length - 1].StageName}</Text></View>
          }
        </Text>
       </View>
        <View style={styles.parent}>
  
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
            <Text style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>Pass Stage</Text>
            <View style={styles.input}>

              <Picker
                
                 selectedValue={selectedStage}
                onValueChange={(value, index) => {
                  console.log('hgcavhx',value,'sjgfjsvj',index)
                    setSelectedStage(value);
                    setselectedIndex(index);
                    

                }}
                mode="dropdown" // Android only
                style={styles.picker}
              >
                {(revData == 'T') ? reversedStages.map((item, index) => {
                    if(index == actualIndex+1)
                  {return (<Picker.Item
                    style={styles.pickerItem}
                    key={item.StageID}
                    label={item.StageName}
                    value={item.StageID}
                  />);}
                })
                  :
                  stages.map((item, index) => {
                    if(index == actualIndex +1)
                    {return (<Picker.Item
                      style={styles.pickerItem}
                      key={item.StageID}
                      label={item.StageName}
                      value={item.StageID}
                    />);}
                  })}
              </Picker>

              
            </View>
          </View>

        </View>
       {(actualIndex == stages.length -2) ? 
       <View style={styles.body}>
           <Text style={[styles.title,{color:'red'}]}>Cannot Pass This Stage!!</Text>
           <Btn
            textColor="white"
            bgColor={btnColor}
            btnLabel="Detach Route"
            Press={onPressDetach}
          />
       </View> :
        <Btn
            textColor="white"
            bgColor={btnColor}
            btnLabel="Pass Stage"
            Press={onPressPassStage}
          />}
    </View>
  )
}
const styles = StyleSheet.create({
    body: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: '#F9E5F3'
    },
    parent: {
         padding: "10%",
        width: "90%",
        backgroundColor: 'white',
        alignItems: 'center',
        
        borderRadius: 25,
        //marginTop: 30
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
      title: {
        fontSize: 20,
        marginBottom: 20,
        marginTop:20,
        alignContent:'center',
        textAlignVertical:'center',
      },
      titleView:{
        flexDirection:'row',
        justifyContent:'space-between'
      }
});
export default SetPassStage;