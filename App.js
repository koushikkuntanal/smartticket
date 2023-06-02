import { NavigationContainer, useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Pressable, ImageBackground,TextInput,Button} from 'react-native';
import Screen_A from './Screens/Screen_A';



import Settings from './Screens/Settings';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useEffect,useState } from 'react';
import { BackHandler,Alert,Image } from 'react-native';

import Constants from 'expo-constants';
import { DrawerItem } from '@react-navigation/drawer';
import { BarCodeScanner } from 'expo-barcode-scanner';

import Home from './Screens/Home';
import { color } from 'react-native-reanimated';

import Scnner from './Screens/Scnner';
import Userregistration from './Screens/Userregistration';
import Signup from './Screens/Signup';
import Otp from './Screens/otp';
import SetPassword from './Screens/setPassword';

import Dummyotp from './Screens/dummyotp';
import FAQ from './Screens/Faq';
import Dfaq from './Screens/Dfaq';
import PaymentScreen from './Screens/PaymentScreen';
import Success from './Screens/Success';
import LekpayLogin from './Screens/Login';
import { background, btnColor, darkPink } from './components/Constants';
import AllScreens from './ConductorScreens/AllScreen';
import CashHandler from './ConductorScreens/CashHandler';
import CheckTickets from './ConductorScreens/CheckTickets';
import IssueTickets from './ConductorScreens/IssueTickets';
import MapAssets from './ConductorScreens/MapAssets';
import LekpayProfile from './ConductorScreens/lekpayProfile';
import MapAssetsChecker from './screenChecker/MapAssetsChecker';
import ProfileChecker from './screenChecker/ProfileChecker';
import AssetTicketReport from './screenChecker/AssetTicketReport';
import ValidateTicketChecker from './screenChecker/ValidateTicketChecker';
import TicketScreen from './ConductorScreens/TicketScreen';
import ChangePasswordConductor from './ConductorScreens/ChangePasswordConductor';
import { ProfileApi, ProfilePic } from './Screens/Api';
import EditProfile from './Screens/EditProfile';
import SetRouteAsset from './ConductorScreens/SetRouteAsset';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Btn from './components/Btn';
import SourceDestination from './Screens/SourceDestination';
import { AntDesign } from '@expo/vector-icons';

import Screen_B from './Screens/Screen_B';
import UsersPasswordChange from './Screens/UsersPasswordChange';
import AsyncStorage from '@react-native-async-storage/async-storage';
import History from './Screens/Success';
import Screen_C from './Screens/Screen_C';
import LastTicket from './Screens/LastTicket';
import CurrentTripAmt from './ConductorScreens/CurrentTripAmt';
import SetPassStage from './ConductorScreens/SetPassStage';
import AboutUs from './Screens/AboutUs';
import ForgotPassword from './Screens/ForgotPassword';
import ForgotPasswordOtp from './Screens/ForgotPasswordOtp';
import BusPass from './Screens/BusPass';
import DisplayQR from './ConductorScreens/DisplayQR';





//const Tab = createBottomTabNavigator();
const Tab = createMaterialBottomTabNavigator()
//const Tab = createMaterialTopTabNavigator();

const Drawer = createDrawerNavigator();




function DrawerNavigator() {

  const navigation = useNavigation();
  useEffect(() => {
    

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to go back?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };
  
 
  return (
    
    <Drawer.Navigator
     screenOptions={{
       drawerStyle: {
         backgroundColor: '#f9e5f3'
       },
      headerStyle: { backgroundColor: '#C80088' },
      headerTintColor: '#fff',
    }}
    
    >
      <Drawer.Screen 
      name="Home" 
      component={TabNavigator}
      options={{
       
        headerRight:()=>(
          <View style={{flexDirection:'row'}}>
          <Ionicons
            style={{marginRight:23}}
            name= 'scan'
           onPress={() => navigation.navigate("Scnner")}
            
            size={30}
            color='#ffffff'
          />

          

          <Ionicons
            style={{marginRight:25}}
            name="ios-help-circle-outline"
            size={30}
            color='#ffffff'
          />

          


          </View>

        ),
        title:'Home',
        drawerIcon: ({focused}) => (
          <Ionicons name="md-home" size={24} Color={focused ? '#000000' : '#ffffff'}></Ionicons>
        ),

        
      }}

      
       />
       {<Drawer.Screen 
      name="Settings" 
      component={Settings}
      options={{
        title:'Settings',
        drawerIcon: ({focused}) => (
          <Ionicons name="md-settings" size={24} Color={focused ? '#000000' : '#ffffff'}></Ionicons>
        )
      }}
       /> }
      
      
    </Drawer.Navigator>
  );
}

function TabNavigator({route}) {
const data = route.params.userData;
const imgStr = route.params.imgStr;
 StackNavigator(data);
 
 console.log('tab data');
// if(data.AuthID == 'U2'){
//   alert('gich gili gili');
// }
 
// const today = new Date();
//   useEffect(()=>{
//     (async()=>{
//       await ProfileApi({
//         "flag":data.Flag,
//         "id":data.AuthID
//       }).then(res=>{console.log('dob notification data',res.data);
//       console.log('name of user',res.data.Uname);
//       let dob=today.getFullYear() + '-'+ (today.getMonth()+1) + '-' + today.getDate();
//       var  dd =today.getDate();
//       var mm =today.getMonth()+1;
//       var yyyy = today.getFullYear();
  
//       if(dd<10){
//         dd='0'+dd;
//       }
//       if(mm<10){
//         mm='0'+mm;
//       }
//       dob = yyyy+'-'+mm+'-'+dd;
//       console.log("current date",dob);
//       console.log('birthday of user ',res.data.UDoB)
//       if(dob == res.data.UDoB){
      
        
//         Alert.alert(
//           'Happy Birthday!', 
//           'Wishing you a very happy birthday!', 
           
//           [
            
//             { text: 'OK', onPress: () => console.log('OK Pressed') },
//           ],
//           {
//              cancelable: false,
            
            
//              }
//         );
            
        
//       }

     
//     })
//     })()
//   },[]);

  return (
    <Tab.Navigator
   barStyle={{height:0                                       }}
    screenOptions={{
      tabBarIcon:{display:'none'}
    }}
   
  >
    <Tab.Screen
      name="Screen_A"
      component={Screen_A}
     options={{
      tabBarVisible: false,
      tabBarLabel:"",
      tabBarStyle:{display:'none'},
      backgroundColor:'transparent'
     }}
        initialParams={{data:data,imgStr:imgStr}}
      />
      

    
      
    </Tab.Navigator>
  );
}

function StackNavigator (data) {

  const [mNumber,setNumber]  = useState('');
  const [password,setPassword] = useState('');
  const noImage = 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1371229056.1675413808&semt=sph';
 const [image,setImage] = useState('');
  const userData = data;
 

  

  
  // useEffect(() => {
  //   (async()=>{
  //     await ProfilePic({
  //       "UserId":userData.AuthID
  //     }).then(res=>{
  //       console.log('pro data',res.data);
  //       setImage(`data:image/jpeg;base64,${res.data}`);
  //     }).catch(err=>{
  //       console.log('err pro sata',err)
  //     })
  //   })();

   
  // }, []);

  
 
  const handleLogout = async () => {
    
    await AsyncStorage.removeItem('Mobile');
    await AsyncStorage.removeItem('Password');
    navigation.navigate('Login');
    // navigation.replace('Login');
    
  };
   
  
  const Stack = createStackNavigator();
  const navigation = useNavigation();
  

 
  return(
    <Stack.Navigator 
    
    initialRouteName='Login'
     screenOptions={{
      headerShown:true,
      headerTintColor: '#fff',
      
      }}
      >
        <Stack.Screen
        options={{
          headerShown: false,
        }}
        name='Home'
        component={Home}
        />
        <Stack.Screen
        name="tab"
        component={TabNavigator}

        options={({route,navigation})=>({
          tabBarVisible: false,
          title:'Lekpay',
          tabBarStyle:{display:'none'},
         headerStyle: {
        backgroundColor: '#C80088',
        
      },
      
       headerLeft: () => (
        
          <View style={{backgroundColor:'#C80088',justifyContent:'center',alignItems:'center',marginLeft:10,padding:5,borderRadius:20}}>
          
           {/* <Ionicons
             //style={{paddingLeft: 10}}
             name= 'person-outline'
             size={25}
             color='#ffffff'
             onPress={async()=>{
              console.log(route.params.userData.Flag)
              await ProfileApi({
                "flag":route.params.userData.Flag=='U'? route.params.userData.Flag:route.params.userData[0].Flag,
                  "id": route.params.userData.Flag=='U'? route.params.userData.AuthID :route.params.userData[0].UserId
              })
              .then(res=>{
                console.log('for switced emp',res.data)
                navigation.navigate('Userregistration',{data:(res.data)})
            
            })
              .catch(error=>{console.log(error)
              alert(error)})
              
              }}
           /> */}

          <TouchableOpacity onPress={async()=>{
              console.log('format a',route.params.userData.AuthID)
              console.log(route.params.imageData.length)
             if(route.params.userData.AuthID != undefined){ 
              await ProfileApi({
                "flag":route.params.userData.Flag=='U'? route.params.userData.Flag:route.params.userData[0].Flag,
                  "id": route.params.userData.Flag=='U'? route.params.userData.AuthID :route.params.userData[0].UserId
              })
              .then(res=>{
                console.log('for switced emp',res.data)
                navigation.navigate('Userregistration',{data:(res.data)})
            
            })
              .catch(error=>{console.log(error)
              alert(error)})}
              else{
                await ProfileApi({
                  "flag":route.params.userData.Flag=='U'? route.params.userData.Flag:route.params.userData[0].Flag,
                    "id": route.params.userData.Flag=='U'? route.params.userData.UserId :route.params.userData[0].UserId
                })
                .then(res=>{
                  console.log('for switced emp',res.data)
                  navigation.navigate('Userregistration',{data:(res.data)})
              
              })
                .catch(error=>{console.log(error)
                alert(error)})
              }
              
              }}>
             {(route.params.imageData.length) > 10000 ? <View style={{borderWidth:0,borderRadius:70}}><Image resizeMode='contain' source={{ uri: route.params.imageData }} style={styles.image}/></View> : <Ionicons
             //style={{paddingLeft: 10}}
             name= 'person-outline'
             size={25}
            //  color='#ffffff'
             
           /> }
            </TouchableOpacity>
         </View>
       ),

      headerRight : () => (
        <View style={{flexDirection:'row'}}>
          <MaterialCommunityIcons
            style={{marginRight:15}}
            name= 'qrcode-scan'
           onPress={async()=>{
            await ProfileApi({
              "flag":route.params.userData.Flag == 'U'? route.params.userData.Flag : route.params.userData[0].Flag,
                "id": route.params.userData.Flag == 'U'? route.params.userData.AuthID : route.params.userData[0].UserId
            })
            .then(res=>{
              console.log('for switced emp sacnner',res.data)
              navigation.navigate('Scnner',{data:(res.data)})
          
          })
            .catch(error=>{console.log(error)
            alert(error)})
            
            }}
            
            size={25}
            color='#ffffff'
          />

          

          <MaterialCommunityIcons
            style={{marginRight:15}}
            name="help-circle-outline"
            onPress={() => navigation.navigate("Faq")}
            size={25}
            color='#ffffff'
          />
          
          <MaterialIcons
          style={{marginRight:15}}
           name="error-outline" 
           onPress={() => navigation.navigate("AboutUs")}
           size={26} 
           color="#FFFFFF"
            />

         <MaterialCommunityIcons
            style={{marginRight:15}}
            name="exit-to-app"
            size={25}
            onPress={handleLogout}
            color='#ffffff'
          />
          


          </View>

      ),

     
      })}
        />
      <Stack.Screen 
       name="Qrscanner"
       component={Screen_A}
       
       options={{title: 'Home',
       headerStyle: {
        backgroundColor: '#C80088'
        
      },
       
      //  headerLeft: () => (
        
      //     <View style={{backgroundColor:'pink',justifyContent:'center',alignItems:'center',marginLeft:10,padding:5,borderRadius:20}}>
      //      <Ionicons
      //        //style={{paddingLeft: 10}}
      //        name= 'person-outline'
      //        size={40}
      //        color='#ffffff'
      //        onPress={onPressHandler}
      //      />
      //    </View>
      //  ),

      headerRight : () => (
        <View style={{flexDirection:'row'}}>
          <MaterialCommunityIcons
            style={{marginRight:23}}
            name= 'qrcode-scan'
           onPress={() => navigation.navigate("Scnner")}
            
            size={25}
            color='#ffffff'
          />

          

          <MaterialCommunityIcons
            style={{marginRight:25}}
            name="help-circle-outline"
            onPress={() => navigation.navigate("Faq")}
            size={25}                                    
            color='#ffffff'
          />                                                   

          

         <MaterialCommunityIcons
            style={{marginRight:25}}
            name="exit-to-app"
            onPress={backAction}
            size={25}
            color='#ffffff'
          />

          


          </View>

      ),

     
      }}
      />
      <Stack.Screen
      name='Scnner'
      component={Scnner}
      options={{
        headerShown: true,
         title:'QR Scanner',
         headerStyle:{
          backgroundColor: '#C80088'
        }
      }}
      />
      
      <Stack.Screen 
       name='Userregistration'
       component={Userregistration}
       options={{
         headerShown: true,
         title:'User Profile',
         headerStyle:{
          backgroundColor: '#C80088'
        }
       }}
      />

      <Stack.Screen 
       name='Signup'
       component={Signup}
       options={{
         headerShown: false
       }}
      />

      <Stack.Screen 
       name='Otp'
       component={Otp}
       options={{
         headerShown: false
       }}
      />

      <Stack.Screen 
       name='SetPassword'
       component={SetPassword}
       options={{
         headerShown: false
       }}
      />

      <Stack.Screen 
       name='Login'
       component={LekpayLogin}
       options={{
         headerShown: false
       }}
      />

      {/* <Stack.Screen 
       name='Dummyotp'
       component={Dummyotp}
       options={{
         headerShown: false
       }}
      /> */}

      <Stack.Screen 
        name='Faq'
        component={FAQ}
        options={{
          title: 'FAQ',
          headerShown: true,

          headerStyle:{
            backgroundColor: '#C80088'
          }
        }}
      />

      <Stack.Screen 
       name='Dfaq'
       component={Dfaq}
       options={{
        title: 'FAQ',
        headerShown: true,

        headerStyle:{
          backgroundColor: '#C80088'
        }
      }}
      />

    <Stack.Screen 
       name='PaymentScreen'
       component={PaymentScreen}
       options={{
        title: 'PaymentScreen',
        headerShown: true,

        headerStyle:{
          backgroundColor: '#C80088'
        }
      }}
      />

<Stack.Screen 
       name='History'
       component={History}
       options={{
        title: 'History',
        headerShown: true,

        headerStyle:{
          backgroundColor: '#C80088'
        }
      }}
      />

      <Stack.Screen
        name='UsersPasswordChange'
        component={UsersPasswordChange}
        options={{
          title: 'UsersChangePassword',
          headerShown: true,
  
          headerStyle:{
            backgroundColor: '#C80088'
          }
        }}
      />

      <Stack.Screen 
        name='LastTicket'
        component={LastTicket}
        options={{
          title: 'LastTicket',
          headerShown: true,
  
          headerStyle:{
            backgroundColor: '#C80088'
          }
        }}
      />

      <Stack.Screen 
        name='AboutUs'
        component={AboutUs}
        options={{
          title: 'About Us',
          headerShown: true,
          
          headerStyle:{
            backgroundColor: '#C80088'
          }
        }}

        
      />

      <Stack.Screen 
        name='ForgotPassword'
        component={ForgotPassword}
        options={{
          title: 'Forgot Password',
          headerShown: true,

          headerStyle:{
            backgroundColor: '#C80088'
          }
        }}
      
      />

     <Stack.Screen 
        name='ForgotPasswordOtp'
        component={ForgotPasswordOtp}
        options={{
          title: 'ForgotPasswordOtp',
          headerShown: true,

          headerStyle:{
            backgroundColor: '#C80088'
          }
        }}
      
      />
     
     <Stack.Screen 
     options={{
      headerStyle:{backgroundColor:darkPink},
      headerLeft: null ,
      title:'DashBoard',
      headerRight: () => (
       <View style={{flexDirection:'row'}}>
        <MaterialCommunityIcons
            style={{marginRight:18}}
            name="exit-to-app"
            size={28}
            onPress={handleLogout}
            color='#ffffff'
          />
        </View>   
      )
    }}
     
     
     name='AllScreens' 
     component={AllScreens}
    
     />

     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink},title:'Cash Collection'}} name='Cash Handler' component={CashHandler}/>
      
     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink}}} name='Check Tickets' component={CheckTickets}/> 
     
     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink}}} name='Issue Tickets' component={IssueTickets}/>

     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink}}} name='Capture Asset' component={MapAssets}/>

     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink}}} name='lekpayProfile' component={LekpayProfile}/>

     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink}}} name='Ticket Screen' component={TicketScreen}/>

     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink}}} name='Map Asset' component={MapAssetsChecker}/>

     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink}}} name='Profile' component={ProfileChecker}/>

     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink}}} name='Report' component={AssetTicketReport}/>

     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink}}} name='Check' component={ValidateTicketChecker}/>
     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink}}} name='ChangePasswordConductor' component={ChangePasswordConductor}/>
     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink}}} name='Edit Profile' component={EditProfile}/>
     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink}}} name='Route Asset' component={SetRouteAsset}/>
     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink}}} name='Source Destination' component={SourceDestination}/>
     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink}}} name='Current Trip' component={CurrentTripAmt}/>
     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink}}} name='Set Pass Stage' component={SetPassStage}/>
     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink}}} name='Bus Pass' component={BusPass}/>
     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink}}} name='Display QR' component={DisplayQR}/>
   
     
     
     </Stack.Navigator>
  )
}

export default function App() {
  

  return (
    
    <NavigationContainer>
        
       {/* <DrawerNavigator />  */}
     {/* <TabNavigator /> 
       */}
       <StackNavigator/>
    </NavigationContainer>

    
    
  );

  
}

const styles = StyleSheet.create({

  body: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },

  text: {
    fontSize: 20,
    fontWeight:'bold',
    margin: 10,
  },

  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center'
  },

  image:{
    borderRadius:20,
    // borderWidth:7,
    borderColor:darkPink,
    alignSelf:'center',
    width:40,
    height:40,
   
},
  
});
