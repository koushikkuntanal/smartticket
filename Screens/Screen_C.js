import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Pressable} from 'react-native';

export default function LastTicket({navigation}){

    
    return(
      <View style={styles.body}>
        <Text style={styles.text}>
          Screen C
        </Text>
        
          
        
      </View>
    )
  }
  
  const styles = StyleSheet.create({

    body: {
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF'
    },
  
    text: {
      fontSize: 20,
      fontWeight:'bold',
      margin: 10,
    }
    
  });
  