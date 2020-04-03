import React from 'react'
import {LinkContainer, IndexLinkContainer} from 'react-router-bootstrap'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import {About} from './About'
import NavDatabase from './NavDatabase'
import {LoginButton} from './LoginButton'
const NavMain = () => (
    <>
    <Navbar bg="primary" variant="dark" sticky="top">
    <Nav className="mr-auto">
        <IndexLinkContainer to="/">
        <Nav.Link>Home</Nav.Link>
        </IndexLinkContainer>
        <LinkContainer to="/Database">
        <Nav.Link>Database</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/About">
        <Nav.Link>About</Nav.Link>
        </LinkContainer>
    </Nav>
    <Form inline>
      <LoginButton />
    </Form>
  </Navbar>
  <Switch>
  <Route exact path='/'>
    <Home/>
  </Route>
  <Route path='/Database'>
    <NavDatabase/>
  </Route>
  <Route path='/About'>
    <About/>
  </Route>
  </Switch>
  </>
)

export default NavMain