import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, Alert,Button} from "react-native";

import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Linking from 'expo-linking';
import { useNavigation } from "@react-navigation/native";

const Scnner = ({route}) =>{
  const forEmaildata = route.params.data;
  const height = 800;
  const width = 500;
    const maskRowHeight = 30;
    const maskColWidth = (width - 200) / 2;

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const navigation = useNavigation();

  
    useEffect(() => {

      
       
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
          onPress:() => navigation.navigate('Source Destination',{data:data,emailData:forEmaildata})
          
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