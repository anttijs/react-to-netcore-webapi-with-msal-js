import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import CRUDService from './lib/CRUDService'
import SchemaTool, { Schema, Prop } from './lib/SchemaTool'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'


interface EditDTOParams {
    entity: string,
    userId: string
}
interface ResponseData {
    data: any;
    schema: Schema
}
function useCRUDService(initialEntity: string, initialId: number): [ResponseData | null, React.Dispatch<React.SetStateAction<ResponseData | null>>] {
    const [responseData, setResponseData] = useState<ResponseData|null>(null)
    const [entity, setEntity] = useState<string>(initialEntity)
    const [id, setId] = useState<number>(initialId)
    if (entity !== initialEntity || id !== initialId) {
      setEntity(initialEntity)
      setId(initialId)
      console.log('update', entity, initialEntity)
    }
    else {
      console.log('no update', entity, initialEntity)
    }
    useEffect(() => {
      console.log('getting data', entity)
      CRUDService.get(entity, id).then((response: any) => {setResponseData(response.data); console.log('joo', response.data)})
    },[entity, id])
    console.log('useCRUDService',responseData)
    return [responseData, setResponseData]
  }
const EditDTO: React.FC = () => {
    const params = useParams<EditDTOParams>();
    const history = useHistory(); 
    let [responseData, setResponseData] = useCRUDService( params.entity, parseInt(params.userId)! )
    SchemaTool.schema = responseData === null ? null : responseData.schema

    function handleChange(id: string, e: React.FormEvent<HTMLInputElement>): void {
        const newValue = e.currentTarget.type === 'checkbox' ? e.currentTarget.checked : e.currentTarget.value;
        console.log('newvalue:',newValue)
        if (responseData && responseData.data) {
            const newData: ResponseData = {data: {...responseData.data}, schema: {...responseData.schema}}
            newData.data[id] = newValue
            setResponseData(newData)
        }
    }
    
    
    function renderControl(prop: Prop) {
        let retval = null;
        switch (prop.Type) {
            case 'enum':
                retval = ( 
                    <Form.Row>
                    <Form.Label column sm={2}>{SchemaTool.label(prop)}</Form.Label>
                    <Col>
                    <Form.Control as="select" 
                    value={responseData!.data[prop!.Name!]} 
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
                    label={SchemaTool.labelForCheckBox(prop)}
                    checked={responseData!.data[prop!.Name!]}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => handleChange(prop.Name, e )}
                    />
                    </Form.Row>
                )
                break;
            default:
                retval = (
                    <Form.Row>
                    <Form.Label column sm={2}>{SchemaTool.label(prop)}</Form.Label>
                    <Col>
                    <Form.Control 
                    type={prop.InputType} 
                    value={ responseData!.data![prop!.Name!] }  
                    onChange={(e: React.FormEvent<HTMLInputElement>) => handleChange(prop.Name, e )}
                    />
                    </Col>
                    </Form.Row>
                )
                break;
        }
        return retval
    }
    function renderForm() {
        const x = SchemaTool.editFields().map((prop, index) => {
            return (
            <Form.Group key={index}>
            {renderControl(prop)}
            </Form.Group>)
        })
        return (
            <Form>
                {x}
                <Form.Row>
                    <Col sm={8}></Col>
                    <Col sm={2}>
                    <Button block variant="primary" onClick={() => history.goBack()}>
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
    
    if (responseData == null)
        return (<h1>Loading...</h1>)
    return (
        <>
        <h1>{params.entity}:{params.userId}</h1>
        { renderForm() }
        </>
    )
}
export default EditDTO