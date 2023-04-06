import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Btn from "../components/Btn";
import { background, btnColor } from "../components/Constants";
import { getAssetIdApiForEmp, getRouteApi, setRouteApi } from "../Screens/Api";

const SetRouteAsset = ({route}) =>{
  const navigation = useNavigation();
  const id=route.params.id;
    const mapData = route.params.data;
    const [sourceDestination,setSourceDestination] = useState("Unknown"); 
    const [loading,setLoading] = useState();
    const [routesData,setRoutesData] = useState([]); 
    const [assetId,setAssetId] = useState('');
    useEffect(()=>{
      (async()=>
      await getRouteApi().then(res=>{console.log(res.data)
      setRoutesData(res.data)
      }).catch(error=>{console.log(error)
      alert(error)
      })
        
      )();

      (async()=>{
        await getAssetIdApiForEmp({
          "id":mapData
        }).then(res=>{console.log('response when getAssetIdApiForEmp() is hit ',res.data)
      setAssetId(res.data.AstId)
      }).catch(err=>{console.log(err)
      alert(err);
      })
      })();
    },[])
    
    const onPressSetRoute = async() =>{
        console.log(sourceDestination);
        setLoading(true);
        if(sourceDestination == 'Unknown' )
        {
            alert('Please select route!');
        }
        else
        {
            await setRouteApi({
              "EmpId":id,
              "RouteID":sourceDestination,
              "AstId":assetId
            }).then(res=>{console.log(res.data)
              if(res.data.message == 'Asset Route Map Success')
              {alert('Route successfully set!');
            navigation.goBack();
            }
              else{alert('Please try again!!')}
            }).catch(error=>{console.log(error)})
            
        }
        setLoading(false);
    }
    return(
        <View style={styles.body}>
           <View style={styles.input}>
            {console.log('var routes',routesData,assetId)}
            {console.log('id of emp in setRouteScreen',id)}
                <Picker
                        // itemStyle={{height:40}}
                        selectedValue={sourceDestination}
                        onValueChange={(label, index) => setSourceDestination(label)}
                        mode="dropdown" // Android only
                        style={styles.picker}
                        >
                        {routesData.map((item,index)=>{
                          return (<Picker.Item
                             key={index}
                             label={item.RouteName}
                             value={item.RouteID} 
                          />);
                        })}
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