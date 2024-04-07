import React from 'react';
import { Appbar } from 'react-native-paper';

type HeaderComponentProps = {
  title: string;
  onButtonPress: () => void;
};

const HeaderComponent: React.FC<HeaderComponentProps> = ({ title, onButtonPress }) => {
  return (
    <Appbar.Header>
      <Appbar.Action icon="menu" onPress={onButtonPress} />
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

export default HeaderComponent;