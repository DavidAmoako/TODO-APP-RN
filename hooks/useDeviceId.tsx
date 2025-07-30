import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import * as Crypto from 'expo-crypto';
import * as Device from 'expo-device';
import { useEffect, useState } from 'react';

/**
 * Device ID Hook
 * Generates and manages a unique device identifier for user data isolation
 * Combines device info with a generated UUID for uniqueness and persistence
 */
const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateOrRetrieveDeviceId();
  }, []);

  /**
   * Generate or retrieve existing device ID
   * Creates a persistent unique identifier for the device
   */
  const generateOrRetrieveDeviceId = async () => {
    try {
      // First, check if we already have a stored device ID
      const storedDeviceId = await AsyncStorage.getItem('device_id');
      
      if (storedDeviceId) {
        setDeviceId(storedDeviceId);
        setIsLoading(false);
        return;
      }

      // Generate a new unique device ID combining multiple device identifiers
      const deviceInfo = {
        // Device model and brand
        deviceName: Device.deviceName || 'Unknown',
        brand: Device.brand || 'Unknown',
        modelName: Device.modelName || 'Unknown',
        
        // Application info
        applicationId: Application.applicationId || 'Unknown',
        
        // Generate a random UUID for additional uniqueness
        uuid: Crypto.randomUUID(),
        
        // Timestamp for when the ID was created
        createdAt: Date.now(),
      };

      // Create a hash from the device info for the unique ID
      const deviceString = JSON.stringify(deviceInfo);
      const hashedId = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        deviceString
      );

      // Create a shorter, more manageable ID (first 32 characters of hash)
      const shortDeviceId = `device_${hashedId.substring(0, 32)}`;

      // Store the device ID for future use
      await AsyncStorage.setItem('device_id', shortDeviceId);
      
      // Also store the full device info for debugging purposes
      await AsyncStorage.setItem('device_info', JSON.stringify(deviceInfo));
      
      setDeviceId(shortDeviceId);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error generating device ID:', error);
      
      // Fallback: generate a simple random ID if everything else fails
      const fallbackId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem('device_id', fallbackId);
      setDeviceId(fallbackId);
      setIsLoading(false);
    }
  };

  /**
   * Reset device ID (useful for testing or if user wants to start fresh)
   */
  const resetDeviceId = async () => {
    try {
      await AsyncStorage.removeItem('device_id');
      await AsyncStorage.removeItem('device_info');
      setDeviceId(null);
      setIsLoading(true);
      await generateOrRetrieveDeviceId();
    } catch (error) {
      console.error('Error resetting device ID:', error);
    }
  };

  return {
    deviceId,
    isLoading,
    resetDeviceId,
  };
};

export default useDeviceId;