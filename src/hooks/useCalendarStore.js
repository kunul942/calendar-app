import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2"
import calendarApi from "../api/calendarApi"
import { convertEventsToDateEvents } from "../helpers"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store/"

export const useCalendarStore = () => {

    const dispatch = useDispatch()
    const { events, activeEvent } = useSelector( state => state.calendar )
    const { user } = useSelector( state => state.auth )

    //activar evento al hacer click
    const setActiveEvent = ( calendarEvent ) =>{
        dispatch( onSetActiveEvent( calendarEvent ) )
    }

    //Guardar un evento
    const startSavingEvent = async( calendarEvent ) =>{
        
        try {

            if( calendarEvent.id ){
                //Actualizando
                await calendarApi.put(`/events/${ calendarEvent.id }`, calendarEvent ) //llegar al backend
                dispatch( onUpdateEvent({ ...calendarEvent, user }) )
                return
            } 

            //Creando
            const { data } = await calendarApi.post('/events', calendarEvent ) //llegar al backend
            dispatch( onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }) )
            
        } catch (error) {
            console.log({ error })
            Swal.fire('Error al guardar', error.response.data.msg, 'error' ); 
        }
    }


    //Eliminar evento
    const startDeletingEvent = async() =>{

        try {
            await calendarApi.delete(`/events/${ activeEvent.id }`) //llegar al backend
            dispatch( onDeleteEvent() )

        } catch (error) {
            console.log({ error })
            Swal.fire('Error al eliminar', error.response.data.msg, 'error' ); 
        }
    }


    //Cargar Eventos
    const startLoadingEvents = async() =>{

        try {
            const { data } = await calendarApi.get('/events')  //llegar al backend

            const events = convertEventsToDateEvents( data.eventos ) //cargar eventos con fecha en numeros
            dispatch( onLoadEvents( events ) )


        } catch (error) {
            console.log({ error })
        }



    }



    return {
        //* Properties
        events,
        activeEvent,
        //saber si hay un evento seleccionado o no
        hasEventSelected: !!activeEvent,

        //* Methods
        setActiveEvent,
        startDeletingEvent,
        startSavingEvent,
        startLoadingEvents
    }

}
