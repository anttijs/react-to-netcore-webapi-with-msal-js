import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import Nav from 'react-bootstrap/Nav'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import CRUDTable from './CRUDTable'
import EditDTO from './EditDTO'
import {apiMethods} from './lib/CRUDService'

function usePersistedState(key: string, defaultValue: any) {
  const [state, setState] = useState(
    () => {
      const val = localStorage.getItem(key);
      if (val) {
        return JSON.parse(val)
      }
      return defaultValue
    }
  );
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

const NavDatabase: React.FC = () => {
    const [key, setKey] = usePersistedState("SelectedEntity", "Movies")

    const x = apiMethods.map((entity,index) => 
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
    <Route exact path="/Database/:entity/:id">
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