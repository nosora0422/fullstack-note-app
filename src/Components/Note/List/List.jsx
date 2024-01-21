import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import NoteItems from "../Items/Items";

export default function List({ searchTerm }){
    const [textVal, setTextVal] = useState('');
    const [items, setItems] = useState([]);
    const [titleVal, setTitleVal] = useState('');
    const [categoryVal, setCategoryVal] = useState('Personal');

    //get data from localstorage
    useEffect(()=>{
        const storedData = localStorage.getItem('note_data');
        // console.log(storedData);

        if(storedData !== null){
            setItems(JSON.parse(storedData));
        }
    },[]);

    //save data to localstorage whenver items updated
    useEffect(() => {
        localStorage.setItem('note_data', JSON.stringify(items));
    }, [items]);


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
        let filteredItems = items.filter((item)=>{return (item.id !== key);
        });

        setItems(filteredItems);
    }


    return(
        <div className="w-full mt-8 lg:mt-11">
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12 lg:col-span-4">
                <h1 className="text-3xl my-4">Note</h1>
                    <div className="th-min p-4 rounded-md -bg--surface-container">
                        <div className="flex flex-col gap-2">
                            <select
                                className="w-full py-2 px-4 border-none rounded-sm focus: outline-0"
                                value={categoryVal}
                                onChange={event => {
                                    setCategoryVal(event.target.value)
                                }}
                            >
                                <option value="personal">Personal</option>
                                <option value="school">School</option>
                                <option value="work">Work</option>
                            </select>
                            <div className="flex items-center bg-white rounded-sm">
                                <input
                                    className="w-full py-2 px-4 border-none rounded-sm focus: outline-0"
                                    value={titleVal}
                                    onChange={(event) => {
                                        setTitleVal(event.target.value);
                                    }}
                                    placeholder="Enter Title">
                                </input>
                            </div>
                            <div className="iflex items-center bg-white rounded-sm">
                                <textarea
                                    className="w-full py-2 px-4 border-none rounded-sm focus: outline-0 font-Roboto h-72"
                                    value={textVal}
                                    onChange={(event) => {setTextVal(event.target.value);
                                    }}
                                    placeholder="Enter Note"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                className="button -bg--primary -text--on-primary"
                                type="submit"
                                onClick={() => addItem()}
                            >
                                Create
                            </button>
                            <button
                                className="button -bg--primary-container -text--on-primary-container"
                                type="submit"
                            >
                                Cancel
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
                    />
                </div>
            </div>
        </div>
    )
}