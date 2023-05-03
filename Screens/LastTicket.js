import React, { useEffect,useState } from "react";
import { View,Text,StyleSheet,Image} from "react-native";
import { transactionQrApi } from "./Api";

export default function LastTicket({route}){

    
    const historyData = route.params.historyData;
    // const RevhistoryData = ([...(historyData)].reverse());
    const [qrValue, setQrValue] = useState('Your String Value');
    let hisObj=JSON.parse(historyData.Tdata);
    let obj;
    useEffect(()=>{
      console.log('histadta',hisObj,historyData)
      if(historyData.Tdata != undefined)
      { obj = JSON.parse(historyData.Tdata);
      console.log("api data ",obj);
      (async()=>{
        await transactionQrApi({
          "cid":obj.cid,
          "orderid":obj.orderid,
          "route":obj.route,
          "from":obj.from,
          "to":obj.to,
          "fare":obj.fare,
          "time":obj.time,
          "Tgen":'Q',
          "passengers":obj.passengers,
          "ttype": obj.ttype,
        }).then(res=>{console.log('res ehen qr is hit',res.data)
      setQrValue('data:image/png;base64,'+res.data);
      })
        .catch(err=>{console.log('err ehwn qr is hiy',err)})
      })();
    }
    },[]);
    

    return (

      <View style={styles.container} >
       {console.log('historydata',historyData)} 
       {console.log('hisobj',hisObj)}
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
     <Text style={styles.label}>Number of Passengers : </Text>
       <Text style={styles.value}>{hisObj.passengers}</Text>
     </View>
     
     <View style={styles.row}>
       <Text style={styles.label}>Created Time : </Text>
       <Text style={styles.value}>{hisObj.time}</Text>
     </View>

     <View style={styles.row}>
       <Text style={styles.label}>Ticket Type : </Text>
       <Text style={styles.value}>{hisObj.ttype}</Text>
     </View>
     <View style={{alignItems:'center',justifyContent:'center',marginTop:20}}>
        <Image source={{uri:`${qrValue}`}} style={{width:150,height:150,}}></Image>
        </View>
     
   
       
       
       
     
    </View> 
    //  <View>
    //   (hisObj ) ? <View>
       
        
       
       
    //   {
       
          
          	
    //     }
    //     else return null;
      

        
    //  </View> 
    //  : alert('No last Ticket available..')
     
     
     
      
    //  </View>
    );
};

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
