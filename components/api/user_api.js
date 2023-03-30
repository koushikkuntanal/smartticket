import { AsyncStorage } from 'react-native';

// Function to store user data locally
const storeUserData = async (userData) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    console.log('User data saved locally');
  } catch (error) {
    console.log('Error saving user data locally: ', error);
  }
}

// Function to retrieve user data from local storage
const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (userData !== null) {
      console.log('User data retrieved successfully');
      return JSON.parse(userData);
    }
  } catch (error) {
    console.log('Error retrieving user data from local storage: ', error);
  }
}

// Example usage:
const user = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  isLoggedIn: true
}

storeUserData(user);

const retrievedUser = await getUserData();
console.log(retrievedUser);
