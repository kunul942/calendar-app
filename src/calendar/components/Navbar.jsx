import { useAuthStore } from "../../hooks/useAuthStore"


export const Navbar = () => {

    const { startLogout, user } = useAuthStore()
    const userName = user.name


  return (
    <div className="navbar navbar-dark bg-dark mb-4 px-4">
        <span className="navbar-brand">
            {/* font awesome */}
            <i className="fas fa-calendar-alt"></i>
            {/* hacer separacion */}
            &nbsp; 
            { userName }
        </span>

        <button 
            className="btn btn-outline-danger"
            onClick={ startLogout }
        >
            {/* font awesome */}
            <i className="fas fa-sign-out-alt"></i>
            {/* hacer separacion */}
            &nbsp;
            <span>Salir</span>
        </button>
    </div>
  )
}
