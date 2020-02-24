import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Tooltip from 'react-bootstrap/Tooltip'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useParams, useLocation } from 'react-router-dom'
import { removeDTO, getSingleName, useGetList } from './lib/CRUDService'
import { SchemaTool, Schema } from './lib/SchemaTool'
import LinkButton, {Ref} from './LinkButton'
import { messageBox } from './MyModal'
import cogoToast from 'cogo-toast';
import { authProvider } from './lib/authProvider';
import {  AuthenticationState } from "react-aad-msal";

interface CRUDRowProps {
    data: any,
    onRefresh: () => void
}

const CRUDRow: React.FC<CRUDRowProps> = (props) => {
  const ref = React.createRef<Ref>()
  const location = useLocation()
  const {entity} = useParams()
  
  const renderTooltip = (text: string) => {
    return (<Tooltip id={text}>{text}</Tooltip>)
  }

  const handleDeleteLinkClick = async () => {

    try  {
      const isAuthenticated =  authProvider.authenticationState === AuthenticationState.Authenticated;
      if (!isAuthenticated) {
        await messageBox("Sign in", "You need to be signed in to perform this operation. Sign in now?", "Sign in")
        await authProvider.login()
      }
      const title=`Delete ${getSingleName(entity!)}`
      const message=`Delete ${getSingleName(entity!)} ${props.data.Name}?`
      const OKButtonTitle="Delete"
      await messageBox(title,message,OKButtonTitle)
      await DeleteAsync()
    }
    catch(e) {
      console.log("delete cancelled",e.message)
    }
    
    
  }

  const DeleteAsync = async () => {
    try {
      const token = await authProvider.getAccessToken()
      console.log('token',token)
      await removeDTO(entity!, props.data.Id, token.accessToken)
      props.onRefresh()
      const { hide } = cogoToast.info(
        <div>
          <b>Delete successful</b>
          <div>
            {`Deleted info for ${getSingleName(entity!)} ${props.data.Name}`}
          </div>
        </div>,
        {hideAfter: 5, onClick: () =>  hide!()} )
    }
    catch(e) {
      const { hide } = cogoToast.error(
      <div>
        <b>Delete failed</b>
        <div>
          {`Failed to delete info for ${getSingleName(entity!)} ${props.data.Name}.`} 
          <br/>
          {e.message}
        </div>
      </div>,
      {hideAfter: 500, onClick: () =>  hide!()} )
      }
  }

  const dataCols =
      Object.keys(props.data).map( (key, index) => {
        let val = props.data[key]
        if (typeof val === 'object' || Array.isArray(val)) {
            return null
        }
        if (typeof val === 'string' && val.length > 30) {
          val = val.slice(0,30)
        }
        return <td key={index}>{val}</td> 
        }
      )

  
  return (
        <tr>
          <td style= {{width: '80px', whiteSpace: 'nowrap'}}>
            
            <OverlayTrigger
            key={1}
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip(`Edit ${props.data.Name}`)}
            >
            <Link to = {`${location.pathname}/${props.data.Id}`}>
            <i><FontAwesomeIcon icon="edit" /></i>
            </Link>
            </OverlayTrigger>
            
            &nbsp;&nbsp;
            <LinkButton ref={ref} text="" onClick={handleDeleteLinkClick}>
              <OverlayTrigger
                key={3}
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip(`Delete ${props.data.Name}`)}
              >
                <i><FontAwesomeIcon icon="trash" /></i>
              </OverlayTrigger>
            </LinkButton>
          </td>
        {dataCols}
        </tr>
    )
}

interface CRUDHeaderProps {
    schema: Schema;
}
const CRUDHeader: React.FC<CRUDHeaderProps> = (props) => {
    if (!props.schema)
      return null
    
    const schemaTool = new SchemaTool(props.schema)
    return (
      <thead>
      <tr>
        <th></th>
        
      {props.schema.Props.map( (key, index) => {
        return <th key={index}>{schemaTool.label(key)}</th> 
        }
        )}
      </tr>
      </thead>
    )
}


const CRUDTable: React.FC = () => {
  const { entity } = useParams()  
  const [ {data, schema, isLoading, isError, errorText}, refresh, setRefresh ] = useGetList( entity! )
  const location = useLocation()
  console.log('dd',schema)
  
  const renderTooltip = (text: string) => {
    return (<Tooltip id={text}>{text}</Tooltip>)
  }
  
  const onRefresh = () => {
    setRefresh(refresh ? false : true)
  }
  const renderError = () =>
  {
    return (
      <Alert variant="danger">
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        {errorText}
      </Alert>
    )
  }
  return (
    <Container fluid>
      <p />
      <Row>
      <Col>
      <OverlayTrigger
      key={2}
      placement="right"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip(`Add new ${getSingleName(entity!)}`)}
      >
      <Link to = {`${location.pathname}/New`}>
        <i><FontAwesomeIcon icon="plus" /> </i>Add
      </Link>
      </OverlayTrigger>
      </Col>
       <Col><h2>{entity}</h2></Col>
       <Col></Col>
      </Row>
      { isError && renderError() }
      { isLoading ? (<><Spinner animation="border" variant="info" size="sm"/> <span>Loading</span></>) 
      : 
      (
        <Table>
        <CRUDHeader schema={schema!}></CRUDHeader>
        <tbody>
        {data.map((obj, index) => 
        <CRUDRow key= {index} data={obj} onRefresh={onRefresh} />
        )}
        </tbody>
        </Table>) 
       }
    </Container>
    )
}

export default CRUDTable