

export const CalendarEvent = ({ event }) => { // des-estructurar de las props el evento

    // personalizar cuadro de evento
    const { title, user } = event

  return (
    <>
        {/* personalizar cuadro evento */}
        <strong>{ title }</strong>
        <span> - { user.name }</span>
    </>
  )
}
