import { StyleSheet, View ,TextInput, FlatList, Text, TouchableOpacity,ScrollView} from 'react-native'
import React ,{ useState }from 'react'
import { BusPassApi, SuggestsFromApi, SuggestsOperatorApi } from './Api';
import Btn from '../components/Btn';
import { btnColor } from '../components/Constants';
import { Picker } from '@react-native-picker/picker';

export default function BusPass({route}){
    const id = route.params.EID;
    const Flag = route.params.flag;
    const [selectedOperId,setOperId] = useState('');
    const [tickettype,setTickettype] = useState([]);
    const [queryOperator, setQueryOperator] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [fareObj, setFareObj] = useState();
  const [fare,setFare]=useState('');
const [seTTtype,setSelTTtype] = useState('');
  const handleQueryChange = (text) => {
    setQueryOperator(text);
    
    fetchSuggestions(text);
  };
  const fetchSuggestions = async (text) => {
    await SuggestsOperatorApi({
        "search":text
    }).then(res=>{
        console.log('suggests data',res.data);
        setSuggestions(res.data.data);
    }).catch(err=>{
        console.log(err,'suggest err');
    })
  };
  const handleSuggestionPress = (suggestion,id) => {
    setQueryOperator(suggestion);
    setOperId(id);
    setSuggestions([]);
  };





  const [selectedFrom,setfrom] = useState('');

  const [queryFrom, setQueryFrom] = useState('');
const [suggestionsFrom, setSuggestionsFrom] = useState([]);

const handleQueryChangeFrom = (text) => {
  setQueryFrom(text);
  
  fetchSuggestionsFrom(text);
};
const fetchSuggestionsFrom = async (text) => {
  if(selectedOperId)
  {await SuggestsFromApi({                  //api
    "OperId":selectedOperId,  
    "search":text
  }).then(res=>{
      console.log('suggests From data',res.data);
      setSuggestionsFrom(res.data.data);
  }).catch(err=>{
      console.log(err,'suggest err');
  })}
  else{
    console.log('no oper id ')
  }
};
const handleSuggestionFromPress = (suggestionFrom,FromId) => {
  setQueryFrom(suggestionFrom);
  setfrom(FromId);
  setSuggestionsFrom([]);
};



const [selectedTo,setTo] = useState('');

const [queryTo, setQueryTo] = useState('');
const [suggestionsTo, setSuggestionsTo] = useState([]);

const handleQueryChangeTo = (text) => {
setQueryTo(text);

fetchSuggestionsTo(text);
};
const fetchSuggestionsTo = async (text) => {
if(selectedOperId){await SuggestsFromApi({                  //api
  "OperId":selectedOperId,  
  "search":text
}).then(res=>{
    console.log('suggests To data',res.data);
    setSuggestionsTo(res.data.data);
}).catch(err=>{
    console.log(err,'suggest err');
})}
else
{
    console.log('No oper Id')
}
};
const handleSuggestionToPress = (suggestionsTo,ToId) => {
setQueryTo(suggestionsTo);
setTo(ToId);
setSuggestionsTo([]);
};


const onPressSubmit = async () =>{
  console.log('Slected All valuse',selectedFrom,selectedTo,selectedOperId,id,Flag);
   if(!selectedFrom || !selectedTo || !selectedOperId )
   {
    alert('Please Select Operator ')
   }else{
    await BusPassApi({
        "stage1":selectedFrom,
        "stage2":selectedTo
    }).then(res=>{
        console.log('Busapaiiapi',res.data.data);
        console.log('TicketType', res.data.TicketType);
        setTickettype(res.data.TicketType);
        console.log('Fare', res.data.Fare);
        setFareObj(res.data.Fare);
    }).catch(err=>{
        console.log('busApi',err)
    })
    }
}

const getFare = (value) =>{
  console.log(value,'valse')
  setFare(fareObj[value]);
}
    return (
        
        <ScrollView style={{backgroundColor:'#ffffff'}}>
            {/* {//select oprator  }              */}
            {console.log('seled vales',selectedOperId,selectedFrom,selectedTo,seTTtype,fare)}
            <View style={styles.container}>   
        
        <View >
        <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Select Operator:</Text>
        </View>
        </View>
        <View style={styles.cardContainer}>
        <View style={styles.inputContainer}>
            <TextInput
            style={styles.input}
            value={queryOperator}
            onChangeText={handleQueryChange}
            placeholder="Type here..."
            />
        </View>
        </View>
        
      <ScrollView
  
  contentContainerStyle={styles.suggestionsContainer}
>
  {suggestions.length>0 && suggestions.map((item, index) => (
    <TouchableOpacity
      key={index.toString()}
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item.OperName,item.OperId)
    
    }
    >
      <Text style={styles.suggestionText}>{item.OperName}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>

      </View>


      {/* Set From Id */}

      <View style={styles.container}>
        
        <View >
        <View style={styles.labelContainer}>
            <Text style={styles.labelText}>From:</Text>
        </View>
        </View>
        <View style={styles.cardContainer}>
        <View style={styles.inputContainer}>
            <TextInput
            style={styles.input}
            value={queryFrom}
            onChangeText={handleQueryChangeFrom}
            placeholder="Type here..."
            />
        </View>
        </View>
        
      <ScrollView
  
  contentContainerStyle={styles.suggestionsContainer}
>
  {suggestionsFrom.length>0 && suggestionsFrom.map((item, index) => (
    <TouchableOpacity
      key={index.toString()}
      style={styles.suggestionItem}
      onPress={() => handleSuggestionFromPress(item.StageName,item.StageID)
    
    }
    >
      <Text style={styles.suggestionText}>{item.StageName}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>

      </View>

      {/* To VAluses */}



      <View style={styles.container}>
        
        <View >
        <View style={styles.labelContainer}>
            <Text style={styles.labelText}>To:</Text>
        </View>
        </View>
        <View style={styles.cardContainer}>
        <View style={styles.inputContainer}>
            <TextInput
            style={styles.input}
            value={queryTo}
            onChangeText={handleQueryChangeTo}
            placeholder="Type here..."
            />
        </View>
       
        </View>
        
      <ScrollView
  
  contentContainerStyle={styles.suggestionsContainer}
>
  {suggestionsTo.length>0 && suggestionsTo.map((item, index) => (
    <TouchableOpacity
      key={index.toString()}
      style={styles.suggestionItem}
      onPress={() => handleSuggestionToPress(item.StageName,item.StageID)
    
    }
    >
      <Text style={styles.suggestionText}>{item.StageName}</Text>
    </TouchableOpacity>
  ))}

{/* {tickettype.length>0 && tickettype.map((item, index) => (
   <View key={index.toString()} style={styles.inputContainer}>
     <TouchableOpacity
      key={index.toString()}
      style={styles.suggestionItem}
      onPress={() => handleSuggestionToPress(item.TTname,item.TTshortname)
    
    }
    >
      <Text style={styles.suggestionText}>{item.TTname}</Text>
    </TouchableOpacity>
   </View>
  )
  )} */}


</ScrollView>

      </View>

     {tickettype.length == 0 && <TouchableOpacity onPress={onPressSubmit} style={styles.button} >
        <Text style={styles.buttonText}>Submit</Text>
        
      </TouchableOpacity>}
    {tickettype.length>0 && <View style={styles.container}>
    <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Ticket Type:</Text>
        </View>
      <View style={{borderWidth:1,borderColor: '#DDDDDD',borderRadius:8}}>
      <Picker
                
                selectedValue={seTTtype}
                onValueChange={ (value ) => {
                 setSelTTtype(value);
                  getFare(value);
                }}
                mode="dropdown" // Android only
                style={styles.picker}
              >
                {tickettype.length > 0 && tickettype.map((item, index) => {
                   {
                    return (
                    <Picker.Item
                      style={styles.pickerItem}
                      key={index}
                      label={item.TTname}
                      value={item.TTshortname}
                    />);
                  }
                })
                  
                  }
              </Picker>
      </View>
     </View> }
                 {fare && <View style={[styles.container,{flexDirection:'row',justifyContent:'center'}]}>
                  <View >
        <View style={styles.labelContainer}>
            <Text style={[styles.labelText,{fontSize:18,fontWeight:'normal'}]}>Fare: {'\u20B9'}{fare}</Text>
        </View>
        </View>
        <View >
       
       
        </View>
                  </View>}
                  {fare && <TouchableOpacity style={styles.button} >
        <Text style={styles.buttonText}>Proceed</Text>
        
      </TouchableOpacity>}

        </ScrollView>
  
    );
  
}
const styles = StyleSheet.create({

    body: {
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
    },
    button: {
        backgroundColor: btnColor,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        marginBottom:15,
        marginTop:35,
        marginRight:15,
        marginLeft: 15
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        
        marginTop:20,
        
        
      },
      selectOperatorText: {
        marginRight: 8,
        fontSize: 16,
        color: 'black',
        marginBottom:10
      },
      containerSuggestions: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
      },
      label: {
        marginRight: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
      },
      input: {
        flex: 1,
        fontSize: 16,
        color: 'black',
      },
      label:{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
      },
     
      suggestionsList: {
        maxHeight: 120,
      },
      suggestionItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
      },
      suggestionText: {
        fontSize: 16,
      },
      cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDDDDD',
      },
      labelContainer: {
        marginRight: 16,
        marginBottom:10
      },
      labelText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
      },
      inputContainer: {
        flex: 1,
      },
      input: {
        fontSize: 16,
        color: '#333333',
      },
      picker: {
        alignSelf: 'center',
        width: "100%",
        borderWidth:0.5
      },
      pickerItem: {
        width: 40,
        // height:40,
        fontSize: 14,
        borderWidth:0.5
      },
});