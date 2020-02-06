import React from 'react'
import {LinkContainer, IndexLinkContainer} from 'react-router-bootstrap'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import Game from './Game'
import NavDatabase from './NavDatabase'

const NavMain = () => (
    <>
    <Navbar bg="primary" variant="dark" sticky="top">
    <Navbar.Brand href="">Navbar</Navbar.Brand>    
    <Nav className="mr-auto">
        <IndexLinkContainer to="/">
        <Nav.Link>Home</Nav.Link>
        </IndexLinkContainer>
        <LinkContainer to="/Game">
        <Nav.Link>Game</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/Database">
        <Nav.Link>Database</Nav.Link>
        </LinkContainer>
    </Nav>
    <Form inline>
      <FormControl type="text" placeholder="Search" className="mr-sm-2" />
      <Button variant="outline-light">Search</Button>
    </Form>
  </Navbar>
  <Switch>
  <Route exact path='/'>
    <Home/>
  </Route>
  <Route exact path='/Game'>
    <Game/>
  </Route>
  <Route path='/Database'>
    <NavDatabase/>
  </Route>
  </Switch>
  </>
)

export default NavMain