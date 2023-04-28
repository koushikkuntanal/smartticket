import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, Alert,Button,Image, TextInput,TouchableOpacity, ImageBackground} from "react-native";
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
        
        
        const data = [];
        for (let index = 0; index < (res.data).length-1; index+=2) {
          console.log('from',res.data[index].Time);
          console.log('to',res.data[index+1].Time);
          console.log('rev id got',res.data[index].revRoute);
         await getRouteNamesApi({
          "AstId":res.data[index].AstId,
          "RouteID":res.data[index].RouteID,
          "fromTime":res.data[index].Time,
          "toTime":res.data[index+1].Time,
          "revRoute":res.data[index].revRoute
         }).then(res=>{
          console.log(res.data);
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
        <View style={styles.body}>
           {loading ? <Image source={require('../assets/loading.gif')} /> : null}
         { console.log('AssetRouteName',assetRouteNameFare)}
         
          {
            assetRouteNameFare.map((item,index)=>{
              return(
                <View style={styles.card} key={index}> 
                <Text style={{textAlignVertical:'center'}}>Route : {item.RouteName}{'\n'}Type : {(item.revRoute=='T') ?<Text>Down</Text> :<Text>Up</Text> }</Text>
                <View style={{alignSelf:'center'}}>
                <Text>Date : {item.date.split('-').reverse().join('-')}</Text>
                <Text>Bus Id : {item.AstRegNo}</Text>
                <Text>Total Cash: {'\u20B9'} {item.cashFare}</Text>
                
                </View>
               
               </View>
              )
            })
           }


        </View>
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
        height:80,
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