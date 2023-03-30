import React, { useState ,useEffect} from 'react';
import { View, Text ,StyleSheet} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';
import { Faq } from './Api';

const FAQ = () => {

   const [faqdata,setFaqData]  = useState([]);
  useEffect (() => {

     Faq().then(res=>{console.log(res.data.data)
      setFaqData(res.data.data)
    });
    
  },[]);
  const [activeSection, setActiveSection] = useState([]);

 

  const SECTIONS = [
    {
        
      title: 'What is Expo?',
      content: 'Expo is a development platform for building mobile applications using JavaScript and React.'
    },

    
    
    {
      title: 'How do I get started with Expo?',
      content: 'You can get started with Expo by installing the Expo CLI and creating a new project using the "expo init" command.'
    },
    {
      title: 'Can I use Expo for production apps?',
      content: 'Yes, Expo is suitable for production apps and is used by many companies and developers to build high-quality mobile apps.'
    }
  ];

  
  

  const renderHeader = (faqdata, _, isActive) => {
    return (
      <View style={styles.Header}>
        
        <TouchableOpacity style={styles.touch}>
        <Text style={styles.title}>{faqdata.question}</Text>
        <AntDesign name="down" size={18} color="black" />
        </TouchableOpacity>
        
      </View>
    );
  };

  

  const renderContent = (faqdata, _, isActive) => {
    return (
      <View style={{ backgroundColor: '#fff' }}>
        <Text style={styles.answer}>{faqdata.answer}</Text>
      </View>
    );
  };

  

  const updateSections = activeSections => {
    setActiveSection(activeSections);
  };

  

  

  return (
    
    <View style={styles.container}>
    {console.log('return',faqdata)}
      <View style={styles.container1}>
        
       <Text style={styles.text}>About Expo</Text>
    <Accordion
      sections={faqdata}
      activeSections={activeSection}
      
      renderHeader={renderHeader}
      
      renderContent={renderContent}
      onChange={updateSections}
    />
    </View>
    
</View>


   
    
    
    
    
    
   
  );
  
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:30,
        textAlign:'center',
        alignItems:'center',
        marginBottom:15
        //justifyContent:'center'
    },

    container1:{
      width:325,
      marginBottom:20
    },
   

    text:{
       alignSelf:'flex-start',
       fontSize:15,
      fontWeight:'bold',
      padding:10,
    },

    parent:{
       flex:1,
       padding:30,
       textAlign:'center',
       alignItems:'center',
       backgroundColor:'#F5FCFF',
       
       width:320,
       marginBottom:400
    },

    text1:{
       alignSelf:'flex-start',
       fontSize:18,
       fontWeight:'bold',
       padding:10,
       paddingLeft:3

    },

    Header:{
        padding:10,
        backgroundColor:'#F5FCFF',

    },

    title:{
       fontSize:16, 
    },

    touch:{
      flexDirection:'row',
      justifyContent:'space-between'

    },

    answer:{
      paddingLeft:15
    }

    
})

export default FAQ;
