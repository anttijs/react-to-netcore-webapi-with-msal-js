import React, {useState} from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

interface MyModalProps {
    onOK: () => void;
    onCancel: () => void;
    show: boolean;
    title: string;
    message: string;
}
const MyModal: React.FC<MyModalProps> = (props) => {
    const [show, setShow] = useState(props.show);
    if (props.show !== show)
        setShow(props.show)


    const onCancel = () => {
        setShow(false)
        props.onCancel()
    }
    const onOK = () => {
        setShow(false)
        props.onOK()
    }
    return (
        <Modal show={show}>
        <Modal.Header>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onOK}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    )
}
export default MyModal