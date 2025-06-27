import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToStorage = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log(`Error saving ${key}:`, error);
  }
};

export const loadFromStorage = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.log(`Error loading ${key}: `, error);
    return [];
  }
};
