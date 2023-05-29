import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Btn from "../components/Btn";
import { background, btnColor } from "../components/Constants";
import { getAssetIdApiForEmp, getRouteApi, setRouteApi, setStagePassApi } from "../Screens/Api";

const SetRouteAsset = ({route}) =>{
  const navigation = useNavigation();
  const id=route.params.id;
    const mapData = route.params.data;
    const [sourceDestination,setSourceDestination] = useState("Unknown"); 
    const [loading,setLoading] = useState();
    const [routesData,setRoutesData] = useState([]); 
    const [assetId,setAssetId] = useState('');
    const [from,setFrom] = useState('');
    const [to,setTo] = useState('');
    const [revRoute,setRevRoute] = useState(false);
    const [fromIndex,setFromIndex] = useState('');

    useEffect(()=>{
      // (async()=>
      // await getRouteApi({
      //   "EmpId":id
      // }).then(res=>{console.log(res.data)
      // setRoutesData(res.data)
      // }).catch(error=>{console.log(error)
      // alert(error)
      // })
        
      // )();

      (async()=>{
        await getAssetIdApiForEmp({
          "id":mapData
        }).then(async res=>{console.log('response when getAssetIdApiForEmp() is hit ',res.data.AstId)
      setAssetId(res.data.AstId)
      if(res.data.AstId.slice(0, res.data.AstId.indexOf("A")) == id.slice(0, id.indexOf("E")))
        {    await getRouteApi({
            "EmpId":id
          }).then(res=>{console.log('res wgen getRId is ht',res.data)
          setRoutesData(res.data)
          }).catch(error=>{console.log(error)
          alert(error)
          })
        }
          else{
            alert('Operators Mismatch!!')
            console.log('Asset operator',res.data.AstId.slice(0, res.data.AstId.indexOf("A")),'Conductr op',id.slice(0, id.indexOf("E")))
            navigation.goBack();
            navigation.goBack();
          }
      }).catch(err=>{console.log(err)
      alert(err);
      })
      })();
    },[])
    
    const onPressSetRoute = async() =>{
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
      
        console.log(sourceDestination); 
        setLoading(true);
        if(sourceDestination == 'Unknown' )
        {
            alert('Please select route!');
        }
        else
        { console.log('timestamp',datestamp,timestamp);
            await setRouteApi({
              "EmpId":id,
              "RouteID":sourceDestination,
              "AstId":assetId,
              "revRoute":revRoute ? 'T' : 'F' ,
              "time": datestamp +' '+timestamp
            }).then(async res=>{console.log(res.data)
              if(res.data.message == 'Asset Route Map Success')
              {alert('Route successfully set!');
             await AsyncStorage.setItem('EmpAsset',mapData);                      // for display QR
            navigation.goBack();
            navigation.goBack();
            }
              else{alert('Please try again!!')}
            }).catch(error=>{'error when setting route',console.log(error)});

            await setStagePassApi({
              "EmpId":id,
              "AstId":assetId,
              "RouteID":sourceDestination,
              "StageId":" ",
              "idx":0,
              "TimeStamp":  datestamp + ' ' + timestamp
            }).then(res=>{
              console.log('reswhe setPass hit 1sr time',res.data);

            }).catch(err=>{console.log(err)})
            
        }
        setLoading(false);
    }
 
    const onPressReverse = () =>{
      setRevRoute(!revRoute);

    }

    return(
        <View style={styles.body}>
          <Text>{mapData}</Text>
           <View style={styles.input}>
            
            {console.log('id of emp in setRouteScreen',id)}
                <Picker
                        // itemStyle={{height:40}}
                        selectedValue={sourceDestination}
                        onValueChange={(label, index) => {setSourceDestination(label)
                          setFromIndex(index)
                        }}
                        mode="dropdown" // Android only
                        style={styles.picker}
                        >
                        {routesData.map((item,index)=>{
                          return (<Picker.Item
                             key={index}
                             label={item.RouteName}
                             value={item.RouteID} 
                          />);
                        })}
                         </Picker>
            </View>
            
             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
             <Text>Start : </Text>
             <View style={styles.input}>
                
              
            <Picker
              // itemStyle={{height:40}}
               selectedValue={from}
               onValueChange={(label, index) => {setFrom(label)
               
               }}
               mode="dropdown" // Android only
               style={styles.picker}
             > 
               { routesData.map((item,index)=>{
                       if(fromIndex == index)
                          {return revRoute ? (<Picker.Item
                            style={styles.pickerItem}
                              key={index}
                              label={item.RouteEStage}
                              value={item.StageID} 
                           />) : (<Picker.Item
                            style={styles.pickerItem}
                              key={index}
                              label={item.RouteSStage}
                              value={item.StageID} 
                           />)
                           ;}
                         })
                          
              }
        </Picker>
        </View>
             </View>
             <AntDesign style={{alignSelf:'center',transform: [{ rotate: '90deg' }],}} name="swap" size={32}  color="black" onPress={onPressReverse}/>
       
             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
             <Text>End : </Text>
             <View style={styles.input}>
                
              
            <Picker
              // itemStyle={{height:40}}
               selectedValue={to}
               onValueChange={(label, index) => {setTo(label)
               
               }}
                mode="dialog" // Android only
               style={styles.picker}
             > 
               { routesData.map((item,index)=>{
                       if(fromIndex == index)
                          {return revRoute ? (<Picker.Item
                            style={styles.pickerItem}
                              key={index}
                              label={item.RouteSStage}
                              value={item.StageID} 
                           />)
                           :
                           (<Picker.Item
                            style={styles.pickerItem}
                              key={index}
                              label={item.RouteEStage}
                              value={item.StageID} 
                           />)
                           
                           ;}
                         })
                          
              }
        </Picker>
       </View>
             </View>
            
            <Btn
             textColor="white"
             bgColor={btnColor}
             btnLabel="Set Route"
             Press={onPressSetRoute}
            />
             {loading ?  <Image  source={require('../assets/loading.gif')} /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
      flex: 1,
      alignItems: "center",
      backgroundColor:background
    },
    input: {
        width:"75%",
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 5,
        marginTop: 20,
        marginBottom:20,
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
});

export default SetRouteAsset;