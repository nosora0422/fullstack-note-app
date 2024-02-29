import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import TodoItems from "../Items/Items";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare as regularSquare } from '@fortawesome/free-regular-svg-icons';
import { faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function List({ searchTerm }){
    const [taskValues, setTaskValues] = useState(['']);
    const [items, setItems] = useState([]);
    const [titleVal, setTitleVal] = useState('');
    const [categoryVal, setCategoryVal] = useState('personal');

    //get data from localstorage
    useEffect(()=>{
        const storedData = localStorage.getItem('todolist_data');
        // console.log(storedData);

        if(storedData !== null){
            setItems(JSON.parse(storedData));
        }
    },[]);

    //save data to localstorage whenever items updated
    useEffect(() => {
        localStorage.setItem('todolist_data', JSON.stringify(items));
    }, [items]);

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

    const addItem = () => {
        if (titleVal !== ""){
            // create task array with own ids
            const tasksArray = taskValues.map((taskText) => ({
                id: uuidv4(),
                task: taskText,
            }));

            const newItem = {
                id: uuidv4(),
                title: titleVal,
                tasks: tasksArray,
                category: categoryVal,
                date: Date.now()
            };

            setItems([...items, newItem]);

            // reset input valuse after adding to the local storage
            setTitleVal('');
            setTaskValues(['']);
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
                <h1 className="text-3xl my-4">To do list</h1>
                    <div className="h-min p-4 rounded-md -bg--surface-container">
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
                                    className="w-full mx-2 py-2 px-2 border-none focus: outline-0"
                                    value={titleVal}
                                    onChange={(event) => {
                                        setTitleVal(event.target.value);
                                    }}
                                    placeholder="Enter Title">
                                </input>
                            </div>
                            {taskValues.map((task, index) => (
                                <div className="flex items-center bg-white rounded-sm" key={index}>
                                    <FontAwesomeIcon icon={regularSquare} className="ml-4 -text--secondary"/>
                                    <input
                                        className="w-full mx-2 py-2 px-2 border-none focus: outline-0"
                                        value={task}
                                        onChange={(event) => handleTaskChange(index, event.target.value)}
                                        placeholder="Enter Task"
                                    />
                                    {index > 0 && (
                                        <button 
                                            className="p-2 border-0 bg-transparent cursor-pointer" 
                                            onClick={() => removeTaskInput(index)}
                                        ><FontAwesomeIcon icon={faTrashCan} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button 
                                type="submit"
                                className="button rounded-sm mt-2 -bg--surface-container-highest -text--on-primary-container"
                                onClick={addTaskInput}
                            >
                            <FontAwesomeIcon icon={faPlus} /> Add Task
                            </button>
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
                    />
                </div>
            </div>
        </div>
    )
}
