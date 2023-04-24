import { Navigate } from "react-router-dom"
import axios from 'axios';
import { useEffect, useState } from 'react';
export default function PrivateRouter(props) {
    const [userServer, setUser] = useState()
    var userLocal = null
    const userLocalCall = localStorage.getItem("user")
    userLocal = JSON.parse(userLocalCall)
    useEffect(() => {  
            var config = {
                method: 'get',
                url: 'https://backoffice.nodemy.vn/api/users/me',
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTY4MDUzMTAzOSwiZXhwIjoxNjgzMTIzMDM5fQ.lcH4AeJQYKRj3Eg5aEGO6emWtQ7KCkKDbVRJeAB3L4I'
                }
            };
            axios(config)
                .then(function (response) {
                    // console.log(JSON.stringify(response.data));
                    // setUser(response.data)
                    return props.children
                })
                .catch(function (error) {
                    console.log(error);
                });
        
    }, [])
    
    return userLocal? props.children : <Navigate to="/login" />
}
