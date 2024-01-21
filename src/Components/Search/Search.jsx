import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Search({ handleSearch, searchArea }){
    return(
        <div className="flex items-center w-full ml-auto rounded-full px-4 bg-slate-100">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input 
                className="w-full border-0 py-3 px-2 bg-transparent focus:outline-none" 
                onChange={(event)=>handleSearch(event.target.value)} 
                type="text" 
                placeholder={'Search '+ searchArea}
                >
            </input>
        </div>

    )
}