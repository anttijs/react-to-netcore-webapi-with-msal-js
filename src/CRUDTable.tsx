import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useParams, useLocation } from 'react-router-dom'
import CRUDService from './lib/CRUDService'
import SchemaTool, { Schema, Prop } from './lib/SchemaTool'
import LinkButton, {Ref} from './LinkButton'
import MyModal from './MyModal'
import cogoToast from 'cogo-toast';

interface CRUDRowProps {
    data: any,
    onRefresh: () => void
}

const CRUDRow: React.FC<CRUDRowProps> = (props) => {
  const [show, setShow] = useState<boolean>(false)
  const ref = React.createRef<Ref>()
  const location = useLocation()
  const {entity} = useParams()
  
  const renderTooltip = (text: string) => {
    return (<Tooltip id={text}>{text}</Tooltip>)
  }

  const handleDeleteLinkClick = () => {
    setShow(true)
  }

  const onDelete = () => {
    setShow(false)
    CRUDService.delete(entity!, props.data.Id)
    .then(() => {
      props.onRefresh()
      const { hide } = cogoToast.info(
      <div>
        <b>Delete successful</b>
        <div>
          {`Deleted info for ${CRUDService.getSingleName(entity!)} ${props.data.Name}`}
        </div>
      </div>,
      {hideAfter: 5, onClick: () =>  hide!()} )
    })
    .catch((error) => {
      const { hide } = cogoToast.error(
      <div>
        <b>Delete failed</b>
        <div>
          {`Failed to delete info for ${CRUDService.getSingleName(entity!)} ${props.data.Name}.`} 
          <br/>
          {CRUDService.getErrorText(error)}
        </div>
      </div>,
      {hideAfter: 5, onClick: () =>  hide!()} )
      })
  }

  const onDeleteCancel = () => {
    setShow(false)
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

            <MyModal onOK={onDelete} 
              onCancel={onDeleteCancel} 
              show={show} 
              title={ `Delete ${CRUDService.getSingleName(entity!)} `} 
              message={ `Delete ${CRUDService.getSingleName(entity!)} ${props.data.Name}?`}
            />
          </td>
        {dataCols}
        </tr>
    )
}

interface CRUDHeaderProps {
    data: any
}
const CRUDHeader: React.FC<CRUDHeaderProps> = (props) => {
    if (!props.data)
      return null
    return (
      <thead>
      <tr>
        <th></th>
      {Object.keys(props.data).map( (key, index) => {
        let val = props.data[key]
        if (typeof val === 'object' || Array.isArray(val)) {
            return null
        }
        return <th key={index}>{key}</th> 
        }
        )}
      </tr>
      </thead>
    )
}

function useCRUDService(initialEntity: string): [any[], boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [schema, setSchema] = useState<Schema>()
  const [data, setData] = useState([])
  const [entity, setEntity] = useState<string>(initialEntity)
  const [refresh, setRefresh] = useState<boolean>(false)
  if (entity !== initialEntity) {
    setEntity(initialEntity)
    console.log('update', entity, initialEntity)
  }
  else {
    console.log('no update', entity, initialEntity)
  }
  useEffect(() => {
    console.log('getting data', entity)
    CRUDService.getList(entity).then(response => {
      setData(response.data.data)
      const s = response.Schema as Schema
      setSchema(s)
    })
  },[entity, refresh])
  return [data, refresh, setRefresh]
}

const CRUDTable: React.FC = () => {
  const { entity } = useParams()  
  const [ data,refresh,setRefresh ] = useCRUDService( entity! )
  console.log(data)
  const location = useLocation()
  
  const renderTooltip = (text: string) => {
    return (<Tooltip id={text}>{text}</Tooltip>)
  }
  
  const onRefresh = () => {
    setRefresh(refresh ? false : true)
  }
  
  return (
    <Container fluid>
      <OverlayTrigger
      key={2}
      placement="right"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip(`Add new ${CRUDService.getSingleName(entity!)}`)}
      >
      <Link to = {`${location.pathname}/New`}>
        <i><FontAwesomeIcon icon="plus" /> </i>Add
      </Link>
      </OverlayTrigger>
      
      <Table>
        <CRUDHeader data={data[0]}></CRUDHeader>
      <tbody>
        {data.map((obj, index) => 
        <CRUDRow key= {index} data={obj} onRefresh={onRefresh} />
        )}
      </tbody>
      </Table>
    </Container>
    )
}

export default CRUDTable