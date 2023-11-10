import { useDispatch, useSelector } from "react-redux"
import { onCloseDateModal, onOpenDateModal } from "../store/"


//mostrar y ocultar en base al store
export const useUiStore = () =>{

    const dispatch = useDispatch()
    const { isDateModalOpen } = useSelector( state => state.ui )

    //funcion para abrir el modal
    const openDateModal = () => {
        dispatch( onOpenDateModal() )
    }

    //funcion para cerrar el modal
    const closeDateModal = () =>{
        dispatch( onCloseDateModal() )
    }

    //funcion para utilizar toggle
    const toggleDateModal = () =>{
        ( isDateModalOpen )
            ? openDateModal()
            : closeDateModal()
    }


    return {
        //* Properties
        isDateModalOpen,

        //* Methods
        closeDateModal,
        openDateModal,
        toggleDateModal
    }

}