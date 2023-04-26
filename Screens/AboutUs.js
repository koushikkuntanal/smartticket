import React from "react";
import { View, Text, StyleSheet} from "react-native";

const AboutUs = () => {
  return (
    <View style={styles.container}>
      
      
      <Text style={styles.label}>Proudly owned by : </Text> 
    
      <Text style={styles.label1}>POWAHA INFOTECH PVT.LTD</Text>   
      
      <View style={styles.row}>
      <Text style={styles.label2}>Contributers : </Text>
      </View>
      <Text style={styles.label3}>Akash Hadli</Text>
    </View>
  ); 
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 1,
        width:"90%",
        height:"70%",
        marginTop:30
      },

      row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 4,
      },
      label:{
        fontSize: 18,
       //fontWeight: "bold",
       color: "#333",
       
       alignSelf:'center',
       
      },

      label1:{
        fontSize: 22,
       //fontWeight: "bold",
       color: "#333",
       marginVertical: 40,
       alignSelf:'center',
       
      },

      label2:{
        fontSize:20,
      },

      label3:{
        fontSize: 20,
        
        color: "#333",
        marginVertical: 2,
        alignSelf:'center',
        paddingLeft:50,
        
      },
});

export default AboutUs;