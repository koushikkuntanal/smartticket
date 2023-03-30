import React from 'react';
import {TextInput} from 'react-native';
import {background, darkPink} from './Constants';

const Field = props => {
  return (
    
    <TextInput
      {...props}
      style={{borderRadius: 100, color:'black', paddingHorizontal: 10,height:40 ,fontSize:12 }}
      placeholderTextColor='black' ></TextInput>
  );
};

export default Field;