import { View } from '@/components/Themed';
import AuthenticationScreen from '@/components/AuthenticationScreen';
import HeaderComponent from '@/components/HeaderComponent';

export default function Main() {
  return (
    <View>
      <HeaderComponent title={'Meau App'} onButtonPress={function (): void {
        throw new Error('Function not implemented.');
      } }></HeaderComponent>
      <AuthenticationScreen></AuthenticationScreen>
    </View>
  );
}
