import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, Alert,Button,Image, TextInput,TouchableOpacity, ImageBackground,ScrollView} from "react-native";
import { background } from "../components/Constants";
import {  getRouteNamesApi, TravelHandlerApi } from "../Screens/Api";

const CashHandler =({route}) =>{
  const EmpData = route.params.data;
  const [assetRouteNameFare,setAssetRouteNameFare] = useState([]);
  const [loading, setLoading] = useState();
  
  
  useEffect(()=>{
    setLoading(true);
    (async () =>{
      await TravelHandlerApi({              //api gets setRoute Data (ids of route)
        "EmpId":EmpData.EmpId 
      }).then(async res=>{
       
        console.log('ast id got',res.data);
        
        
        let data = [];
        for (let index = 0; index < (res.data).length; index++) {
          console.log('rev id got',res.data[index].revRoute);
        if(res.data[index].RouteID != 'Detached')
          await getRouteNamesApi({
          "AstId":res.data[index].AstId,
          "RouteID":res.data[index].RouteID,
          "Trip":res.data[index].Trip,
          "revRoute":res.data[index].revRoute,
          "Time":res.data[index].Time
         }).then(res=>{
          console.log('pushig data',res.data);
         data.push(res.data);
         })
        }
        setAssetRouteNameFare(data);
      })

      .catch(err=>{
        console.log('err w cashHadlke',err);
      })
      
    })();
    setLoading(false);
  },[]);
    return(
        <ScrollView >
          { console.log('AssetRouteName arary',assetRouteNameFare)}
           {loading ? <Image source={require('../assets/loading.gif')} /> : null}
         
         
          {
            assetRouteNameFare.map((item,index)=>{
              return(
                <View style={styles.card} key={index}> 
                {/* <Text style={{textAlignVertical:'center'}}>Route : {item.RouteName}{'\n'}Type : {(item.revRoute=='T') ?<Text>Down</Text> :<Text>Up</Text> }</Text> */}
                <View style={{alignSelf:'center'}}>
                {/* <Text>Date : {assetRouteNameFare.date.split('-').reverse().join('-')}</Text> */}
                <Text>Route : {item.RouteName}</Text>
                <Text>Type : {(item.revRoute=='T') ?<Text>Down</Text> :<Text>Up</Text> }</Text>
                <Text>Trip : {item.trip}</Text>
                <Text style={styles.text}>Date : {item.time.split('-').reverse().join('-')}</Text>
                
                </View>
     
                <View style={{alignSelf:'center'}}>
                {/* <Text>Date : {item.date.split('-').reverse().join('-')}</Text> */}
                <Text>Bus Id : {item.AstRegNo}</Text>
                <Text>Total Cash: {'\u20B9'} {item.cashFare}</Text>
                
                </View>
               
               </View>
              )
            })
           }


        </ScrollView>
    );
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
    card: {
       
        width:"95%",
        height:93,
        flexDirection:'row',
       justifyContent:'space-between',
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
});

export default CashHandler;