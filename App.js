import { NavigationContainer, useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Pressable, ImageBackground,TextInput,Button} from 'react-native';
import Screen_A from './Screens/Screen_A';
import Screen_B from './Screens/Screen_B';
import Screen_C from './Screens/Screen_C';
import Screen_D from './Screens/Screen_D';
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
import { btnColor, darkPink } from './components/Constants';
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
import { ProfileApi } from './Screens/Api';
import EditProfile from './Screens/EditProfile';
import SetRouteAsset from './ConductorScreens/SetRouteAsset';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Btn from './components/Btn';










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
 StackNavigator(data);
console.log('tab data',data);
// if(data.AuthID == 'U2'){
//   alert('gich gili gili');
// }
 
const today = new Date();
  useEffect(()=>{
    (async()=>{
      await ProfileApi({
        "flag":data.Flag,
        "id":data.AuthID
      }).then(res=>{console.log('dob notification data',res.data);
      console.log('name of user',res.data.Uname);
      let dob=today.getFullYear() + '-'+ (today.getMonth()+1) + '-' + today.getDate();
      var  dd =today.getDate();
      var mm =today.getMonth()+1;
      var yyyy = today.getFullYear();
  
      if(dd<10){
        dd='0'+dd;
      }
      if(mm<10){
        mm='0'+mm;
      }
      dob = yyyy+'-'+mm+'-'+dd;
      console.log("current date",dob);
      console.log('birthday of user ',res.data.UDoB )
      if(dob == res.data.UDoB){
      
        Alert.alert(
          'Happy Birthday!', 
          'Wishing you a very happy birthday!', 
           
          [
            
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          {
             cancelable: false,
            //  customView: (
            //   <Image
            //     source={require('./assets/birthday-image.png')}
            //     style={{ width: 200, height: 200 }}
            //   />
            // ),
            
             }
        );
            
        // const customAlert = () => (
        //   <Image style={{width:50}}source={require('./assets/birthday-image.png')} />
        // );
        
        // Alert.alert('', '', [], { customView: customAlert });
      }

     
    })
    })()
  },[]);
  return (
    <Tab.Navigator
   
    barStyle={{backgroundColor:'#ffffff'}}
    screenOptions={({ route }) => ({
       
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Screen_A') {

          iconName =  'heart'
            size = focused ? 25 : 22;
           color = focused 
           ? '#C80088'
           :  'black'; 
        } else if (route.name === 'Screen_B') {
          iconName = 'car'
          size = focused ? 25 : 22;
          color = focused
          ? '#C80088'
          : 'black'
        } else if (route.name === 'Screen_C') {
          iconName = 'rocket'
          size = focused ? 25 : 22;
          color = focused                                 
          ? '#C80088'
          : 'black'
        } else if(route.name === 'Screen_D') {
          
          iconName = 'add'
          size = focused ? 25 : 22;
          color = focused
          ? '#C80088'
          : 'black'
        }

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: 'black',
      
      
    })}
  
  >
      <Tab.Screen
        name="Screen_A"
        component={Screen_A}
        
      />
      <Tab.Screen
        
        name="Screen_B"
        component={Screen_B}
       /> 

      <Tab.Screen
        name="Screen_C"
        component={Screen_C}
       /> 

       <Tab.Screen
        name="Screen_D"
        component={Screen_D}
       /> 

    
      
    </Tab.Navigator>
  );
}

function StackNavigator (data) {
 
  const userData = data;
  console.log('stack show',userData);
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
          title:'Lekpay',
         headerStyle: {
        backgroundColor: '#C80088',
        
      },
      
       headerLeft: () => (
        
          <View style={{backgroundColor:'pink',justifyContent:'center',alignItems:'center',marginLeft:10,padding:5,borderRadius:20}}>
           {console.log("data....",route.params.userData)
           
           }
           
           <Ionicons
             //style={{paddingLeft: 10}}
             name= 'person-outline'
             size={25}
             color='#ffffff'
             onPress={async()=>{
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
              console.log("data....1",route.params.userData.AuthID);
              }}
           />
         </View>
       ),

      headerRight : () => (
        <View style={{flexDirection:'row'}}>
          <MaterialCommunityIcons
            style={{marginRight:15}}
            name= 'qrcode-scan'
           onPress={() => navigation.navigate("Scnner")}
            
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
           name="notifications" 
           size={26} 
           color="#FFFFFF"
            />

         <MaterialCommunityIcons
            style={{marginRight:15}}
            name="exit-to-app"
            size={25}
            onPress={backAction}
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
         title:'Qr Scanner',
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
       name='Success'
       component={Success}
       options={{
        title: 'Success Page',
        headerShown: true,

        headerStyle:{
          backgroundColor: '#C80088'
        }
      }}
      />
     
     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink}, }}
     
     
     name='AllScreens' component={AllScreens}/>

     <Stack.Screen options={{headerStyle:{backgroundColor:darkPink}}} name='Cash Handler' component={CashHandler}/>
      
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

  
  
});
