import React from "react";
import {StyleSheet,View,Text} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const History = () => {
  
  
  
  

  return(

    <View style={styles.container}>
       
      <TouchableOpacity>
        <Text style={styles.text}>birthday</Text>
      </TouchableOpacity> 
    </View>
  );

}
 
const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center'
  },

  text:{
    alignSelf:'center'
  }
})


export default History;