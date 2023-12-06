import "../styleSheets/Category.css"


const Category = ({name, image, onClick}) => {
    return (
        <div className="category-main" onClick={onClick}>
            <img src={image}/>
            <p>{name}</p>
        </div>
    )
}

export default Category