import React, {useState} from 'react'
import ReactDOM from "react-dom";

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'


export const messageBox = async (title: string, message: string, OKButtonTitle: string = "OK") => {
return new Promise<void>((resolve, reject) => {
  try {
    let show=true
    const handleOK = () => {
      show=false
      removeModal()
      resolve();
    }
    const handleCancel = () => {
      show=false
      removeModal()
      reject(new Error("Modal cancelled"))
    }
    const removeModal = () => {
      const div = document.getElementById("getValue-container");
      const body = document.getElementsByTagName("body")[0];
      if (body && div)
        body.removeChild(div);
    }

    const body = document.getElementsByTagName("body")[0];
    const div = document.createElement("div");
    div.setAttribute("id", "getValue-container");
    body.appendChild(div);
    ReactDOM.render(
      <MyModal onOK={handleOK} onCancel={handleCancel} show={show} title={title} message={message} OKButtonTitle={OKButtonTitle} />,
      div
    );
  }
  catch(e) {
    reject(new Error(e.message))
  }
});
}


interface MyModalProps {
    onOK: () => void;
    onCancel: () => void;
    show: boolean;
    title: string;
    message: string;
    OKButtonTitle: string;
}
const MyModal: React.FC<MyModalProps> = (props) => {
    const [show, setShow] = useState(props.show);
    const [forceHide, setForceHide] = useState(false)
    if (props.show !== show && forceHide===false) {
        setShow(props.show)
        setForceHide(true)
    }
    const onCancel = () => {
        setForceHide(true)
        setShow(false)
        props.onCancel()
    }
    const onOK = () => {
        setForceHide(true)
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
            {props.OKButtonTitle}
          </Button>
        </Modal.Footer>
      </Modal>
    )
}
export default MyModal