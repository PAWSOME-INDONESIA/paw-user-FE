import React from 'react';
import { Container, CheckBox, ListItem, Body, Content, View, Button, Icon, Fab, Text, Header } from 'native-base';

const SettingsScreen = () => {
  const [active, setActive] = React.useState(false)
  const [currentLang, setCurrentLang] = React.useState('en')

  const changeUserLang = lang => {
    global.userLang = lang
    setCurrentLang(lang)
  }
  return (
    <Container>
      <View style={{ flex: 1 }}>
        <Content>
          <Header>
            <Body>
              <Text>
                Choose Language / Pilih Bahasa
              </Text>
            </Body>
          </Header>
          <ListItem>
            <CheckBox checked={currentLang === 'en'} onPress={() => changeUserLang('en')}/>
            <Body>
              <Text>English</Text>
            </Body>
            <CheckBox checked={currentLang === 'id'} onPress={() => changeUserLang('id')}/>
            <Body>
              <Text>Indonesia</Text>
            </Body>
          </ListItem>
        </Content>
        <Fab
          active={active}
          direction="up"
          containerStyle={{ }}
          style={{ backgroundColor: '#5067FF' }}
          position="bottomRight"
          onPress={() => setActive(!active)}>
          <Icon name="share" />
          <Button style={{ backgroundColor: '#34A34F' }}>
            <Icon name="logo-whatsapp" />
          </Button>
          <Button style={{ backgroundColor: '#3B5998' }}>
            <Icon name="logo-facebook" />
          </Button>
          <Button disabled style={{ backgroundColor: '#DD5144' }}>
            <Icon name="mail" />
          </Button>
        </Fab>
      </View>
    </Container>
  );
};
export default SettingsScreen;
