import { useEffect, useState } from "react"



const useProducts = () => {
    const [products, setProducts] = useState([])

    useEffect(()=> {
        try {
            fetch("http://localhost:8000/api/get_products", {
                method: "GET"
            })
            .then(response => response.json())
            .then(res => {
                setProducts(res)
            })
        } catch (error) {
            console.log(error)
        }
    }, [])

    return products
}

export default useProducts