import { useDispatch, useSelector } from "react-redux"
import calendarApi from "../api/calendarApi"
import { onChecking, onLogin, onLogout, clearErrorMessage, onLogoutCalendar } from "../store"


export const useAuthStore = () => {

    const dispatch = useDispatch()
    const { status, user, errorMessage } = useSelector( state => state.auth )
 
    //Tarea Async - no usar thunk
    const startLogin = async ({ email, password }) =>{

        //dispatch checking
        dispatch( onChecking() )

        try {
            //llegar al backend
            const { data } = await calendarApi.post('/auth', { email, password })
            console.log({ data })

            //renovar el token
            localStorage.setItem('token', data.token )
            localStorage.setItem('token-init-date', new Date().getTime() ) 

            dispatch( onLogin({ name: data.name, uid: data.uid }) )

        } catch (error) {
            console.log({ error })
            dispatch( onLogout('Credenciales incorrectas') )

            setTimeout(() => {
                dispatch( clearErrorMessage() )
            }, 10);
        } 
    }

    const startRegister = async ({ name, email, password }) =>{

        //dispatch checking () - authenticated || no-authenticated
        dispatch( onChecking() )

        try {
            //llegar al backend
            const { data } = await calendarApi.post('/auth/new', { name, email, password })
            console.log({ data })

            localStorage.setItem('token', data.token )
            localStorage.setItem('token-init-date', new Date().getDate() )

            dispatch( onLogin({ name: data.name, uid: data.uid }) )

        } catch (error) {
            console.log({ error })
            dispatch( onLogout( error.response.data?.msg || '--' ))

            setTimeout(() => {
                dispatch( clearErrorMessage() )
            }, 10);
        }
    }


    const checkAuthToken = async () =>{
        const token = localStorage.getItem('token')

        //si no existe el token
        if( !token ) return  dispatch( onLogout() )

        try {
            const { data } = await calendarApi.get('auth/renew')

            localStorage.setItem('token', data.token )
            localStorage.setItem('token-init-date', new Date().getDate() )

            dispatch( onLogin({ name: data.name, uid: data.uid }) )
            
            
        } catch (error) {
            localStorage.clear()
            dispatch( onLogout() )
        }
  
    }

    const startLogout = () =>{
        localStorage.clear()
        dispatch( onLogoutCalendar() ) 
        dispatch( onLogout() )
    }



    return {
        //* Properties
        status,
        user,
        errorMessage,

        //* Methods
        checkAuthToken,
        startLogin,
        startLogout,
        startRegister,
    }

}
