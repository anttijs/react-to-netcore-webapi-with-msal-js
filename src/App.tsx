import React from 'react';
import NavMain from './NavMain'
import Container from 'react-bootstrap/Container'
import {UserContext} from './UserContext'
const App = () => (
  <Container fluid className="App-header">
    <UserContext.Provider value = {{ name: "Antti" }}>        
      <NavMain />
    </UserContext.Provider>
  </Container>
)

export default App;
