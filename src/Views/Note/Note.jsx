import Search from "../../Components/Search/Search";
import List from "../../Components/Note/List/List";
import { useState } from "react";

export default function Note(){
    const [searchText, setSearchText] = useState('');

    return(
        <div className="container">
            <Search handleSearch={setSearchText} searchArea={'Note'}/>
            <List searchTerm={searchText}/>
        </div>
    )
}