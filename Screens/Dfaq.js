
import { View, Text, TouchableOpacity, Animated ,StyleSheet} from 'react-native';
import React, { useState } from 'react';

import Accordion from 'react-native-collapsible/Accordion';

const Dfaq = () => {
  return (
    <View style={styles.container}>
      <Accordion
        header={
          <View style={styles.header}>
            <Text style={styles.title}>Accordion 1</Text>
          </View>
        }
        content={
          <View style={styles.content}>
            <Text>Content for accordion 1</Text>
          </View>
        }
        // other properties to customize the style and behavior of the accordion
      />
      <Accordion
        header={
          <View style={styles.header}>
            <Text style={styles.title}>Accordion 2</Text>
          </View>
        }
        content={
          <View style={styles.content}>
            <Text>Content for accordion 2</Text>
          </View>
        }
        // other properties to customize the style and behavior of the accordion
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 10,
    backgroundColor: '#fff',
  },
});


export default Dfaq;