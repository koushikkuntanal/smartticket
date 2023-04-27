import React from "react";
import { View, Text, StyleSheet} from "react-native";

const AboutUs = () => {
  return (
    <View style={styles.body}>
    <View style={styles.container}>
      
      
      <Text style={styles.label}>Proudly owned by</Text> 
    
      <Text style={styles.label1}>POWAHA INFOTECH PVT.LTD</Text>   
      
      <View style={styles.row}>
      <Text style={styles.label2}>Contributers</Text>
      </View>
      <View style={styles.row}>
      <Text style={styles.label4}>Akash Hadli</Text>
      </View>
     
      <View style={styles.row}>
       <Text style={styles.label4}>Koushik V Kuntanal</Text>
      </View>
      <View style={styles.row}>
      <Text style={styles.label4}>Manjunath Basava</Text>
      </View>
      <View style={styles.row}>
      <Text style={styles.label4}>Prathik K</Text>
      </View>
      
    </View>
    </View>
  ); 
};

const styles = StyleSheet.create({

    body:{
     backgroundColor:"#ffffff",
     flex:1
    },
    container: {
        backgroundColor: "#ffffff",
        borderRadius: 11,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 1,
        width:"92%",
        height:"46%",
        marginTop:180,
        
      },

      row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 2,
        
      },
      label:{
        fontSize: 20,
       //fontWeight: "bold",
       
       color: "#333",
       
       alignSelf:'center',
       marginTop:10
       
      },

      label1:{
        fontSize: 22,
       //fontWeight: "bold",
       color: "#333",
       marginVertical: 38,
        marginTop:10,
       alignSelf:'center',
       
      
       
      },

      label2:{
        fontSize:21,
        paddingLeft:90,
        //marginBottom:8
      },

    
      label4:{
        fontSize: 18,
        alignSelf:'center',
        marginTop:7,
        paddingLeft:98

      },

      label5:{
        fontSize: 18,
        alignSelf:'center',
        marginTop:7,
        paddingLeft:98

      },

});

export default AboutUs;