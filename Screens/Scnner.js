import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, Alert,Button} from "react-native";

import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Linking from 'expo-linking';
import { useNavigation } from "@react-navigation/native";
import { getAssetIdApiForEmp, getRouteIdApi, getStagesIDApi, LastTickCountApi, LastTicketCountUpdate, ReEnableTicket, transactionforUsers, TransactionHistory, TransactionLastTicket, UserStageIdApi } from "./Api";
// import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const Scnner = ({route}) =>{

  // const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-9003278618989837/9736516844';
  const forEmaildata = route.params.data;

  const height = 800;
  const width = 500;
    const maskRowHeight = 30;
    const maskColWidth = (width - 200) / 2;

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [passedStage, setPassedStage] = useState('');

    const navigation = useNavigation();

   let historyData;
   let histobj;
    useEffect(() => {
      
      setScanned(false);       
      const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      };
  
      getBarCodeScannerPermissions();
      console.log(scanned);

      
    },[]);

    
   

  
    const handleBarCodeScanned = ({ type, data }) => {
      setScanned(true);
      console.log(scanned);
      //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
      Alert.alert('Alert!', `Are you sure you want to proceed to this asset ${data}?`, [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Proceed',
          
          // onPress:() => navigation.navigate('Source Destination',{data:data,emailData:forEmaildata})
          onPress:async ()=>{
            await getAssetIdApiForEmp({
              "id": data
            }).then(async resAsset=>{
              console.log('reswhen het assirt d is 0hu',resAsset.data);
              await getRouteIdApi({
                "AssetID": resAsset.data.AstId
              }).then(async res1=>{
                console.log('reswhen het route id d is 0hu   of asset(bus)',res1.data.RouteID);          //gets asset's ROute id here 
                 setPassedStage(res1.data.StageId)                                                                                     //also gets passed stage of bus
                
                          await TransactionLastTicket({       // gets user's Route id
                            "UserId":forEmaildata.AuthID ? forEmaildata.AuthID : forEmaildata.UserId,
                          }).then(async res=>{
                             console.log('hist dataa .Tdata A',forEmaildata.AuthID,'u',forEmaildata.UserId,res.data.Tdata);
                  
                            historyData = res.data;
                            console.log('hist dataa',historyData);
                            console.log('hist dataa le',historyData.length);
                             console.log('hist dataa Tdata le',historyData.Tdata);
                             console.log('co',(historyData.Tdata != undefined && historyData.Tdata.length !=0));
                            console.log('co',(historyData.length != 0));
                            console.log('co',(historyData.length != undefined));


                            
                          if(forEmaildata.UserId || forEmaildata.AuthID)
                            {if( (historyData.length != 0 && historyData.length != undefined ) || (historyData.Tdata != undefined && historyData.Tdata.length !=0 && historyData.Tdata.length !=undefined) )
                            {
                              console.log('run histObj in AuthId')
                              console.log('see if ',historyData.Tdata)
                             histobj = JSON.parse(historyData.Tdata)
                             console.log('histobj',histobj);
                            }
                            else{ console.log('empty got to buy')
                            navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});}
                          }
                            
                          if(forEmaildata.UserId || forEmaildata.AuthID)
                          if( (historyData.length != 0 && historyData.length != undefined ) || (historyData.Tdata != undefined && historyData.Tdata.length !=0 && historyData.Tdata.length !=undefined) )
                          { 
                            if(histobj.ttype == 'ST' || histobj==undefined)
                          {
                            //  alert('Last Ticket is Single Ticket!!');
                             console.log('no last tic')
                              navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                            
                          }
                          else if(histobj.ttype == 'RT')
                          {
                              if(res1.data.RouteID == res.data.RouteName)
                           
                            {
                              
                              await UserStageIdApi({
                                "oid":histobj.orderid
                              }).then(
                                async responseOfUserStageIdApi=>{console.log('res when oid is hit to get from stage od Auth',responseOfUserStageIdApi.data)
                                console.log('Authathauth')

                                  await getRouteIdApi({
                                    "AssetID": resAsset.data.AstId
                                  }).then(async resWhenPasswedStageIsGot=>{
                                    console.log('resWhenPasswedStageIsGot',resWhenPasswedStageIsGot.data)
                                        await getStagesIDApi({
                                          "RouteID": resWhenPasswedStageIsGot.data.RouteID 
                              
                                        }).then(async resFirstStage=>{
                                          
                                            
                                           
                                            console.log('stages got ',resFirstStage.data.data);
                                            let myArray;
                                            if(resWhenPasswedStageIsGot.data.revRoute == 'T' ) 
                                            {
                                             myArray = (resFirstStage.data.data.reverse());
                                            } else myArray = resFirstStage.data.data;
                                            console.log('MyArray',myArray);
                                            
                                            console.log('Passes Stage of Bus = ', myArray[resWhenPasswedStageIsGot.data.idx].StageID )
                                            if(myArray[resWhenPasswedStageIsGot.data.idx].StageID == responseOfUserStageIdApi.data.EndStage){
                                              console.log('Valid bec passed stage == use Start in rT')
                                              let datestamp;
                                              const now = new Date();
                                              var  dd =now.getDate();
                                            var mm =now.getMonth()+1;
                                            var yyyy = now.getFullYear();
                                            if(dd<10){
                                              dd='0'+dd;
                                            }
                                            if(mm<10){
                                              mm='0'+mm;
                                            }
                                            datestamp= yyyy+'-'+mm+'-'+dd;
                                        
                                                console.log('for tic ckeh dtaw',datestamp,'tic time',histobj.time.slice(0,10));
                                              if(datestamp == histobj.time.slice(0,10)){ 
                                              await LastTickCountApi({
                                                "Id":forEmaildata.AuthID ? forEmaildata.AuthID : forEmaildata.UserId,
                                              }).then(res2=>{console.log('res qen cou tibs iuyb at r i d == user id',res2.data)
                                                if(res2.data.count > 1){
                                                  Alert.alert('Last Ticket Available','Would you like to Re-Enable ?',[
                                                    {
                                                      text: 'Cancel',
                                                      style: 'cancel',
                                                    },
                                                    {
                                                      text: 'OK',
                                                      onPress: async () => {

                                                       

                                                        await LastTickCountApi({
                                                          "Id":forEmaildata.AuthID ? forEmaildata.AuthID : forEmaildata.UserId,
                                                        }).then(async res=>{
                                                          console.log('when lats ti cointe hirt',res.data);
                                                          if(res.data.count > 1)
                                                        {  await LastTicketCountUpdate({
                                                          "Id":res.data.OrderID,
                                                            "count": res.data.count - 1,
                                                            
                                                          }).then(res=>{
                                                            console.log('wgen res last tic yplatw',res.data);
                                                            if(res.data.message == 'Ticket Re-Enabled')
                                                            {

                                                              navigation.navigate('LastTicket',{historyData:historyData});}
                                                          }).catch(err=>{console.log('err uhen last ciun t uoafaye',err)
                                                        alert('try again!!')
                                                        
                                                        })
                                                        await transactionforUsers({
                                                          "Id":forEmaildata.AuthID ? forEmaildata.AuthID : forEmaildata.UserId,
                                                          "RouteName": resWhenPasswedStageIsGot.data.RouteID,//(revData == 'F')  ? (stages[0].StageName + '-' + stages[stages.length - 1].StageName) : (reversedStages[0].StageName + '-' + reversedStages[reversedStages.length - 1].StageName),
                                                          "StartStage":'',//(revData == 'F')  ? stages[fromIndex].StageName : reversedStages[fromIndex].StageName,
                                                          "EndStage":'',//(revData == 'F')  ? stages[1+fromIndex+toIndex].StageName : reversedStages[1+fromIndex+toIndex].StageName ,
                                                          "Fare":0,
                                                          "Passengers":0,
                                                          "Ttype":'',
                                                          "Trip":resWhenPasswedStageIsGot.data.Trip,
                                                          "Counter":''
                                                        }).then(res=>{console.log(res.data)}).catch(err=>{console.log(err)})
                                                        }
                                                        else {
                                                          // alert('Ticket exhausted!!')
                                                          console.log('ticket exhausted');
                                                          navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                                                        }
                                                        
                                                        }).catch(err=>{
                                                          console.log('err ehast tic hyt ',err)
                                                        })
                                                      },
                                                    },
                                                  ],
                                                  )
                                                }
                                                else {
                                                  // alert('no count to minus')
                                                  console.log('no cnt to minus')
                                                  navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                                                }
                                            }).catch(err=>{
                                              console.log('err when last count is hit',err )
                                            })
                                          }else{
                                            console.log('time of ticket expired')
                                            navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                                          }
                                              console.log(`workg because ${res1.data.RouteID} == ${res.data.RouteName}` )

                                            }else{
                                              let stagesInbetween;
                                              console.log('Not Valid bec passed stage != use Start in rT S check for Inbetween stages')
                                              console.log('start andend stages',responseOfUserStageIdApi.data.EndStage,responseOfUserStageIdApi.data.StartStage)
                                               if(resWhenPasswedStageIsGot.data.revRoute == 'T') 
                                             {
                                               stagesInbetween = myArray.filter(str => str.StageID.localeCompare(responseOfUserStageIdApi.data.StartStage)>0 && str.StageID.localeCompare(responseOfUserStageIdApi.data.EndStage)<0);
                                             }
                                             else {
                                              stagesInbetween = myArray.filter(str => str.StageID.localeCompare(responseOfUserStageIdApi.data.EndStage)>0 && str.StageID.localeCompare(responseOfUserStageIdApi.data.StartStage)<0);
                                             }
                                              console.log('stagesInbetween',stagesInbetween);
                                              if(stagesInbetween.length == 0){
                                                console.log('no stages in etween got to buy');
                                                console.log('go to byu when stagesInbetween.length == 0)')
                                                navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                                              }
                                              else{
                                                let approve=false;
                                                for(let i = 0;i<=stagesInbetween.length-1;i++){
                                                  if(myArray[resWhenPasswedStageIsGot.data.idx].StageID == stagesInbetween[i].StageID)
                                                  {
                                                    approve=!approve;
                                                    // console.log('user is in berween stags so arropve and go to last ticket')
                                                    break;
                                                  }
                                                }
                                                console.log('approve?',approve);
                                                if(approve == true){
                                                  let datestamp;
                                                  const now = new Date();
                                                  var  dd =now.getDate();
                                                var mm =now.getMonth()+1;
                                                var yyyy = now.getFullYear();
                                                if(dd<10){
                                                  dd='0'+dd;
                                                }
                                                if(mm<10){
                                                  mm='0'+mm;
                                                }
                                                datestamp= yyyy+'-'+mm+'-'+dd;
                                            
                                                    console.log('for tic ckeh dtaw',datestamp,'tic time',histobj.time.slice(0,10));
                                                if(datestamp==histobj.time.slice(0,10)){
                                                  console.log('Approved send to last tcket');

                                                 await LastTickCountApi({
                                                    "Id":forEmaildata.AuthID ? forEmaildata.AuthID : forEmaildata.UserId,
                                                  }).then(res2=>{console.log('res qen cou tibs iuyb at r i d == user id',res2.data)
                                                    if(res2.data.count > 1){
                                                      Alert.alert('Last Ticket Available','Would you like to Re-Enable ?',[
                                                        {
                                                          text: 'Cancel',
                                                          style: 'cancel',
                                                        },
                                                        { 
                                                          text: 'OK',
                                                          onPress: async () => {
                                      
                                                            await LastTickCountApi({
                                                              "Id":forEmaildata.AuthID ? forEmaildata.AuthID : forEmaildata.UserId,
                                                            }).then(async res=>{
                                                              console.log('when lats ti cointe hirt',res.data);
                                                              if(res.data.count > 1)
                                                            {  await LastTicketCountUpdate({
                                                              "Id":res.data.OrderID,
                                                                "count": res.data.count - 1,
                                                                
                                                              }).then(res=>{
                                                                console.log('wgen res last tic yplatw',res.data);
                                                                if(res.data.message == 'Ticket Re-Enabled')
                                                                {navigation.navigate('LastTicket',{historyData:historyData});}
                                                              }).catch(err=>{console.log('err uhen last ciun t uoafaye',err)
                                                            alert('try again!!')
                                                            navigation.goBack();
                                                            })
                                                            await transactionforUsers({
                                                              "Id":forEmaildata.AuthID ? forEmaildata.AuthID : forEmaildata.UserId,
                                                              "RouteName": resWhenPasswedStageIsGot.data.RouteID,//(revData == 'F')  ? (stages[0].StageName + '-' + stages[stages.length - 1].StageName) : (reversedStages[0].StageName + '-' + reversedStages[reversedStages.length - 1].StageName),
                                                              "StartStage":'',//(revData == 'F')  ? stages[fromIndex].StageName : reversedStages[fromIndex].StageName,
                                                              "EndStage":'',//(revData == 'F')  ? stages[1+fromIndex+toIndex].StageName : reversedStages[1+fromIndex+toIndex].StageName ,
                                                              "Fare":0,
                                                              "Passengers":0,
                                                              "Ttype":'',
                                                              "Trip":resWhenPasswedStageIsGot.data.Trip,
                                                              "Counter":''
                                                            }).then(res=>{console.log(res.data)}).catch(err=>{console.log(err)})
                                                            }
                                                            else {
                                                              // alert('Ticket exhausted!!')
                                                              console.log('tic exhaust')
                                                              navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                                                            }
                                                            
                                                            }).catch(err=>{
                                                              console.log('err ehast tic hyt ',err)
                                                            })
                                                          },
                                                        },
                                                      ],
                                                      )
                                                    }
                                                    else {
                                                      // alert('no count to minus')
                                                      console.log('no coiunt ti minus')
                                                      navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                                                    }
                                                }).catch(err=>{
                                                  console.log('err when last count is hit',err )
                                                })
                                              }else{
                                                console.log('tic time expi' );
                                                navigation.navigate('Source Destination',{data:data,emailData:forEmaildata}); 
                                                
                                              }
                                                  console.log(`workg because ${res1.data.RouteID} == ${res.data.RouteName}` )
                                                }
                                                else{
                                                  console.log('not Approved',approve);
                                                  navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                                                }
                                              }
                                            }
                                        })
                                  }).catch(err=>{
                                    console.log('resWhenPasswedStageIsGot ERR',err)
                                  })

                              }).catch(err=>{
                                console.log('err when user satdge id in AuthID stage passed id',err)
                              })

                           
                              
                              
                            }
                            else {
                              // alert('r id not match')
                              console.log('navigae when route id mismatch')
                              navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                            }
                          }
                          else if(histobj.ttype == 'DP')
                          {
                            // alert('tic type is not st or RT')
                            console.log('tic type is not st or RT it is DP')
                            if(res1.data.RouteID == res.data.RouteName)
                            {
                              
                              await UserStageIdApi({
                                "oid":histobj.orderid
                              }).then(
                                async responseOfUserStageIdApi=>{console.log('res when oid is hit to get from stage od Auth in DP',responseOfUserStageIdApi.data)
                                console.log('Authathauth')

                                  await getRouteIdApi({
                                    "AssetID": resAsset.data.AstId
                                  }).then(async resWhenPasswedStageIsGot=>{
                                    console.log('resWhenPasswedStageIsGot',resWhenPasswedStageIsGot.data)
                                        await getStagesIDApi({
                                          "RouteID": resWhenPasswedStageIsGot.data.RouteID 
                              
                                        }).then(async resFirstStage=>{
                                          
                                            
                                           
                                            console.log('stages got ',resFirstStage.data.data);
                                            let myArray;
                                            if(resWhenPasswedStageIsGot.data.revRoute == 'T' ) 
                                            {
                                             myArray = (resFirstStage.data.data.reverse());
                                            } else myArray = resFirstStage.data.data;
                                            console.log('MyArray',myArray);
                                            
                                            console.log('Passes Stage of Bus = ', myArray[resWhenPasswedStageIsGot.data.idx].StageID )
                                            if(myArray[resWhenPasswedStageIsGot.data.idx].StageID == responseOfUserStageIdApi.data.EndStage || myArray[resWhenPasswedStageIsGot.data.idx].StageID == responseOfUserStageIdApi.data.StartStage )
                                            {
                                              console.log('Valid bec passed stage == use Start in tik satrt or end stage and so it is ebus')
                                              let datestamp;
                                              const now = new Date();
                                              var  dd =now.getDate();
                                            var mm =now.getMonth()+1;
                                            var yyyy = now.getFullYear();
                                            if(dd<10){
                                              dd='0'+dd;
                                            }
                                            if(mm<10){
                                              mm='0'+mm;
                                            }
                                            datestamp= yyyy+'-'+mm+'-'+dd;
                                        
                                                console.log('for tic ckeh dtaw',datestamp,'tic time',histobj.time.slice(0,10));
                                              if(datestamp == histobj.time.slice(0,10))
                                              { 
                                                Alert.alert('Last Ticket Available','Would you like to Re-Enable ?',[
                                                  {
                                                    text: 'Cancel',
                                                    style: 'cancel',
                                                  },
                                                  {
                                                    text: 'OK',
                                                    onPress: async () => {
                                                      navigation.navigate('LastTicket',{historyData:historyData});

                                                      await transactionforUsers({
                                                        "Id":forEmaildata.AuthID ? forEmaildata.AuthID : forEmaildata.UserId,
                                                        "RouteName": resWhenPasswedStageIsGot.data.RouteID,//(revData == 'F')  ? (stages[0].StageName + '-' + stages[stages.length - 1].StageName) : (reversedStages[0].StageName + '-' + reversedStages[reversedStages.length - 1].StageName),
                                                        "StartStage":'',//(revData == 'F')  ? stages[fromIndex].StageName : reversedStages[fromIndex].StageName,
                                                        "EndStage":'',//(revData == 'F')  ? stages[1+fromIndex+toIndex].StageName : reversedStages[1+fromIndex+toIndex].StageName ,
                                                        "Fare":0,
                                                        "Passengers":0,
                                                        "Ttype":'',
                                                        "Trip":resWhenPasswedStageIsGot.data.Trip,
                                                        "Counter":''
                                                      }).then(async res=>{
                                                        console.log(res.data,'res when transactionforUsers','data sendinf to renablre,',res.data.data.orderid,historyData.Tdata)
                                                        
                                                      await ReEnableTicket({
                                                        "oid":res.data.data.orderid,
                                                            "tdata":historyData.Tdata
                                                      }).then(res=>{
                                                        console.log(res.data)
                                                      }).catch(err=>{console.log(err)})
                                                      }).catch(err=>{console.log(err)})

                                                     
                                                    },
                                                  },
                                                ],
                                                )
                                             
                                              }
                                          else{
                                            console.log('time of ticket expired')
                                            navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                                          }
                                              console.log(`workg because ${res1.data.RouteID} == ${res.data.RouteName}` )

                                            }
                                            else{
                                              let stagesInbetween;
                                              console.log('Not Valid bec passed stage != use Start in DP S check for Inbetween stages')
                                              console.log('start and end stages',responseOfUserStageIdApi.data.StartStage,responseOfUserStageIdApi.data.EndStage)
                                               if(resWhenPasswedStageIsGot.data.revRoute == 'T') 
                                             {
                                              console.log('start',responseOfUserStageIdApi.data.StartStage,' End',responseOfUserStageIdApi.data.EndStage);
                                               stagesInbetween = myArray.filter(str => str.StageID.localeCompare(responseOfUserStageIdApi.data.EndStage)>0 && str.StageID.localeCompare(responseOfUserStageIdApi.data.StartStage)<0) ;
                                             }
                                             else {
                                              console.log('start',responseOfUserStageIdApi.data.StartStage,' End',responseOfUserStageIdApi.data.EndStage);
                                              stagesInbetween = myArray.filter(str => str.StageID.localeCompare(responseOfUserStageIdApi.data.EndStage)>0 && str.StageID.localeCompare(responseOfUserStageIdApi.data.StartStage)<0);
                                             }
                                             
                                              console.log('stagesInbetween',stagesInbetween);
                                              if(stagesInbetween.length == 0){
                                                console.log('no stages in etween got to buy');
                                                console.log('go to byu when stagesInbetween.length == 0)')
                                                navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                                              }
                                              else{
                                                let approve=false;
                                                for(let i = 0;i<=stagesInbetween.length-1;i++){
                                                  if(myArray[resWhenPasswedStageIsGot.data.idx].StageID == stagesInbetween[i].StageID)
                                                  {
                                                    approve=!approve;
                                                    // console.log('user is in berween stags so arropve and go to last ticket')
                                                    break;
                                                  }
                                                }
                                                console.log('approve?',approve);
                                                if(approve == true){
                                                  let datestamp;
                                                  const now = new Date();
                                                  var  dd =now.getDate();
                                                var mm =now.getMonth()+1;
                                                var yyyy = now.getFullYear();
                                                if(dd<10){
                                                  dd='0'+dd;
                                                }
                                                if(mm<10){
                                                  mm='0'+mm;
                                                }
                                                datestamp= yyyy+'-'+mm+'-'+dd;
                                            
                                                    console.log('for tic ckeh dtaw',datestamp,'tic time',histobj.time.slice(0,10));
                                                if(datestamp==histobj.time.slice(0,10))
                                                {

                                                  console.log('Approved send to last tcket');
                                                 
                                                  Alert.alert('Last Ticket Available','Would you like to Re-Enable ?',[
                                                    {
                                                      text: 'Cancel',
                                                      style: 'cancel',
                                                    },
                                                    { 
                                                      text: 'OK',
                                                      onPress: async () => {
                                                        {navigation.navigate('LastTicket',{historyData:historyData});}
                                                        await transactionforUsers({
                                                          "Id":forEmaildata.AuthID ? forEmaildata.AuthID : forEmaildata.UserId,
                                                          "RouteName": resWhenPasswedStageIsGot.data.RouteID,//(revData == 'F')  ? (stages[0].StageName + '-' + stages[stages.length - 1].StageName) : (reversedStages[0].StageName + '-' + reversedStages[reversedStages.length - 1].StageName),
                                                          "StartStage":'',//(revData == 'F')  ? stages[fromIndex].StageName : reversedStages[fromIndex].StageName,
                                                          "EndStage":'',//(revData == 'F')  ? stages[1+fromIndex+toIndex].StageName : reversedStages[1+fromIndex+toIndex].StageName ,
                                                          "Fare":0,
                                                          "Passengers":0,
                                                          "Ttype":'',
                                                          "Trip":resWhenPasswedStageIsGot.data.Trip,
                                                          "Counter":''
                                                        }).then(async res=>{console.log(res.data)
                                                          console.log(res.data,'res when transactionforUsers','data sendinf to renablre,',res.data.data.orderid,historyData.Tdata)
                                                          await ReEnableTicket({
                                                            "oid":res.data.data.orderid,
                                                            "tdata":historyData.Tdata
                                                          }).then(res=>{
                                                            console.log(res.data)
                                                          }).catch(err=>{console.log(err)})
                                                        }).catch(err=>{console.log(err)})
                                                        
                                                      },
                                                    },
                                                  ],
                                                  )
                                                 
                                                 
                                              }else{
                                                console.log('tic time expi' );
                                                navigation.navigate('Source Destination',{data:data,emailData:forEmaildata}); 
                                                
                                              }
                                                  console.log(`workg because ${res1.data.RouteID} == ${res.data.RouteName}` )
                                                }
                                                else{
                                                  console.log('not Approved',approve);
                                                  navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                                                }
                                              }
                                            }
                                        })
                                  }).catch(err=>{
                                    console.log('resWhenPasswedStageIsGot ERR',err)
                                  })

                              }).catch(err=>{
                                console.log('err when user satdge id in AuthID stage passed id',err)
                              })

                           
                              
                              
                            }
                            else {
                              // alert('r id not match')
                              console.log('navigae when route id mismatch')
                              navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                            }
                          }
                          //                          For Weekly pass     
                          else if(histobj.ttype == 'WP'){
                            // alert('tic type is not st or RT')
                            console.log('tic type is not st or RT or DP it is Wp')
                            if(res1.data.RouteID == res.data.RouteName)
                            {
                              
                              await UserStageIdApi({
                                "oid":histobj.orderid
                              }).then(
                                async responseOfUserStageIdApi=>{console.log('res when oid is hit to get from stage od Auth in DP',responseOfUserStageIdApi.data)
                                console.log('Authathauth')

                                  await getRouteIdApi({
                                    "AssetID": resAsset.data.AstId
                                  }).then(async resWhenPasswedStageIsGot=>{
                                    console.log('resWhenPasswedStageIsGot',resWhenPasswedStageIsGot.data)
                                        await getStagesIDApi({
                                          "RouteID": resWhenPasswedStageIsGot.data.RouteID 
                              
                                        }).then(async resFirstStage=>{
                                          
                                            
                                           
                                            console.log('stages got ',resFirstStage.data.data);
                                            let myArray;
                                            if(resWhenPasswedStageIsGot.data.revRoute == 'T' ) 
                                            {
                                             myArray = (resFirstStage.data.data.reverse());
                                            } else myArray = resFirstStage.data.data;
                                            console.log('MyArray',myArray);
                                            
                                            console.log('Passes Stage of Bus = ', myArray[resWhenPasswedStageIsGot.data.idx].StageID )
                                            if(myArray[resWhenPasswedStageIsGot.data.idx].StageID == responseOfUserStageIdApi.data.EndStage || myArray[resWhenPasswedStageIsGot.data.idx].StageID == responseOfUserStageIdApi.data.StartStage )
                                            {
                                              console.log('Valid bec passed stage == use Start in tik satrt or end stage and so it is ebus')
                                              let datestamp;
                                              const now = new Date();
                                              var dd = now.getDate();
                                              var mm = now.getMonth() + 1;
                                              var yyyy = now.getFullYear();
                                              if (dd < 10) {
                                                dd = '0' + dd;
                                              }
                                              if (mm < 10) {
                                                mm = '0' + mm;
                                              }
                                              datestamp = yyyy + '-' + mm + '-' + dd;
                                              
                                              console.log('for ticket draw', datestamp, 'ticket time', histobj.time.slice(0, 10));
                                              
                                              const ticketDate = new Date(histobj.time.slice(0, 10));
                                              const dateDiff = Math.ceil((now - ticketDate) / (1000 * 60 * 60 * 24));
                                              
                                        
                                                console.log('for tic ckeh dtaw',datestamp,'tic time',histobj.time.slice(0,10));
                                                if (dateDiff <= 7)
                                              { 
                                                Alert.alert('Last Ticket Available','Would you like to Re-Enable ?',[
                                                  {
                                                    text: 'Cancel',
                                                    style: 'cancel',
                                                  },
                                                  {
                                                    text: 'OK',
                                                    onPress: async () => {
                                                      navigation.navigate('LastTicket',{historyData:historyData});

                                                      await transactionforUsers({
                                                        "Id":forEmaildata.AuthID ? forEmaildata.AuthID : forEmaildata.UserId,
                                                        "RouteName": resWhenPasswedStageIsGot.data.RouteID,//(revData == 'F')  ? (stages[0].StageName + '-' + stages[stages.length - 1].StageName) : (reversedStages[0].StageName + '-' + reversedStages[reversedStages.length - 1].StageName),
                                                        "StartStage":'',//(revData == 'F')  ? stages[fromIndex].StageName : reversedStages[fromIndex].StageName,
                                                        "EndStage":'',//(revData == 'F')  ? stages[1+fromIndex+toIndex].StageName : reversedStages[1+fromIndex+toIndex].StageName ,
                                                        "Fare":0,
                                                        "Passengers":0,
                                                        "Ttype":'',
                                                        "Trip":resWhenPasswedStageIsGot.data.Trip,
                                                        "Counter":''
                                                      }).then(async res=>{
                                                        console.log(res.data,'res when transactionforUsers','data sendinf to renablre,',res.data.data.orderid,historyData.Tdata)
                                                        
                                                      await ReEnableTicket({
                                                        "oid":res.data.data.orderid,
                                                            "tdata":historyData.Tdata
                                                      }).then(res=>{
                                                        console.log(res.data)
                                                      }).catch(err=>{console.log(err)})
                                                      }).catch(err=>{console.log(err)})

                                                     
                                                    },
                                                  },
                                                ],
                                                )
                                             
                                              }
                                          else{
                                            console.log('time of ticket expired')
                                            navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                                          }
                                              console.log(`workg because ${res1.data.RouteID} == ${res.data.RouteName}` )

                                            }
                                            else{
                                              let stagesInbetween;
                                              console.log('Not Valid bec passed stage != use Start in DP S check for Inbetween stages')
                                              console.log('start and end stages',responseOfUserStageIdApi.data.StartStage,responseOfUserStageIdApi.data.EndStage)
                                               if(resWhenPasswedStageIsGot.data.revRoute == 'T') 
                                             {
                                              console.log('start',responseOfUserStageIdApi.data.StartStage,' End',responseOfUserStageIdApi.data.EndStage);
                                               stagesInbetween = myArray.filter(str => str.StageID.localeCompare(responseOfUserStageIdApi.data.EndStage)>0 && str.StageID.localeCompare(responseOfUserStageIdApi.data.StartStage)<0) ;
                                             }
                                             else {
                                              console.log('start',responseOfUserStageIdApi.data.StartStage,' End',responseOfUserStageIdApi.data.EndStage);
                                              stagesInbetween = myArray.filter(str => str.StageID.localeCompare(responseOfUserStageIdApi.data.EndStage)>0 && str.StageID.localeCompare(responseOfUserStageIdApi.data.StartStage)<0);
                                             }
                                             
                                              console.log('stagesInbetween',stagesInbetween);
                                              if(stagesInbetween.length == 0){
                                                console.log('no stages in etween got to buy');
                                                console.log('go to byu when stagesInbetween.length == 0)')
                                                navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                                              }
                                              else{
                                                let approve=false;
                                                for(let i = 0;i<=stagesInbetween.length-1;i++){
                                                  if(myArray[resWhenPasswedStageIsGot.data.idx].StageID == stagesInbetween[i].StageID)
                                                  {
                                                    approve=!approve;
                                                    // console.log('user is in berween stags so arropve and go to last ticket')
                                                    break;
                                                  }
                                                }
                                                console.log('approve?',approve);
                                                if(approve == true){
                                                  let datestamp;
                                                  const now = new Date();
                                                  var  dd =now.getDate();
                                                var mm =now.getMonth()+1;
                                                var yyyy = now.getFullYear();
                                                if(dd<10){
                                                  dd='0'+dd;
                                                }
                                                if(mm<10){
                                                  mm='0'+mm;
                                                }
                                                datestamp= yyyy+'-'+mm+'-'+dd;
                                            
                                                    console.log('for tic ckeh dtaw',datestamp,'tic time',histobj.time.slice(0,10));
                                                if(datestamp==histobj.time.slice(0,10))
                                                {

                                                  console.log('Approved send to last tcket');
                                                 
                                                  Alert.alert('Last Ticket Available','Would you like to Re-Enable ?',[
                                                    {
                                                      text: 'Cancel',
                                                      style: 'cancel',
                                                    },
                                                    { 
                                                      text: 'OK',
                                                      onPress: async () => {
                                                        {navigation.navigate('LastTicket',{historyData:historyData});}
                                                        await transactionforUsers({
                                                          "Id":forEmaildata.AuthID ? forEmaildata.AuthID : forEmaildata.UserId,
                                                          "RouteName": resWhenPasswedStageIsGot.data.RouteID,//(revData == 'F')  ? (stages[0].StageName + '-' + stages[stages.length - 1].StageName) : (reversedStages[0].StageName + '-' + reversedStages[reversedStages.length - 1].StageName),
                                                          "StartStage":'',//(revData == 'F')  ? stages[fromIndex].StageName : reversedStages[fromIndex].StageName,
                                                          "EndStage":'',//(revData == 'F')  ? stages[1+fromIndex+toIndex].StageName : reversedStages[1+fromIndex+toIndex].StageName ,
                                                          "Fare":0,
                                                          "Passengers":0,
                                                          "Ttype":'',
                                                          "Trip":resWhenPasswedStageIsGot.data.Trip,
                                                          "Counter":''
                                                        }).then(async res=>{console.log(res.data)
                                                          console.log(res.data,'res when transactionforUsers','data sendinf to renablre,',res.data.data.orderid,historyData.Tdata)
                                                          await ReEnableTicket({
                                                            "oid":res.data.data.orderid,
                                                            "tdata":historyData.Tdata
                                                          }).then(res=>{
                                                            console.log(res.data)
                                                          }).catch(err=>{console.log(err)})
                                                        }).catch(err=>{console.log(err)})
                                                        
                                                      },
                                                    },
                                                  ],
                                                  )
                                                 
                                                 
                                              }else{
                                                console.log('tic time expi' );
                                                navigation.navigate('Source Destination',{data:data,emailData:forEmaildata}); 
                                                
                                              }
                                                  console.log(`workg because ${res1.data.RouteID} == ${res.data.RouteName}` )
                                                }
                                                else{
                                                  console.log('not Approved',approve);
                                                  navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                                                }
                                              }
                                            }
                                        })
                                  }).catch(err=>{
                                    console.log('resWhenPasswedStageIsGot ERR',err)
                                  })

                              }).catch(err=>{
                                console.log('err when user satdge id in AuthID stage passed id',err)
                              })

                           
                              
                              
                            }
                            else {
                              // alert('r id not match')
                              console.log('navigae when route id mismatch')
                              navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                            }
                          }else if(histobj.ttype == 'MP'){
                            // alert('tic type is not st or RT')
                            console.log('tic type is not st or RT or DP orwp it is Mp')
                            if(res1.data.RouteID == res.data.RouteName)
                            {
                              
                              await UserStageIdApi({
                                "oid":histobj.orderid
                              }).then(
                                async responseOfUserStageIdApi=>{console.log('res when oid is hit to get from stage od Auth in DP',responseOfUserStageIdApi.data)
                                console.log('Authathauth')

                                  await getRouteIdApi({
                                    "AssetID": resAsset.data.AstId
                                  }).then(async resWhenPasswedStageIsGot=>{
                                    console.log('resWhenPasswedStageIsGot',resWhenPasswedStageIsGot.data)
                                        await getStagesIDApi({
                                          "RouteID": resWhenPasswedStageIsGot.data.RouteID 
                              
                                        }).then(async resFirstStage=>{
                                          
                                            
                                           
                                            console.log('stages got ',resFirstStage.data.data);
                                            let myArray;
                                            if(resWhenPasswedStageIsGot.data.revRoute == 'T' ) 
                                            {
                                             myArray = (resFirstStage.data.data.reverse());
                                            } else myArray = resFirstStage.data.data;
                                            console.log('MyArray',myArray);
                                            
                                            console.log('Passes Stage of Bus = ', myArray[resWhenPasswedStageIsGot.data.idx].StageID )
                                            if(myArray[resWhenPasswedStageIsGot.data.idx].StageID == responseOfUserStageIdApi.data.EndStage || myArray[resWhenPasswedStageIsGot.data.idx].StageID == responseOfUserStageIdApi.data.StartStage )
                                            {
                                              console.log('Valid bec passed stage == use Start in tik satrt or end stage and so it is ebus')
                                              let datestamp;
                                                  const now = new Date();
                                                  var dd = now.getDate();
                                                  var mm = now.getMonth() + 1;
                                                  var yyyy = now.getFullYear();
                                                  if (dd < 10) {
                                                    dd = '0' + dd;
                                                  }
                                                  if (mm < 10) {
                                                    mm = '0' + mm;
                                                  }
                                                  datestamp = yyyy + '-' + mm + '-' + dd;

                                                  console.log('for ticket draw', datestamp, 'ticket time', histobj.time.slice(0, 10));

                                                  const ticketDate = new Date(histobj.time.slice(0, 10));
                                                  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()); // Calculate date 1 month ago
                                                  if (ticketDate >= oneMonthAgo && ticketDate <= now)
                                              { 
                                                Alert.alert('Last Ticket Available','Would you like to Re-Enable ?',[
                                                  {
                                                    text: 'Cancel',
                                                    style: 'cancel',
                                                  },
                                                  {
                                                    text: 'OK',
                                                    onPress: async () => {
                                                      navigation.navigate('LastTicket',{historyData:historyData});

                                                      await transactionforUsers({
                                                        "Id":forEmaildata.AuthID ? forEmaildata.AuthID : forEmaildata.UserId,
                                                        "RouteName": resWhenPasswedStageIsGot.data.RouteID,//(revData == 'F')  ? (stages[0].StageName + '-' + stages[stages.length - 1].StageName) : (reversedStages[0].StageName + '-' + reversedStages[reversedStages.length - 1].StageName),
                                                        "StartStage":'',//(revData == 'F')  ? stages[fromIndex].StageName : reversedStages[fromIndex].StageName,
                                                        "EndStage":'',//(revData == 'F')  ? stages[1+fromIndex+toIndex].StageName : reversedStages[1+fromIndex+toIndex].StageName ,
                                                        "Fare":0,
                                                        "Passengers":0,
                                                        "Ttype":'',
                                                        "Trip":resWhenPasswedStageIsGot.data.Trip,
                                                        "Counter":''
                                                      }).then(async res=>{
                                                        console.log(res.data,'res when transactionforUsers','data sendinf to renablre,',res.data.data.orderid,historyData.Tdata)
                                                        
                                                      await ReEnableTicket({
                                                        "oid":res.data.data.orderid,
                                                            "tdata":historyData.Tdata
                                                      }).then(res=>{
                                                        console.log(res.data)
                                                      }).catch(err=>{console.log(err)})
                                                      }).catch(err=>{console.log(err)})

                                                     
                                                    },
                                                  },
                                                ],
                                                )
                                             
                                              }
                                          else{
                                            console.log('time of ticket expired')
                                            navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                                          }
                                              console.log(`workg because ${res1.data.RouteID} == ${res.data.RouteName}` )

                                            }
                                            else{
                                              let stagesInbetween;
                                              console.log('Not Valid bec passed stage != use Start in DP S check for Inbetween stages')
                                              console.log('start and end stages',responseOfUserStageIdApi.data.StartStage,responseOfUserStageIdApi.data.EndStage)
                                               if(resWhenPasswedStageIsGot.data.revRoute == 'T') 
                                             {
                                              console.log('start',responseOfUserStageIdApi.data.StartStage,' End',responseOfUserStageIdApi.data.EndStage);
                                               stagesInbetween = myArray.filter(str => str.StageID.localeCompare(responseOfUserStageIdApi.data.EndStage)>0 && str.StageID.localeCompare(responseOfUserStageIdApi.data.StartStage)<0) ;
                                             }
                                             else {
                                              console.log('start',responseOfUserStageIdApi.data.StartStage,' End',responseOfUserStageIdApi.data.EndStage);
                                              stagesInbetween = myArray.filter(str => str.StageID.localeCompare(responseOfUserStageIdApi.data.EndStage)>0 && str.StageID.localeCompare(responseOfUserStageIdApi.data.StartStage)<0);
                                             }
                                             
                                              console.log('stagesInbetween',stagesInbetween);
                                              if(stagesInbetween.length == 0){
                                                console.log('no stages in etween got to buy');
                                                console.log('go to byu when stagesInbetween.length == 0)')
                                                navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                                              }
                                              else{
                                                let approve=false;
                                                for(let i = 0;i<=stagesInbetween.length-1;i++){
                                                  if(myArray[resWhenPasswedStageIsGot.data.idx].StageID == stagesInbetween[i].StageID)
                                                  {
                                                    approve=!approve;
                                                    // console.log('user is in berween stags so arropve and go to last ticket')
                                                    break;
                                                  }
                                                }
                                                console.log('approve?',approve);
                                                if(approve == true){
                                                  let datestamp;
                                                  const now = new Date();
                                                  var  dd =now.getDate();
                                                var mm =now.getMonth()+1;
                                                var yyyy = now.getFullYear();
                                                if(dd<10){
                                                  dd='0'+dd;
                                                }
                                                if(mm<10){
                                                  mm='0'+mm;
                                                }
                                                datestamp= yyyy+'-'+mm+'-'+dd;
                                            
                                                    console.log('for tic ckeh dtaw',datestamp,'tic time',histobj.time.slice(0,10));
                                                if(datestamp==histobj.time.slice(0,10))
                                                {

                                                  console.log('Approved send to last tcket');
                                                 
                                                  Alert.alert('Last Ticket Available','Would you like to Re-Enable ?',[
                                                    {
                                                      text: 'Cancel',
                                                      style: 'cancel',
                                                    },
                                                    { 
                                                      text: 'OK',
                                                      onPress: async () => {
                                                        {navigation.navigate('LastTicket',{historyData:historyData});}
                                                        await transactionforUsers({
                                                          "Id":forEmaildata.AuthID ? forEmaildata.AuthID : forEmaildata.UserId,
                                                          "RouteName": resWhenPasswedStageIsGot.data.RouteID,//(revData == 'F')  ? (stages[0].StageName + '-' + stages[stages.length - 1].StageName) : (reversedStages[0].StageName + '-' + reversedStages[reversedStages.length - 1].StageName),
                                                          "StartStage":'',//(revData == 'F')  ? stages[fromIndex].StageName : reversedStages[fromIndex].StageName,
                                                          "EndStage":'',//(revData == 'F')  ? stages[1+fromIndex+toIndex].StageName : reversedStages[1+fromIndex+toIndex].StageName ,
                                                          "Fare":0,
                                                          "Passengers":0,
                                                          "Ttype":'',
                                                          "Trip":resWhenPasswedStageIsGot.data.Trip,
                                                          "Counter":''
                                                        }).then(async res=>{console.log(res.data)
                                                          console.log(res.data,'res when transactionforUsers','data sendinf to renablre,',res.data.data.orderid,historyData.Tdata)
                                                          await ReEnableTicket({
                                                            "oid":res.data.data.orderid,
                                                            "tdata":historyData.Tdata
                                                          }).then(res=>{
                                                            console.log(res.data)
                                                          }).catch(err=>{console.log(err)})
                                                        }).catch(err=>{console.log(err)})
                                                        
                                                      },
                                                    },
                                                  ],
                                                  )
                                                 
                                                 
                                              }else{
                                                console.log('tic time expi' );
                                                navigation.navigate('Source Destination',{data:data,emailData:forEmaildata}); 
                                                
                                              }
                                                  console.log(`workg because ${res1.data.RouteID} == ${res.data.RouteName}` )
                                                }
                                                else{
                                                  console.log('not Approved',approve);
                                                  navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                                                }
                                              }
                                            }
                                        })
                                  }).catch(err=>{
                                    console.log('resWhenPasswedStageIsGot ERR',err)
                                  })

                              }).catch(err=>{
                                console.log('err when user satdge id in AuthID stage passed id',err)
                              })

                           
                              
                              
                            }
                            else {
                              // alert('r id not match')
                              console.log('navigae when route id mismatch')
                              navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                            }
                          }
                          else{
                            //alert('t type is not st rt or DP or Wp orMp')
                            navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                          }

                          }
                          else{
                            console.log('navigae when historyData.TData == undefined')
                              navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                            }
                  
                            
                          })
                            .catch(err=>console.log(err))
              }).catch(err=>{console.log('err whrn roiye id is jiey',err)})
            }).catch(err=>{
              console.log('err wnen aget assit od id hir',err);
            })
           
          }
        },
        
       
      ]);
    };
  
    if (hasPermission === null) {
      return <View style={styles.body}><Text>Requesting for camera permission</Text></View>
    }
    if (hasPermission === false) {
      return <View style={styles.body}><Text>No access to camera</Text>;</View>
    }
  return (
    <View style={styles.body}>
      {console.log('xyx',forEmaildata)}
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.maskOutter}>
        
     
          
           
          {/* <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
     /> */}

            
            
         
          
          
         
       
            <View style={[{ flex: maskRowHeight  }, styles.maskRow, styles.maskFrame]} />
              
             <View style={[{ flex: 30 }, styles.maskCenter]}>
             <View style={[{ width: maskColWidth }, styles.maskFrame]} />
             <View style={styles.maskInner} />
            <View style={[{ width: maskColWidth }, styles.maskFrame]} />
          </View>
        <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
      </View>
     
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)}/>}
    </View>
  );
}
const styles = StyleSheet.create({
    body: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      
    },
    maskOutter: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'space-around',
     
    },
    maskInner: {
      width: 250,
      backgroundColor: 'transparent',
      borderColor: '#000000',
      borderWidth: 1,
      
      
    },
    maskFrame: {
      backgroundColor: 'rgba(1,1,1,0.6)',
      
    },
    maskRow: {
      width: '100%',
      
    },
    maskCenter: { flexDirection: 'row' },

    Container:{
      backgroundColor: '#ffffff',
      //flex:1,
      paddingRight:1,
      //marginBottom:355,
      marginTop:10,
      width:360,
      height:190,
    }
});

export default Scnner;