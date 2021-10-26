import "./comments.css";

const Comments = () => {
  return (
    <div className="comment">
      <div className="user__comment">
        <img src="/assets/person/2.jpeg" alt="user" className="comment__img" />

        <span className="comment__user__name">Yasir</span>
        <span className="user__comment__text">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate,Lorem ipsum dol
          minus.
        </span>
      </div>
    </div>
  );
};

export default Comments;
