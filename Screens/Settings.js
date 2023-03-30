import { StyleSheet, View,Text,TextInput, Button, Alert } from 'react-native';

const Settings = () => {
    return (
      <View style={styles.container}>
        <Text>Hello Raja</Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
     container: {
        flex: 1,
        backgroundColor: 'red'
     }
  })
  
  export default Settings;