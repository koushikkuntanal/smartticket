import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Pressable} from 'react-native';

export default function Screen_C({navigation}){

    const onPressHandler = () => {
       navigation.navigate('Screen_D');
    }
    return(
      <View style={styles.body}>
        <Text style={styles.text}>
          Screen C
        </Text>
        <Pressable
         onPress={onPressHandler}
         style={({pressed})=>({backgroundColor: pressed? '#ddd' : '#0f0'})}
        >
          <Text style={styles.text}>
            Go to Screen D
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
      backgroundColor: '#FFFFFF'
    },
  
    text: {
      fontSize: 20,
      fontWeight:'bold',
      margin: 10,
    }
    
  });
  