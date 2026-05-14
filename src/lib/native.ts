import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Device } from '@capacitor/device';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export const isNative = Capacitor.isNativePlatform();

export async function triggerHaptic(style: ImpactStyle = ImpactStyle.Medium) {
  if (isNative) {
    try {
      await Haptics.impact({ style });
    } catch (e) {
      console.warn('Haptics not available', e);
    }
  }
}

export async function getDeviceInfo() {
  return await Device.getInfo();
}

export async function requestPushPermission() {
  if (isNative) {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  }
}

// Add more native wrappers as needed
