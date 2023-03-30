
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Pressable,Image} from 'react-native';
import PagerView from 'react-native-pager-view';



export default function Screen_A({route}){
  const navigation = useNavigation();
   // const data= route.params.userData;

    const onPressHandler = () => {
       navigation.navigate('Login');
    }
    return(
      <View style={styles.body}>
       {/* {console.log('data in user dashoard',data)} */}
        <StatusBar  backgroundColor='#f9e5f3' style={{backgroundColor: '#FFFFFF'}}>

        </StatusBar>
        <View style={styles.Container}>
          <View style={styles.parent}>
           
            <PagerView 
              style={styles.pager}
              initialPage={0}
              //onPageScroll={(e) => console.log(e)}
              //onPageSelected={(e) => console.log(e)}
              //onPageScrollStateChanged={(e) => console.log(e)}
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
       
        
         <Text style={styles.text}>
          Screen A
        </Text>
        <Pressable
         onPress={onPressHandler}
         style={({pressed})=>({backgroundColor: pressed? 'orange' : 'lightblue'})}
        >
          <Text style={styles.text}>
            Logout
          </Text>
        </Pressable> 
        
      </View>

      

    )
  }
  
  const styles = StyleSheet.create({

    body: {
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },
  
    text: {
      fontSize: 20,
      //fontWeight:'bold',
      margin: 10,
    },

    Container: {
      //backgroundColor: 'red',
      //flex:1,
      paddingRight:1,
      marginBottom:355,
      width:360,
      height:180,
      
    },
    parent:{
      backgroundColor:'#FFFFFF',
      borderWidth:0.2,
      flex:1,
      borderRadius:12,
     
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
    
    
  });
  