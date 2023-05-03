import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, Alert,Button} from "react-native";

import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Linking from 'expo-linking';
import { useNavigation } from "@react-navigation/native";
import { LastTickCountApi, LastTicketCountUpdate, TransactionHistory, TransactionLastTicket } from "./Api";


const Scnner = ({route}) =>{
  const forEmaildata = route.params.data;

  const height = 800;
  const width = 500;
    const maskRowHeight = 30;
    const maskColWidth = (width - 200) / 2;

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

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
            await TransactionLastTicket({
              "UserId":forEmaildata.AuthID ? forEmaildata.AuthID : forEmaildata.UserId,
            }).then(res=>{
              // console.log('yyyy',res.data.Tdata);
    
              historyData = res.data;
            if(historyData.Tdata != undefined){ histobj = JSON.parse(historyData.Tdata)}
              console.log('tickettype',historyData);
    
             if(histobj!=undefined){ if(histobj.ttype == 'ST' || histobj==undefined){
               alert('Last Ticket is Single Ticket!!');
                navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
              }else{
                Alert.alert('Last Ticket Available','Would you like to renable ?',[
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
                      })
                      }
                      else {
                        alert('Ticket exhausted')
                        navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
                      }
                       
                      }).catch(err=>{
                        console.log('err ehast tic hyt ',err)
                      })
                     },
                  },
                ],
                )
                
              }}else{
                navigation.navigate('Source Destination',{data:data,emailData:forEmaildata});
              }
    
              
            })
              .catch(err=>console.log(err))
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
});

export default Scnner;