import React, { useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import Nav from 'react-bootstrap/Nav'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import CRUDTable from './CRUDTable'
import EditDTO from './EditDTO'
import CRUDService from './lib/CRUDService'

const NavDatabase: React.FC = () => {
    const [key, setKey] = useState("Movies")

    const x = CRUDService.apiMethods.map((entity,index) => 
          <LinkContainer key={index} to={`/Database/${entity.Name}`} exact>
          <Nav.Link eventKey={entity.Name}>{entity.Name}</Nav.Link>
          </LinkContainer>
    )

    return (
        <>
        <hr/>
        <Nav variant="tabs" 
        activeKey={key}
        onSelect={(selectedKey: string) => setKey(selectedKey)}
        >
        {x}
        </Nav>
    <Switch>
    <Route exact path='/Database'>
        <Redirect to= {`/Database/${key}`} />
    </Route>/>
    <Route exact path="/Database/:entity">
        <CRUDTable />
    </Route>
    <Route exact path="/Database/:entity/:userId">
        <EditDTO />
    </Route>
    <Route path="*">
        <NoMatch />
    </Route> 
    </Switch>
    </>
    )
}

export default NavDatabase


function NoMatch() {
    let location = useLocation();
  
    return (
      <div>
        <h3>
          No match for <code>{location.pathname}</code>
        </h3>
      </div>
    );
  }