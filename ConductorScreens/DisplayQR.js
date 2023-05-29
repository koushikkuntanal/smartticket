import { Text, View } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import QRCode from 'react-native-qrcode-svg';

const DisplayQR = ({route})=>{
   const id = route.params.id;
   const asset = route.params.asset;
   const qrData = asset;
    return (
      <View style={styles.body}>
         <View style={styles.container}>
            <Text style={styles.operatorText}>Conductor ID: {id}</Text>
            <Text style={styles.operatorText}>Asset No: {asset}</Text>
         </View>
        {console.log('id',id,asset)}
        <View>
           
      {qrData && <QRCode value={qrData} size={200} />}
    </View>
      </View>
    )
  
}

const styles = StyleSheet.create({
    body: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:'#ffffff',
    },
    container: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
      justifyContent: "center",
      marginBottom:18
      },
      operatorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
      },
});

export default DisplayQR;