import "./DeleteModel.css"

const DeleteModal =({onDelete, onClose,message,type}) =>{

    return(

    <div className="confirm_delete">
        <h2>Confirm Delete</h2>
        <p>{message}</p>

        <button className="red_button" onClick={onDelete}>Yes (Delete {type})</button>
        <button className="dark_grey_button" onClick={onClose}>No (Keep {type})</button>
    </div>
    )

}

export default DeleteModal;