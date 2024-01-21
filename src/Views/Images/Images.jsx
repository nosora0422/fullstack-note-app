import Search from "../../Components/Search/Search";
import ImageList from "../../Components/Image/List/List";
import { useState } from "react";

export default function Images(){
    const [searchText, setSearchText] = useState('');

    return(
        <div className="container">
            <Search handleSearch={setSearchText} searchArea={'Image'}/>
            <ImageList searchTerm={searchText}/>
        </div>
    )
}