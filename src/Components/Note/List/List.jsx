import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import NoteItems from "../Items/Items";
import { getLegacyStorageKey, migrateLegacyData, readStorageItems, useScopedStorageKey } from "../../../utils/storage";
import { addUserItem, deleteUserItem, getUserItems, updateUserItem } from "../../../services/firestoreService";
import Dropdown from "../../Dropdown/Dropdown";

const CATEGORY_OPTIONS = [
    { value: "Personal", label: "Personal" },
    { value: "School", label: "School" },
    { value: "Work", label: "Work" },
];

export default function List({ searchTerm }){
    const [textVal, setTextVal] = useState('');
    const [items, setItems] = useState([]);
    const [titleVal, setTitleVal] = useState('');
    const [categoryVal, setCategoryVal] = useState('Personal');
    const { key: storageKey, isReady, mode, user } = useScopedStorageKey("notes");
    const [loadedStorageKey, setLoadedStorageKey] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const isCreateDisabled = titleVal.trim() === '' && textVal.trim() === '';

    //get data from FireStore or localstorage
    useEffect(() => {
        if (!isReady) {
            return;
        }

        const loadItems = async () => {
            setIsLoading(true);
            setLoadError("");

            try {
                if (mode === "guest") {
                    migrateLegacyData(getLegacyStorageKey("notes"), storageKey);
                    setItems(readStorageItems(storageKey));
                    setLoadedStorageKey(storageKey);
                    return;
                }

                if (mode === "user" && user) {
                    const firestoreItems = await getUserItems(user.uid, "notes");
                    setItems(firestoreItems);
                    setLoadedStorageKey(storageKey);
                }
            } catch (error) {
                console.error("Failed to load notes:", error);
                setLoadError("Could not load notes. Please try refreshing the page.");
                setItems([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadItems();
    }, [isReady, storageKey, mode, user]);

    //save data to localstorage whenver items updated
    useEffect(() => {
        if (mode !== "guest" || !isReady || !storageKey || loadedStorageKey !== storageKey) {
            return;
        }

        localStorage.setItem(storageKey, JSON.stringify(items));
    }, [items, isReady, storageKey, loadedStorageKey, mode]);


    const addItem = async () => {
        if (titleVal !== ""){
            const newItem = {
                id: uuidv4(),
                title: titleVal,
                note: textVal,
                category: categoryVal,
                date: Date.now()
            };

            if (mode === "user" && user) {
                try {
                    await addUserItem(user.uid, "notes", newItem);
                } catch (error) {
                    console.error("Failed to add note:", error);
                    return;
                }
            }

            setItems([...items, newItem]);

            // reset input valuse after adding to the local storage
            setTitleVal('');
            setTextVal('');
        }
    }

    const deleteItem = async (key) =>{
        if (mode === "user" && user) {
            try {
                await deleteUserItem(user.uid, "notes", key);
            } catch (error) {
                console.error("Failed to delete note:", error);
                return;
            }
        }

        setItems((currentItems) => currentItems.filter((item) => {
            return item.id !== key;
        }));
    }

    const updateItem = async (updatedItem) => {
        if (mode === "user" && user) {
            try {
                await updateUserItem(user.uid, "notes", updatedItem);
            } catch (error) {
                console.error("Failed to update note:", error);
                return;
            }
        }

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
                            <Dropdown
                                id="note-category"
                                name="category"
                                label="Note category"
                                options={CATEGORY_OPTIONS}
                                value={categoryVal}
                                onChange={setCategoryVal}
                            />
                            <div className="flex items-center bg-white rounded-sm">
                                <input
                                    id="note-title"
                                    aria-label="Note title"
                                    className="w-full py-2 px-4 border-none rounded-sm focus:ring-0 focus:outline-none focus-visible:outline-none"
                                    value={titleVal}
                                    onChange={(event) => {
                                        setTitleVal(event.target.value);
                                    }}
                                    placeholder="Enter Title">
                                </input>
                            </div>
                            <div className="flex items-center bg-white rounded-sm">
                                <textarea
                                    id="note-body"
                                    aria-label="Note text"
                                    className="w-full py-2 px-4 border-none rounded-sm focus:ring-0 focus:outline-none focus-visible:outline-none h-52"
                                    value={textVal}
                                    onChange={(event) => {setTextVal(event.target.value);
                                    }}
                                    placeholder="Enter Note"
                                />
                            </div>
                            <button
                                className={`button button-primary ${isCreateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                type="button"
                                disabled={isCreateDisabled}
                                onClick={() => addItem()}
                            >
                                Create
                            </button>
                        </div>

                    </div>
                </div>
                <div className="col-span-12 lg:col-span-8">
                    {isLoading ? (
                        <p className="w-full py-4 px-6 rounded-md -bg--surface-bright">Loading notes...</p>
                    ) : loadError ? (
                        <p className="w-full py-4 px-6 rounded-md -bg--surface-bright">{loadError}</p>
                    ) : (
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
                    )}
                </div>
            </div>
        </div>
    )
}
