
import { NavigationContainer, useNavigation, } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View,Pressable,Image} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PagerView from 'react-native-pager-view';
import Btn from '../components/Btn';
import { btnColor } from '../components/Constants';
import { TransactionHistory } from './Api';



export default function Screen_A({route}){
  const uData = route.params.data;
  const navigation = useNavigation();
 
   // const data= route.params.userData;

    const onPressHandler = () => {
       navigation.navigate('Login');
    }
    
    // const changePassword = () => {
    //   navigation.navigate('UsersPasswordChange');
       

    // }

    const onclickHistory = async() => {
      console.log(uData);
      await TransactionHistory({
       "UserId":uData.AuthID ? uData.AuthID : uData[0].UserId,
      }).then(res=>{
        // var HistoryObj = JSON.parse(res.data[0].Tdata)

          console.log('jsgjh in scareen A',res.data);
         navigation.navigate('History',{historyData:res.data});
        })
        
        
       
    }

    const onclickLastTicket = async() =>{
      await TransactionHistory({
        "UserId":uData.AuthID ? uData.AuthID : uData[0].UserId,
      }).then(res=>{
         navigation.navigate('LastTicket',{historyData:res.data})
      })
      
    }

    
    
    return(
      <View style={styles.body}>
       {console.log('data in useruuyjh dashoard',uData)} 
        <StatusBar  backgroundColor='#f9e5f3' style={{backgroundColor: '#FFFFFF'}}>

        </StatusBar>
        <View style={styles.Container}>
          <View style={styles.parent}>
           
            <PagerView 
              style={styles.pager}
              initialPage={0}
             
              >
             <View key="1" style={{borderRadius:8}}>
              <Image 
                  style={{width:"100%",height:"100%",borderRadius:11}}
                  resizeMode='stretch'
                  source={require('../assets/Scenry.png')}
                  
                />
             </View>
             <View key="2" style={{borderRadius:8}}>
             <Image 
                  style={{width:"100%",height:"100%",borderRadius:11}}
                  resizeMode='stretch'
                  source={require('../assets/Buildings.png')}
                  
                />
             </View>
             <View key="3" style={{borderRadius:8}}>
             <Image 
                  style={{width:"100%",height:"100%",borderRadius:11}}
                  resizeMode='stretch'
                  source={require('../assets/Wow.png')}
                  
                />
             </View> 
             
            </PagerView> 

            
            
          </View>
          
          
         
          
          </View>
       
          <View style={styles.card}>
            <TouchableOpacity 
            onPress={onclickHistory}
            >
            <Image style={styles.icon} resizeMode='contain'
            source={require('../assets/LekPay-History.png')}
            
            /><Text style={styles.text}>History</Text>
           </TouchableOpacity> 

           <TouchableOpacity onPress={()=>null}>
            <Image style={styles.icon} resizeMode='contain'
            source={require('../assets/LekPay-ResetPwd.png')}
            /><Text style={styles.text}>Change Password</Text>
           </TouchableOpacity> 

           <TouchableOpacity 
           onPress={onclickLastTicket}>
            <Image style={styles.icon} resizeMode='contain'
            source={require('../assets/LekPay-MyTicket.png')}
            /><Text style={styles.text}>LastTicket</Text>
           </TouchableOpacity> 
           
           </View>
           
           
           
         <Text style={styles.text1}>
          {/* Screen A */}
        </Text>
        <View>
        {/* <Btn
            textColor="white"
            bgColor={btnColor}
            btnLabel="Logout"
            Press={onPressHandler}
            /> */}
        </View>
        
        
      </View>

      

    )
  }
  
  const styles = StyleSheet.create({

    body: {
      flex:1,
      //justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
    },
  
    text: {
      fontSize: 12,
      fontWeight:'bold',
      marginTop:5,
      alignSelf:'center'
    },

    text1 : {
      fontSize:12,
      fontWeight:'bold',
      alignSelf:'center',
      marginTop:15
    },
    Container: {
      backgroundColor: '#ffffff',
      //flex:1,
      paddingRight:1,
      //marginBottom:355,
      marginTop:10,
      width:360,
      height:190,
      
    },

    
    parent:{
      backgroundColor:'#FFFFFF',
      borderWidth:0.2,
      flex:1,
      borderRadius:12,
     
    },

    // parent1:{
    //   backgroundColor:'#ffffff',
    //   marginTop:10,
    //   width:357,
    //   height:75,
    //   borderRadius:9,
    //   borderWidth:1,
    //   flexDirection:'row',
    //   justifyContent:'space-evenly'
      
    // },

    card: {
        
      width:"90%",
      flexDirection:'row',
      justifyContent:'space-evenly',
      backgroundColor: '#ffffff',
      borderRadius: 9,
      padding: 16,
      marginTop: 12,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 12,
    },

    pager:{
      flex:1,
      alignSelf:'stretch',
      //backgroundColor:'red',

    },

    txt:{
      textAlign:'center',
      fontSize:20,
      //fontWeight:'bold'
    },
    
    icon:{
      aspectRatio:1,
      width:50,
      height:52,
      alignSelf:'center',
      marginTop:2.1
    }
  });
  