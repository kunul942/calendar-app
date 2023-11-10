import { useEffect, useState } from "react";
//importacion del calendar
import { Calendar } from "react-big-calendar";
// css del calendar
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, Navbar } from '../'

import { localizer, getMessagesES } from "../../helpers"
import { useUiStore, useCalendarStore, useAuthStore } from "../../hooks";



export const CalendarPage = () => {

    const { user } = useAuthStore()
    // custom hook para el modal
    const { openDateModal } = useUiStore()
    //custom hook para el calendarStore
    const { events, setActiveEvent, startLoadingEvents } = useCalendarStore()
    //lastView al hacer reload de la app
    const [ lastView, setLastView ] = useState(localStorage.getItem('lastView') || 'week')

    //lo que yo retorne puede cambiar el estilo
    const eventStyleGetter = ( event, start, end, isSelected ) =>{

        //colores al autor de el evento
        const isMyEvent = ( user.uid === event.user._id ) || ( user.uid === event.user.uid ) 

        const style = {
            backgroundColor: isMyEvent ? '#347CF7' : '#465660', //color dependiendo de el autor del evento
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white'
        }
        
        return { 
            style
        }

    }


    //funciones de escuchar eventos del calendario
    const onDoubleClick = ( event ) =>{
        openDateModal()
    }

    const onSelect = ( event ) =>{
        setActiveEvent( event ) 
    }

    const onViewChanged = ( event ) =>{
        localStorage.setItem('lastView', event)
        setLastView( event )
    }

    //cargar eventos de calendario
    useEffect(() => {
        startLoadingEvents();
    }, [])
    

    return (
        <>
            <Navbar />

            <Calendar
                culture="es"
                localizer={ localizer }
                events={ events }
                defaultView={ lastView }
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc( 100vh - 80px )' }}
                messages={ getMessagesES() }
                eventPropGetter={ eventStyleGetter }
                //personalizar cuadro evento
                components={{
                    event: CalendarEvent
                }}
                //escuchar eventos del calendario
                onDoubleClickEvent={ onDoubleClick }
                onSelectEvent={ onSelect }
                onView={ onViewChanged }
            />

            <CalendarModal />

            <FabAddNew />
            <FabDelete />

        </>
    )
}