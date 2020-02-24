import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

import {useGet, putDTO, postDTO, getSingleName} from './lib/CRUDService'
import { SchemaTool, Prop } from './lib/SchemaTool'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'

import cogoToast from 'cogo-toast';
import { isEqual,cloneDeep } from 'lodash'

interface EditDTOParams {
    entity: string,
    id: string
}


const EditDTO: React.FC = () => {
    const params = useParams<EditDTOParams>();
    const Id = params.id==="New" ? -1 : parseInt(params.id)
    const history = useHistory(); 
    let [{data, schema, isLoading, isError, errorText}, updateGet] = useGet( params.entity, Id )
    const schemaTool = schema === null ? null : new SchemaTool(schema!)
    console.log('ddd', schemaTool, schema)
    
    
    const handleChange = (id: string, e: React.FormEvent<HTMLInputElement>): void => {
        const prop: Prop | undefined = schemaTool?.schema?.Props.find(x => x.Name === id)
        if (!prop) {
            return
        }
        const newValue = e.currentTarget.type === 'checkbox' ? e.currentTarget.checked : schemaTool?.strToValue(prop, e.currentTarget.value);
        console.log('newvalue:',newValue)
        if (data) {
            data[id] = newValue
            updateGet(data)
        }
    }
    const handleUpdateOrAdd = () => {
        if (Id === -1) {
            handleAdd()
        }
        else {
            handleUpdate()
        }
    }

    const handleUpdate = () => {
        if (!data) {
            history.goBack()
            return
        }
        console.log('updating', data.Name)
        putDTO(params.entity, data)
        .then(() => {
            console.log("OK")
            const { hide } = cogoToast.info(
            <div>
            <b>Update successful</b>
            <div>
                {`Updated info for ${getSingleName(params.entity)} ${data.Name}`}
            </div>
            </div>,
            {hideAfter: 5, onClick: () =>  hide!()} )
        })
        .catch((error: Error) => {
            console.log(error)
            const { hide } = cogoToast.error(
            <div>
            <b>Update failed</b>
            <div>
                {`Failed to update info for ${getSingleName(params.entity!)} ${data.Name}.`} 
                <br/>
                {error.message}
            </div>
            </div>,
            {hideAfter: 5, onClick: () =>  hide!()} )
        })
        .finally(() => {
            history.goBack()
        })
    }
    const handleAdd = () => {
        if (!data) {
            history.goBack()
            return
        }
        postDTO(params.entity, data)
        .then(() => {
            const { hide } = cogoToast.info(
            <div>
            <b>Add successful</b>
            <div>
                {`Added info for ${getSingleName(params.entity)} ${data.Name}`}
            </div>
            </div>,
            {hideAfter: 5, onClick: () =>  hide!()} )
        })
        .catch((error) => {
            const { hide } = cogoToast.error(
            <div>
            <b>Add failed</b>
            <div>
                {`Failed to add info for ${getSingleName(params.entity!)} ${data.Name}.`} 
                <br/>
                {errorText}
            </div>
            </div>,
            {hideAfter: 5, onClick: () =>  hide!()} )
        })
        .finally(() => {
            history.goBack()
        })
    }
    const renderControl = (prop: Prop) => {
        let retval = null;
        if (schemaTool===null) {
            return null
        }
        switch (prop.Type) {
            case 'enum':
                retval = ( 
                    <Form.Row>
                    <Form.Label column sm={2}>{schemaTool.label(prop)}</Form.Label>
                    <Col>
                    <Form.Control 
                    as="select" 
                    value={data[prop!.Name!]} 
                    onChange={(e: React.FormEvent<HTMLInputElement>) => handleChange(prop.Name, e )}
                    >
                    { prop.PropEnums.map((enumDesc, index) =>
                    <option key={index} value={enumDesc.value}>{enumDesc.text}</option>)
                    }
                    </Form.Control>
                    </Col>
                    </Form.Row>
                )
                break;
        
            case 'bool':
                retval = ( 
                    <Form.Row>
                        <Col sm={2}/>
                    <Form.Check 
                    type="checkbox"
                    label={schemaTool.labelForCheckBox(prop)}
                    checked={data[prop!.Name!]}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => handleChange(prop.Name, e )}
                    />
                    </Form.Row>
                )
                break;
            default:
                retval = (
                    <Form.Row>
                    <Form.Label column sm={2}>{schemaTool.label(prop)}</Form.Label>
                    <Col>
                    <Form.Control 
                    type={prop.InputType} 
                    value={ data![prop!.Name!] }  
                    onChange={(e: React.FormEvent<HTMLInputElement>) => handleChange(prop.Name, e )}
                    />
                    </Col>
                    </Form.Row>
                )
                break;
        }
        return retval
    }
    const renderTitle = () => {
        if (Id === -1) {
            return ( <> <p/><h4>{`Add new ${getSingleName(params.entity)}`}</h4></>)
        }
        else {
            return (<> <p/><h4>{`Edit ${getSingleName(params.entity)} details`}</h4></>)
        }
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
    
    const renderForm = () => {
        if (schemaTool===null) {
            return null
        }
        const x = schemaTool.editFields().map((prop, index) => {
            return (
            <Form.Group key={index}>
                {renderControl(prop)}
            </Form.Group>
            )
        })
        return (
            <Form>
                {x}
                <Form.Row>
                    <Col sm={8}></Col>
                    <Col sm={2}>
                    <Button block variant="primary" onClick={handleUpdateOrAdd}>
                        OK
                    </Button>
                    </Col>
                    <Col sm={2}>
                    <Button block variant="light" onClick={() => history.goBack()}>
                        Cancel
                    </Button>
                    </Col>
                </Form.Row>
            </Form>
        )
    }
    return (
        <>
            {renderTitle()}
            { isError && renderError() }
            { isLoading ? (<><Spinner animation="border" variant="info" size="sm"/> <span>Loading</span></>)  
            : (renderForm())  }
        </>
    )
}
export default EditDTO