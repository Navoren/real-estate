/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"


function PrivateRoute() {
    const { currentUser } = useSelector((state: any) => state.user)
    return (
        currentUser ? <Outlet /> : <Navigate to='/sign-in' />
    )
}

export default PrivateRoute