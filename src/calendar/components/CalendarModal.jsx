import { useEffect, useMemo, useState } from 'react';
import { addHours, differenceInSeconds } from 'date-fns';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'

import Modal from 'react-modal'
import DatePicker, { registerLocale } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"; // styles
import es from 'date-fns/locale/es'

import { useCalendarStore, useUiStore } from '../../hooks';

//cambiar idioma a español
registerLocale('es', es )


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};
// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');



export const CalendarModal = () => {

    //customHook modal
    const { isDateModalOpen, closeDateModal } = useUiStore()
    //cutom hook calendarStore
    const { activeEvent, startSavingEvent } = useCalendarStore()


    //hacer el submit del form para mostrar mensaje de error
    const [ formSubmitted, setFormSubmitted ] = useState( false )
    //state para uso del formulario
    const [ formValues, setFormValues ] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours( new Date(), 2)
    })


    //hacer el submit del form para mostrar mensaje de error
    const titleClass = useMemo(() =>{
        if( !formSubmitted ) return ''

        return ( formValues.title.length > 0 )
            ? ''
            : 'is-invalid'

    }, [ formValues.title, formSubmitted ])


    //activar evento al hacer click para el formulario
    useEffect(() => {
        if( activeEvent !== null ){
            setFormValues({ ...activeEvent })
        }

    }, [ activeEvent ])
    


    //Editar informacion de formulario
    const onInputChanged = ({ target }) =>{
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }   

    //Cambiar la fecha
    const onDateChanged = ( event, changing ) =>{

        setFormValues({
            ...formValues,
            [changing]: event
        })
    }

    //cerrar el modal
    const onCloseModal = () =>{
        closeDateModal()
    }


    //manejar posteo del formulario
    const onSubmit = async ( event ) =>{
        event.preventDefault()
        //hacer el submit del form para mostrar mensaje de error
        setFormSubmitted( true )

        //No permitir que la fecha mayor sea menor
        const difference = differenceInSeconds( formValues.end, formValues.start )
        //validaciones ( si no es un numero ), ( fecha mayor es menor )
        if( isNaN( difference ) || difference <= 0 ){
            //mensaje de error
            Swal.fire('Fechas incorrectas', 'Revisar las fechas ingresadas', 'error')
            return
        }

        //obligar tener el titulo del evento
        if( formValues.title.length <= 0 ) return            


        //añadir un nuevo evento
        await startSavingEvent( formValues )
        closeDateModal()


    }

  return (
    <Modal
        isOpen={ isDateModalOpen }
        onRequestClose={ onCloseModal }
        style = { customStyles }
        className="modal"
        overlayClassName="modal-fondo"
        closeTimeoutMS={ 200 }
    >

    <h1> Nuevo evento </h1>
    <hr />

    <form className="container" onSubmit={ onSubmit }>

        <div className="form-group mb-2">
            <label>Fecha y hora inicio</label>
            <DatePicker 
                selected={ formValues.start }
                onChange={ ( event ) => onDateChanged(event, 'start') }
                className="form-control"
                dateFormat="Pp" 
                showTimeSelect
                locale="es"
            />
        </div>

        <div className="form-group mb-2">
            <label>Fecha y hora fin</label>
            <DatePicker 
                minDate={ formValues.start }
                selected={ formValues.end }
                onChange={ ( event ) => onDateChanged(event, 'end') }
                className="form-control"
                dateFormat="Pp"
                showTimeSelect
                locale="es" 
            />
        </div>

        <hr />
        <div className="form-group mb-2">
            <label>Titulo y notas</label>
            <input 
                type="text" 
                className={`form-control ${ titleClass }`}//hacer el submit del form para mostrar mensaje de error
                placeholder="Título del evento"
                name="title"
                autoComplete="off"
                value={ formValues.title }
                onChange={ onInputChanged }
            />
            <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
        </div>

        <div className="form-group mb-2">
            <textarea 
                type="text" 
                className="form-control"
                placeholder="Notas"
                rows="5"
                name="notes"
                value={ formValues.notes }
                onChange={ onInputChanged }
            ></textarea>
            <small id="emailHelp" className="form-text text-muted">Información adicional</small>
        </div>

        <button
            type="submit"
            className="btn btn-outline-primary btn-block"
        >
            <i className="far fa-save"></i>
            <span> Guardar</span>
        </button>

    </form>
    </Modal>
    
  )
}
