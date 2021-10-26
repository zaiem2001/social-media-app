import { Modal, Button } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";

function MyVerticallyCenteredModal(props) {
  const { followers, loading } = props;

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{
        backdropFilter: "blur(2px)",
      }}
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Followers</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "350px", overflowY: "auto" }}>
        {loading && <Loader size="50px" />}
        <ul className="modal__followes">
          {followers?.length === 0 ? (
            <Message variant="info">No Followers</Message>
          ) : (
            followers?.map((f) => (
              <li
                key={f?._id || new Date().getMilliseconds()}
                style={{
                  margin: "13px 0",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "15px",
                  }}
                  src={f?.profilePicture || "/assets/person/noAvatar.png"}
                  alt="user"
                />
                <span style={{ fontSize: "18px", fontWeight: "500" }}>
                  {f?.username.toUpperCase() || "Deleted Acc"}
                </span>
              </li>
            ))
          )}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MyVerticallyCenteredModal;
