import { addHours } from "date-fns"
import { useCalendarStore, useUiStore } from "../../hooks"


export const FabAddNew = () => {

    const { openDateModal } = useUiStore()
    const { setActiveEvent } = useCalendarStore()

    //Preparar para la creacion de un evento nuevo
    const handleClickNew = () =>{
        setActiveEvent({
            //cuando quiero actualizar no agrego el ID
            title: '', 
            notes: '',
            start: new Date(), 
            end: addHours( new Date(), 2 ),
            bgColor: '#fafafa',
            user: {
                _id: '123',
                name: 'Kunu'
            }
        })
        openDateModal()
    }


  return (
    <button
        className="btn btn-primary fab"
        onClick={ handleClickNew }
    >   
        <i className="fas fa-plus"></i>
    </button>
  )
}
