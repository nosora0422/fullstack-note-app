import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import NoteItems from "../Items/Items";
import { getLegacyStorageKey, migrateLegacyData, readStorageItems, useScopedStorageKey } from "../../../utils/storage";

export default function List({ searchTerm }){
    const [textVal, setTextVal] = useState('');
    const [items, setItems] = useState([]);
    const [titleVal, setTitleVal] = useState('');
    const [categoryVal, setCategoryVal] = useState('Personal');
    const { key: storageKey, isReady } = useScopedStorageKey("notes");
    const [loadedStorageKey, setLoadedStorageKey] = useState(null);
    const isCreateDisabled = titleVal.trim() === '' && textVal.trim() === '';

    //get data from localstorage
    useEffect(()=>{
        if (!isReady || !storageKey) {
            return;
        }

        migrateLegacyData(getLegacyStorageKey("notes"), storageKey);
        setItems(readStorageItems(storageKey));
        setLoadedStorageKey(storageKey);
    },[isReady, storageKey]);

    //save data to localstorage whenver items updated
    useEffect(() => {
        if (!isReady || !storageKey || loadedStorageKey !== storageKey) {
            return;
        }

        localStorage.setItem(storageKey, JSON.stringify(items));
    }, [items, isReady, storageKey, loadedStorageKey]);


    const addItem = () => {
        if (titleVal !== ""){
            const newItem = {
                id: uuidv4(),
                title: titleVal,
                note: textVal,
                category: categoryVal,
                date: Date.now()
            };

            setItems([...items, newItem]);

            // reset input valuse after adding to the local storage
            setTitleVal('');
            setTextVal('');
        }
    }

    const deleteItem = (key) =>{
        setItems((currentItems) => currentItems.filter((item) => {
            return item.id !== key;
        }));
    }

    const updateItem = (updatedItem) => {
        setItems((currentItems) => currentItems.map((item) => {
            return item.id === updatedItem.id ? updatedItem : item;
        }));
    };


    return(
        <div className="w-full mt-8 lg:mt-11">
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12 lg:col-span-4">
                <h1 className="text-3xl my-4">Note</h1>
                    <div className="th-min p-4 rounded-md -bg--surface-container">
                        <div className="flex flex-col gap-2">
                            <select
                                name="category"
                                className="w-full py-2 px-4 border-none rounded-sm focus:ring-0 focus:outline-none focus-visible:outline-none"
                                value={categoryVal}
                                onChange={event => {
                                    setCategoryVal(event.target.value)
                                }}
                            >
                                <option value="Personal">Personal</option>
                                <option value="School">School</option>
                                <option value="Work">Work</option>
                            </select>
                            <div className="flex items-center bg-white rounded-sm">
                                <input
                                    className="w-full py-2 px-4 border-none rounded-sm focus:ring-0 focus:outline-none focus-visible:outline-none"
                                    value={titleVal}
                                    onChange={(event) => {
                                        setTitleVal(event.target.value);
                                    }}
                                    placeholder="Enter Title">
                                </input>
                            </div>
                            <div className="iflex items-center bg-white rounded-sm">
                                <textarea
                                    className="w-full py-2 px-4 border-none rounded-sm focus:ring-0 focus:outline-none focus-visible:outline-none font-Roboto h-52"
                                    value={textVal}
                                    onChange={(event) => {setTextVal(event.target.value);
                                    }}
                                    placeholder="Enter Note"
                                />
                            </div>
                            <button
                                className={`button button-primary ${isCreateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                type="submit"
                                disabled={isCreateDisabled}
                                onClick={() => addItem()}
                            >
                                Create
                            </button>
                        </div>

                    </div>
                </div>
                <div className="col-span-12 lg:col-span-8">
                    <NoteItems
                         entries={items.filter((item) => {
                            const searchResult = searchTerm.toLowerCase();
                            // Check if searchText is in title or any note text
                            return (
                                (item.title && item.title.toLowerCase().includes(searchResult)) ||
                                (item.note && item.note.toLowerCase().includes(searchResult))
                            );
                        })}
                        delRef={deleteItem}
                        updateRef={updateItem}
                    />
                </div>
            </div>
        </div>
    )
}
