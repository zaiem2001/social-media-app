import { Button, Modal } from "react-bootstrap";

function Example({ error, show, setShow, handleClose, handleShow, value }) {
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Invalid Input</Modal.Title>
        </Modal.Header>
        <Modal.Body>{`No User Found ▶ ${value}`}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Understood
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Example;
