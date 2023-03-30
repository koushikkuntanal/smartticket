import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Btn from "../components/Btn";
import { background, btnColor } from "../components/Constants";

const SetRouteAsset = ({route}) =>{
    const mapData = route.params.data;
    const [sourceDestination,setSourceDestination] = useState("Unknown"); 
    const [loading,setLoading] = useState();
    
    const onPressSetRoute = () =>{
        console.log(sourceDestination);
        setLoading(true);
        if(sourceDestination == 'Unknown' )
        {
            alert('Please select route!');
        }
        else
        {
            alert('Route successfully set!');
        }
        setLoading(false);
    }
    return(
        <View style={styles.body}>
           <View style={styles.input}>
                <Picker
                        // itemStyle={{height:40}}
                        selectedValue={sourceDestination}
                        onValueChange={(value, index) => setSourceDestination(value)}
                        mode="dropdown" // Android only
                        style={styles.picker}
                        >
                        <Picker.Item style={styles.pickerItem} label="Select Route" value="Unknown" />
                        <Picker.Item style={styles.pickerItem} label="Destination A to Destination J" value="Destination A to Destination J" />
                        <Picker.Item style={styles.pickerItem} label="Destination A to Destination K" value="Destination A to Destination K"  />
                        <Picker.Item style={styles.pickerItem} label="Destination C to Destination M" value="Destination C to Destination M" />
                </Picker>
            </View>
            <Text>For asset : {mapData}</Text>
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