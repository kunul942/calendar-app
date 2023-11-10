import { parseISO } from "date-fns"



//convertir fecha de string a numero
export const convertEventsToDateEvents = ( events = [] ) =>{

    return  events.map( event =>{

        event.end = parseISO( event.end )
        event.start = parseISO( event.start )

        return event
    })

}