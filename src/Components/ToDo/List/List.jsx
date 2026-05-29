import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import TodoItems from "../Items/Items";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare as regularSquare } from '@fortawesome/free-regular-svg-icons';
import { faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getLegacyStorageKey, migrateLegacyData, readStorageItems, useScopedStorageKey } from "../../../utils/storage";
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import { addUserItem, deleteUserItem, getUserItems, updateUserItem } from "../../../services/firestoreService";
import Dropdown from "../../Dropdown/Dropdown";

const CATEGORY_OPTIONS = [
    { value: "Personal", label: "Personal" },
    { value: "School", label: "School" },
    { value: "Work", label: "Work" },
];

export default function List({ searchTerm }){
    const [taskValues, setTaskValues] = useState(['']);
    const [items, setItems] = useState([]);
    const [titleVal, setTitleVal] = useState('');
    const [categoryVal, setCategoryVal] = useState('Personal');
    const [dueDateVal, setDueDateVal] = useState('');
    const { key: storageKey, isReady, mode, user } = useScopedStorageKey("todos");
    const [loadedStorageKey, setLoadedStorageKey] = useState(null);
    const [pendingTaskDeleteIndex, setPendingTaskDeleteIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const isCreateDisabled = titleVal.trim() === '' && taskValues.every((task) => task.trim() === '');

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
                    migrateLegacyData(getLegacyStorageKey("todos"), storageKey);
                    setItems(readStorageItems(storageKey));
                    setLoadedStorageKey(storageKey);
                    return;
                }

                if (mode === "user" && user) {
                    const firestoreItems = await getUserItems(user.uid, "todos");
                    setItems(firestoreItems);
                    setLoadedStorageKey(storageKey);
                }
            } catch (error) {
                console.error("Failed to load to-dos:", error);
                setLoadError("Could not load to-do lists. Please try refreshing the page.");
                setItems([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadItems();
    }, [isReady, storageKey, mode, user]);

    //save data to localstorage whenever items updated
    useEffect(() => {
        if (mode !== "guest" || !isReady || !storageKey || loadedStorageKey !== storageKey) {
            return;
        }

        localStorage.setItem(storageKey, JSON.stringify(items));
    }, [items, isReady, storageKey, loadedStorageKey, mode]);

    //update taskValues obtained from input
    const handleTaskChange = (index, value) => {
        const updatedTasks = [...taskValues];
        updatedTasks[index] = value;
        setTaskValues(updatedTasks);
    };

    //Add additioanl input box and set empty value to the task array
    const addTaskInput = () => {
        setTaskValues([...taskValues, '']);
    };

    //Remove input box and entered data from task array
    const removeTaskInput = (index) => {
        const updatedTasks = taskValues.filter((_, i) => i !== index);
        setTaskValues(updatedTasks);
    };

    const confirmRemoveTaskInput = () => {
        if (pendingTaskDeleteIndex === null) {
            return;
        }

        removeTaskInput(pendingTaskDeleteIndex);
        setPendingTaskDeleteIndex(null);
    };

    const addItem = async () => {
        if (titleVal !== ""){
            // create task array with own ids
            const tasksArray = taskValues.map((taskText) => ({
                id: uuidv4(),
                task: taskText,
                completed: false,
            }));

            const newItem = {
                id: uuidv4(),
                title: titleVal,
                tasks: tasksArray,
                category: categoryVal,
                dueDate: dueDateVal,
                date: Date.now()
            };

            if (mode === "user" && user) {
                try {
                    await addUserItem(user.uid, "todos", newItem);
                } catch (error) {
                    console.error("Failed to add to-do:", error);
                    return;
                }
            }

            setItems([...items, newItem]);

            // reset input valuse after adding to the local storage
            setTitleVal('');
            setDueDateVal('');
            setTaskValues(['']);
        }
    }

    const deleteItem = async (key) =>{
        if (mode === "user" && user) {
            try {
                await deleteUserItem(user.uid, "todos", key);
            } catch (error) {
                console.error("Failed to delete to-do:", error);
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
                await updateUserItem(user.uid, "todos", updatedItem);
            } catch (error) {
                console.error("Failed to update to-do:", error);
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
                <h1 className="text-3xl my-4">To do list</h1>
                    <div className="h-min p-4 rounded-md -bg--surface-container">
                        <div className="flex flex-col gap-2">
                            <Dropdown
                                id="todo-category"
                                name="category"
                                label="To-do category"
                                options={CATEGORY_OPTIONS}
                                value={categoryVal}
                                onChange={setCategoryVal}
                            />
                            <div className="flex items-center bg-white rounded-sm">
                                <input
                                    id="todo-title"
                                    aria-label="To-do title"
                                    className="w-full mx-2 py-2 px-2 border-0 focus:border-transparent focus:ring-0 focus:outline-none focus-visible:outline-none"
                                    value={titleVal}
                                    onChange={(event) => {
                                        setTitleVal(event.target.value);
                                    }}
                                    placeholder="Enter Title">
                                </input>
                            </div>
                            <div className="flex items-center bg-white rounded-sm">
                                <input
                                    id="todo-due-date"
                                    aria-label="To-do due date"
                                    className="w-full mx-2 py-2 px-2 border-0 focus:border-transparent focus:ring-0 focus:outline-none focus-visible:outline-none"
                                    type="date"
                                    value={dueDateVal}
                                    onChange={(event) => {
                                        setDueDateVal(event.target.value);
                                    }}
                                />
                            </div>
                            {taskValues.map((task, index) => (
                                <div className="flex items-center bg-white rounded-sm" key={index}>
                                    <FontAwesomeIcon icon={regularSquare} className="ml-4 -text--secondary"/>
                                    <input
                                        aria-label={`Task ${index + 1}`}
                                        className="w-full mx-2 py-2 px-2 border-0 focus:border-transparent focus:ring-0 focus:outline-none focus-visible:outline-none"
                                        value={task}
                                        onChange={(event) => handleTaskChange(index, event.target.value)}
                                        placeholder="Enter Task"
                                    />
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            className="button-icon"
                                            onClick={() => setPendingTaskDeleteIndex(index)}
                                            aria-label={`Remove task ${index + 1}`}
                                        ><FontAwesomeIcon icon={faTrashCan} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <div className="w-full flex flex-col gap-2">
                                <button
                                    type="button"
                                    className="button button-tertiary rounded-sm mt-2 "
                                    onClick={addTaskInput}
                                >
                                    <FontAwesomeIcon icon={faPlus} /> Add Task
                                </button>
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
                        <ConfirmationModal
                            isOpen={pendingTaskDeleteIndex !== null}
                            title="Remove Task"
                            message="Do you want to remove this task row?"
                            onConfirm={confirmRemoveTaskInput}
                            onCancel={() => setPendingTaskDeleteIndex(null)}
                        />
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-8">
                    {isLoading ? (
                        <p className="w-full py-4 px-6 rounded-md -bg--surface-bright">Loading to-do lists...</p>
                    ) : loadError ? (
                        <p className="w-full py-4 px-6 rounded-md -bg--surface-bright">{loadError}</p>
                    ) : (
                        <TodoItems
                            entries={items.filter((item) => {
                                const searchResult = searchTerm.toLowerCase();
                                // Check if searchText is in title or any task text
                                return (
                                    (item.title && item.title.toLowerCase().includes(searchResult)) ||
                                    (item.tasks && item.tasks.some((task) => task.task.toLowerCase().includes(searchResult)))
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
