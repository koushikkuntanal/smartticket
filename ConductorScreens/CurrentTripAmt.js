import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, Alert,Button,Image, TextInput,TouchableOpacity, ImageBackground} from "react-native";
import { background } from "../components/Constants";
import {  getRouteNamesApi, TravelHandlerApi } from "../Screens/Api";

const CurrentTripAmt =({route}) =>{
  const EmpData = route.params.data;
  const [assetRouteNameFare,setAssetRouteNameFare] = useState([]);
  const [loading, setLoading] = useState();
  useEffect(()=>{

    setLoading(true);
    (async () =>{
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
      await TravelHandlerApi({              //api gets setRoute Data (ids of route)
        "EmpId":EmpData.EmpId 
      }).then(async res=>{
        
        console.log('ast id got',res.data);
        
        
        const data = [];
        for (let index = (res.data).length-1; index <= (res.data).length-1; index++) {
          
          console.log('rev id got',res.data[index].revRoute);
        if(res.data[index].RouteID != 'Detached')
         await getRouteNamesApi({
          "AstId":res.data[index].AstId,
          "RouteID":res.data[index].RouteID,
          "Trip":res.data[index].Trip,
          "revRoute":res.data[index].revRoute,
          "Time":res.data[index].Time
         }).then(res=>{
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
                <Text style={{textAlignVertical:'center'}}>Route : {item.RouteName}{'\n'}
                Type : {(item.revRoute=='T') ?<Text>Down</Text> :<Text>Up</Text> } {'\n'}
                Trip : {item.trip}
                
                </Text>
                <View style={{alignSelf:'center'}}>
                <Text style={styles.text}>Date : {item.time.split('-').reverse().join('-')}</Text>
                <Text style={styles.text}>Bus Id : {item.AstRegNo}</Text>
                <Text style={styles.text}>Cash: {'\u20B9'} {item.cashFare}</Text>
                <Text style={styles.text}>QrAmount: {'\u20B9'} {item.qrFare}</Text>
                <Text style={styles.text}>Total Amount : {'\u20B9'} {item.totalFare}</Text>
                <Text style={styles.text}>No. of cash Passengers : {item.cashpeeps} </Text>
                <Text style={styles.text}>No. of qr Passengers : {item.qrpeeps}</Text>
                <Text style={styles.text}>Total Passengers : {item.totalpeeps}</Text>
                
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
        height:"30%",
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
      text:{
        marginBottom:3
      }
});

export default CurrentTripAmt;