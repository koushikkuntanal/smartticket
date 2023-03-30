import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View,Text,TextInput, Button, Alert } from 'react-native';

const Home = () => {

   
    const navigation= useNavigation();
    const onPressHandle=() =>{
        navigation.navigate('Signup');
    }
    return (
      <View style={styles.container}>
        <View style={styles.btnn}>
        {/* <Button
        title='Signup'
        onPress={onPressHandle}
        /> */}
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
     container: {
        flex: 1,
        backgroundColor: '#f9e5f3',
        alignItems:'center',
        justifyContent:'center',
        marginBottom:10,
     },

     btnn:{
       alignItems:'center',
       justifyContent:'center'
     }
  })
  
  export default Home;