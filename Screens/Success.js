import React from "react";
import { View,Text,StyleSheet,ScrollView} from "react-native";

const History = ({route}) =>{
    
   const historyData=route.params.historyData;
   const RevhistoryData = ([...(historyData)].reverse());
   let hisObj;
    return (
    
     <ScrollView>
      {RevhistoryData.map((item,index)=>{
        
        if(item.Tdata != "")
       {  hisObj=JSON.parse(item.Tdata);
       console.log('items in success',hisObj)}
       if(item.Tdata !=""){
        return(
          
          <View style={styles.container} key={index}>
      
       {/* <View style={styles.row}>
        <Text style={styles.label}>Customer Id:</Text>
        <Text style={styles.value}>{hisObj.cid}</Text>
      </View>  */}
       
       <View style={styles.row}>
        <Text style={styles.label}>OrderID : </Text>
        <Text style={styles.value}>{hisObj.orderid}</Text>

        <Text style={styles.label}>Fare : </Text>
        <Text style={styles.value2}>{'\u20B9'} {hisObj.fare}</Text>
      </View> 

      <View style={styles.row}>
        <Text style={styles.label}>Route : </Text>
        <Text style={styles.value1}>{hisObj.route}</Text>
      </View> 

      <View style={styles.row}>
        <Text style={styles.label}>From : </Text>
        <Text style={styles.value}>{hisObj.from}</Text>
      
     
        <Text style={styles.label}>To : </Text>
        <Text style={styles.value2}>{hisObj.to}</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Created Time : </Text>
        <Text style={styles.value}>{hisObj.time}</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Number of Passengers : </Text>
        <Text style={styles.value}>{hisObj.passengers}</Text>
      </View>
    
        
        
        
      
     </View> 	
        )}
        else return null;
      })}
     </ScrollView>  
    
    );
}

const styles = StyleSheet.create({
  row:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },

  label:{
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
   
  },

  value:{
    fontSize: 16,
    color: "#666",
    flex:1,
    //justifyContent:'space-between'
  },

  value1:{
    fontSize: 16,
    color: "#666",
    flex:1
  },

  value2:{
    fontSize: 16,
    color: "#666",
  },


  container:{
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
  }
});

export default History;