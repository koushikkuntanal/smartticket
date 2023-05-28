
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useNavigation, } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View,Pressable,Image, BackHandler, Alert} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PagerView from 'react-native-pager-view';
import Btn from '../components/Btn';
import { btnColor } from '../components/Constants';
import { getAds, TransactionHistory, TransactionLastTicket } from './Api';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { Video } from 'expo-av';



export default function Screen_A({route}){
  const uData = route.params.data;
  const imgStr = route.params.imgStr;
  const navigation = useNavigation();
 const [adsImages,setAdsImages] = useState([]);
   const pagerRef = useRef(null);
   let totalPages;
   let currentPage =  0;
   const [image,setImage] = useState(route.params.imgStr);

   const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-9003278618989837/9736516844';

    const onPressHandler = () => {
       navigation.navigate('Login');
    }
    useEffect(()=>{
      
      const fetchData=async()=>{
        await getAds().then(res=>{
          // console.log('ads',res.data);
          setImage(res.data[Math.floor(Math.random() * res.data.length)].adstr);
          console.log('asdfghjk',res.data[Math.floor(Math.random() * res.data.length)].Num)
          setAdsImages(res.data);
           totalPages = res.data.length;
           const randomNumberIndex = Math.floor(Math.random() * res.data.length-1);
        }).catch(err=>{
          console.log('erre ads',err);
        })
      };

       const intervalId = setInterval(()=>{
        fetchData();
       },10000);

       return ()=>{
        clearInterval(intervalId);
       };

      
    },[]);
   

    const onclickHistory = async() => {
      const got = await AsyncStorage.getItem('Token');
      console.log(uData,'got',got);
      await TransactionHistory({
       "UserId":uData.AuthID ? uData.AuthID : uData[0].UserId,
      }).then(res=>{
        // var HistoryObj = JSON.parse(res.data[0].Tdata)

          console.log('jsgjh in scareen A',res.data);
         navigation.navigate('History',{historyData:res.data});
        })
        
        
       
    }

    const onclickLastTicket = async() =>{
      await TransactionLastTicket({
        "UserId":uData.AuthID ? uData.AuthID : uData[0].UserId,
      }).then(res=>{
        console.log('sxrdcfgvctfvg',res.data)
          navigation.navigate('LastTicket',{historyData:res.data})
      })
      
    }

    const onclickchangePassword = () => {
         console.log('udata',uData)  
         navigation.navigate('UsersPasswordChange',{EID:uData.AuthID,flag:uData.Flag})
    }
  
    const onClickBusPass = ()=>{
      navigation.navigate('Bus Pass',{EID:uData.AuthID,flag:uData.Flag})
    }
    
    
    return(
      <View style={styles.body}>
       {console.log('data in useruuyjh dashoard',uData)} 
        <StatusBar  backgroundColor='#f9e5f3' style={{backgroundColor: '#FFFFFF'}}>

        </StatusBar>
        <View style={styles.Container}>
          
         
          {/* <BannerAd
         
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
     /> */}

        
          <PagerView
          style={styles.pager}
          initialPage={0}
          ref={pagerRef}
         onPageSelected={(event) => {
          currentPage = event.nativeEvent.position;
          }}
          >
       {/* {adsImages.map((ad) => (
            <View key={ad.Num} >
              {console.log('num',ad.Num)}      // not working code 
                <Image
                    style={{flex:1,width:null,height:null}}
                    resizeMode="contain"
                    source={{uri:`data:image/jpeg;base64,${ad.adstr}`}}
                    
                  />
                </View>
                  
                  ))
                } */}

            <View >
              
                <Image                                      //working for ads single at at time
                    style={{flex:1,width:null,height:null}}
                    resizeMode="contain"
                    source={{uri:`data:image/jpeg;base64,${image}`}}
                    
                  />
                  {/* <Video 
                   source={{ uri: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4' }}
                   style={styles.video}
                   shouldPlay
                   resizeMode="contain"
                   isLooping
                   ></Video> */}
                </View>

                </PagerView> 
         
          
          
         
          
          </View>
       
          <View style={styles.card}>
            <TouchableOpacity 
            onPress={onclickHistory}
            >
            <Image style={styles.icon} resizeMode='contain'
            source={require('../assets/LekPay-History.png')}
            
            /><Text style={styles.text}>History</Text>
           </TouchableOpacity> 

           <TouchableOpacity onPress={onclickchangePassword}>
            <Image style={styles.icon} resizeMode='contain'
            source={require('../assets/LekPay-ResetPwd.png')}
            /><Text style={styles.text}>Change{'\n'}Password</Text>
           </TouchableOpacity> 

           
           </View>

           <View style={styles.card}>
             
           <TouchableOpacity 
           onPress={onclickLastTicket}>
            <Image style={styles.icon} resizeMode='contain'
            source={require('../assets/LekPay-MyTicket.png')}
            /><Text style={styles.text}>LastTicket</Text>
           </TouchableOpacity> 
           
           <TouchableOpacity 
           onPress={onClickBusPass}
           >
            <Image style={styles.icon} resizeMode='contain'
            source={require('../assets/LekPay-BusPass.png')}
            /><Text style={styles.text}>Bus Pass</Text>
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
      alignSelf:'center',
      textAlign:'center'
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
      marginTop:15,
      width:360,
      height:180,
      alignItems:'center'
    },

    
    parent:{
      backgroundColor:'#FFFFFF',
      borderWidth:0.2,
      flex:1,
      borderRadius:12,
     
    },
    video: {
      flex:1,
      width: null,
      height: null,
     
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
      justifyContent:'space-around',
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
      width:70,
      height:70,
      alignSelf:'center',
      marginTop:2.1
    }
  });
  