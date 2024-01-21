import Search from "../../Components/Search/Search";
import List from "../../Components/ToDo/List/List";
import { useState } from "react";

export default function ToDoList(){
    const [searchText, setSearchText] = useState('');

    return(
        <div className="container">
            <Search handleSearch={setSearchText} searchArea={'List'}/>
            <List searchTerm={searchText}/>
        </div>
    )
}