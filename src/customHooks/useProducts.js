import { useEffect, useState } from "react"



const useProducts = (sorter, sorterValue) => {
    const [products, setProducts] = useState([])

    useEffect(()=> {
        console.log({sorter, sorterValue})
        try {
            fetch(`http://localhost:8000/api/get_products?sorter=${sorter}&sorter_value=${sorterValue}`, {
                method: "GET"
            })
            .then(response => response.json())
            .then(res => {
                setProducts(res)
            })
        } catch (error) {
            console.log(error)
        }
    }, [sorter, sorterValue])

    return products
}

export default useProducts