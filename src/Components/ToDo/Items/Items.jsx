import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import ButtonGroup from "../../ButtonGroup/ButtonGroup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faSquareCheck as checked }from '@fortawesome/free-solid-svg-icons';
import { faSquare as unchecked} from '@fortawesome/free-regular-svg-icons';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import Pill from "../../Pill/Pill";

export default function ToDoItems({ entries, delRef, updateRef }){
    const [currFilter, setCurrFilter] = useState('All');
    const filterList = ['All', 'School', 'Work', 'Personal'];

    const [currSort, setCurrSort] = useState('Date');
    const sortList = ['Date', 'Text'];
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const fEntries = sortAndFilterList(entries, currFilter, currSort);

    const handleConfirmDelete = () => {
        if (!pendingDeleteId) {
            return;
        }

        delRef(pendingDeleteId);
        setPendingDeleteId(null);
    };

    return(
        <div>
            <div className="flex justify-end flex-wrap px-2 py-3">
                <div className="mb-2">
                    <ButtonGroup
                        validList={filterList}
                        currentState={currFilter}
                        callBackState={setCurrFilter}
                        label="Filter to-do items by category"
                    />
                </div>
                <div className="mb-2">
                    <ButtonGroup
                        validList={sortList}
                        currentState={currSort}
                        callBackState={setCurrSort}
                        label="Sort to-do items"
                    />
                </div>
            </div>
            <ul className="masonry-grid">
                {fEntries.length > 0 ? fEntries.map((item) => (
                    <Task
                        key={item.id}
                        item={item}
                        onRequestDelete={setPendingDeleteId}
                        onSaveItem={updateRef} />)) : <li className="col-span-12 w-full py-4 px-6 rounded-md -bg--surface-bright">No items to display</li>
                }
            </ul>
            <ConfirmationModal
                isOpen={Boolean(pendingDeleteId)}
                message="Delete this to-do item?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setPendingDeleteId(null)}
            />
        </div>

    );
}

function Task({ item, onRequestDelete, onSaveItem }){
    //set each item isChecked to false (unchecked)
    const [isChecked, setIsChecked] = useState(item.tasks.map(() => false));;
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(item.title);
    const [editTasks, setEditTasks] = useState(createTaskDrafts(item.tasks));

    //update isChecked to opposite = first click will change to checked box
    //get index and run setIsChecked only for the item that has the index
    const toggleIcon = (index) => {
        const updatedIsChecked = [...isChecked];
        updatedIsChecked[index] = !updatedIsChecked[index];
        setIsChecked(updatedIsChecked);
        // console.log(index);
    };

    const startEditing = () => {
        setEditTitle(item.title);
        setEditTasks(createTaskDrafts(item.tasks));
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setEditTitle(item.title);
        setEditTasks(createTaskDrafts(item.tasks));
        setIsEditing(false);
    };

    const handleTaskChange = (index, value) => {
        const updatedTasks = [...editTasks];
        updatedTasks[index] = {
            ...updatedTasks[index],
            task: value,
        };
        setEditTasks(updatedTasks);
    };

    const addEditTask = () => {
        setEditTasks([
            ...editTasks,
            {
                id: uuidv4(),
                task: '',
            },
        ]);
    };

    const deleteEditTask = (taskId) => {
        setEditTasks(editTasks.filter((task) => task.id !== taskId));
    };

    const saveEditing = () => {
        const trimmedTitle = editTitle.trim();

        if (trimmedTitle === '') {
            return;
        }

        onSaveItem({
            ...item,
            title: trimmedTitle,
            tasks: editTasks.map((task) => ({
                id: task.id,
                task: task.task,
            })),
        });
        setIsEditing(false);
    };

    return(
        <li className="masonry-grid-item gap-2 py-4 px-4 rounded-md -bg--surface-container" key={item.id}>
            <div>
                <div className="flex justify-between items-center">
                    <p className="text-xs">
                        {retDateString(item.date)}
                    </p>
                    <div className="flex items-center gap-1">
                        {!isEditing &&
                            <button
                                type="button"
                                className="p-1 border-0 bg-transparent cursor-pointer"
                                onClick={startEditing}
                                aria-label="Edit to-do item"
                            >
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                        }
                        <button
                            type="button"
                            className="p-1 border-0 bg-transparent cursor-pointer"
                            onClick={() => onRequestDelete(item.id)}
                            aria-label="Delete to-do item"
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <Pill category={item.category} />
            </div>
            <div>
                {isEditing ? (
                    <input
                        aria-label="Edit to-do title"
                        className="w-full mb-2 py-2 px-2 border-0 rounded-sm focus:border-transparent focus:ring-0 focus:outline-none focus-visible:outline-none"
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        placeholder="Enter Title"
                    />
                ) : (
                    <h2 className="font-medium text-lg">{item.title}</h2>
                )}
                <ul>
                {/*display tasks by mapping values in tasks array*/}
                {(isEditing ? editTasks : item.tasks).map((task, index) => (
                        <li
                        className="flex items-center py-1 font-normal"
                        key={task.id || index}>
                            <button
                                type="button"
                                className="mr-2 p-0 border-0 bg-transparent -text--secondary shrink-0 cursor-pointer"
                                onClick={() => toggleIcon(index)}
                                aria-pressed={isChecked[index]}
                                aria-label={`${isChecked[index] ? 'Mark incomplete' : 'Mark complete'}: ${task.task || `task ${index + 1}`}`}
                            >
                                <FontAwesomeIcon icon={isChecked[index] ? checked : unchecked} aria-hidden="true" />
                            </button>
                            {isEditing ? (
                                <div className="w-full flex items-center bg-white rounded-sm">
                                    <input
                                        aria-label={`Edit task ${index + 1}`}
                                        className="w-full py-1 px-2 border-0 rounded-sm focus:border-transparent focus:ring-0 focus:outline-none focus-visible:outline-none"
                                        value={task.task}
                                        onChange={(event) => handleTaskChange(index, event.target.value)}
                                        placeholder="Enter Task"
                                    />
                                    <button
                                        type="button"
                                        className="p-2 border-0 bg-transparent cursor-pointer"
                                        onClick={() => deleteEditTask(task.id)}
                                        aria-label={`Delete task ${index + 1}`}
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </button>
                                </div>
                            ) : (
                                <span>{task.task}</span>
                            )}
                        </li>
                    ))}
                </ul>
                {isEditing &&
                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            className="button button-tertiary rounded-sm mt-3 w-full"
                            onClick={addEditTask}
                        >
                            <FontAwesomeIcon icon={faPlus} /> Add Task
                        </button>
                        <div className="w-full flex gap-2">
                            <button
                                type="button"
                                className={`button button-secondary`}
                                onClick={cancelEditing}
                                aria-label="Cancel editing to-do item"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className={`button button-primary`}
                                onClick={saveEditing}
                                aria-label="Save to-do item"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                }

            </div>
        </li>
    )
}

function sortAndFilterList(entries, currFilter, currSort) {
    // console.log('Entries:', entries);
    // console.log('Current Filter:', currFilter);
    // console.log('Current Sort:', currSort);
    return entries
        .filter((cItem) => {
            return cItem.category?.toLowerCase() === currFilter.toLowerCase() || currFilter === 'All';
        })
        .sort((a, b) => {
            if (currSort === "Text") {
                if (a.title > b.title)
                    return 1;
                else if (a.title === b.title)
                    return 0;
                else
                    return -1;
            }
            else {
                if (a.date > b.date)
                    return 1;
                else if (a.date === b.date)
                    return 0;
                else
                    return -1;
            }

        })

}

function createTaskDrafts(tasks) {
    return tasks.map((task) => ({
        id: task.id || uuidv4(),
        task: task.task,
    }));
}

function retDateString(timestamp) {

    const cDate = new Date(timestamp);
    return cDate.toDateString() + ' at ' + cDate.getHours() + ':' + cDate.getMinutes() + ':' + cDate.getSeconds();

}
