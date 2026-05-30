import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import ButtonGroup from "../../ButtonGroup/ButtonGroup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faSquareCheck as checked }from '@fortawesome/free-solid-svg-icons';
import { faSquare as unchecked} from '@fortawesome/free-regular-svg-icons';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import Pill from "../../Pill/Pill";
import Dropdown from "../../Dropdown/Dropdown";

const SORT_OPTIONS = [
    { value: "Due Date", label: "Due Date" },
    { value: "Creation Date", label: "Creation Date" },
    { value: "Title", label: "Title" },
];

const CATEGORY_OPTIONS = [
    { value: "Personal", label: "Personal" },
    { value: "School", label: "School" },
    { value: "Work", label: "Work" },
];

export default function ToDoItems({ entries, delRef, updateRef }){
    const [currFilter, setCurrFilter] = useState('All');
    const filterList = ['All', 'School', 'Work', 'Personal'];

    const [currSort, setCurrSort] = useState('Due Date');
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
                <div className="mb-2 w-full sm:w-48">
                    <Dropdown
                        id="todo-sort"
                        name="todo-sort"
                        label="Sort to-do items"
                        options={SORT_OPTIONS}
                        value={currSort}
                        onChange={setCurrSort}
                        type="secondary"
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
    const [isChecked, setIsChecked] = useState(getCheckedTasks(item.tasks));
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(item.title);
    const [editCategory, setEditCategory] = useState(item.category || 'Personal');
    const [editDueDate, setEditDueDate] = useState(item.dueDate || '');
    const [editTasks, setEditTasks] = useState(createTaskDrafts(item.tasks));
    const [pendingEditTaskDeleteId, setPendingEditTaskDeleteId] = useState(null);
    const status = getDueDateStatus(item.dueDate, isChecked);

    //update isChecked to opposite = first click will change to checked box
    //get index and run setIsChecked only for the item that has the index
    const toggleIcon = (index) => {
        const updatedIsChecked = [...isChecked];
        updatedIsChecked[index] = !updatedIsChecked[index];
        setIsChecked(updatedIsChecked);

        if (isEditing) {
            setEditTasks((currentTasks) => currentTasks.map((task, taskIndex) => ({
                ...task,
                completed: Boolean(updatedIsChecked[taskIndex]),
            })));
            return;
        }

        onSaveItem({
            ...item,
            tasks: item.tasks.map((task, taskIndex) => ({
                ...task,
                completed: updatedIsChecked[taskIndex],
            })),
        });
    };

    const startEditing = () => {
        setEditTitle(item.title);
        setEditCategory(item.category || 'Personal');
        setEditDueDate(item.dueDate || '');
        setEditTasks(createTaskDrafts(item.tasks));
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setEditTitle(item.title);
        setEditCategory(item.category || 'Personal');
        setEditDueDate(item.dueDate || '');
        setEditTasks(createTaskDrafts(item.tasks));
        setPendingEditTaskDeleteId(null);
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
                completed: false,
            },
        ]);
    };

    const deleteEditTask = (taskId) => {
        setEditTasks(editTasks.filter((task) => task.id !== taskId));
        setPendingEditTaskDeleteId(null);
    };

    const confirmDeleteEditTask = () => {
        if (!pendingEditTaskDeleteId) {
            return;
        }

        deleteEditTask(pendingEditTaskDeleteId);
    };

    const saveEditing = () => {
        const trimmedTitle = editTitle.trim();

        if (trimmedTitle === '') {
            return;
        }

        onSaveItem({
            ...item,
            title: trimmedTitle,
            category: editCategory,
            dueDate: editDueDate,
            tasks: editTasks.map((task) => ({
                id: task.id,
                task: task.task,
                completed: Boolean(task.completed),
            })),
        });
        setIsEditing(false);
    };

    useEffect(() => {
        setIsChecked(getCheckedTasks(item.tasks));
    }, [item.tasks]);

    return(
        <li className="masonry-grid-item gap-2 py-4 px-4 rounded-md -bg--surface-container" key={item.id}>
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                    <div className="flex flex-row items-center gap-3">
                        <Pill category={item.category} />
                        <div className="flex items-center gap-1">
                            <span
                                className={`rounded-full w-2 h-2 ${status.colorClass} inline-block`}
                                title={status.label}
                                aria-label={status.label}
                            ></span>
                            <p className="text-xs font-medium">
                                {item.dueDate ? `Due ${retDueDateString(item.dueDate)}` : 'No due date'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {!isEditing &&
                            <button
                                type="button"
                                className="button-icon"
                                onClick={startEditing}
                                aria-label="Edit to-do item"
                            >
                                <FontAwesomeIcon icon={faPenToSquare}/>
                            </button>
                        }
                        <button
                            type="button"
                            className="button-icon"
                            onClick={() => onRequestDelete(item.id)}
                            aria-label="Delete to-do item"
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                {isEditing &&
                    <Dropdown
                        id={`todo-category-${item.id}`}
                        name="category"
                        label="Edit to-do category"
                        options={CATEGORY_OPTIONS}
                        value={editCategory}
                        onChange={setEditCategory}
                    />
                }
                {isEditing &&
                    <input
                        aria-label="Edit to-do due date"
                        className="w-full py-2 px-4 border-0 rounded-sm focus:border-transparent focus:ring-0 focus:outline-none focus-visible:outline-none"
                        type="date"
                        value={editDueDate}
                        onChange={(event) => setEditDueDate(event.target.value)}
                    />
                }
                {isEditing ? (
                    <input
                        aria-label="Edit to-do title"
                        className="w-full py-2 px-4 border-0 rounded-sm focus:border-transparent focus:ring-0 focus:outline-none focus-visible:outline-none"
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        placeholder="Enter Title"
                    />
                ) : (
                    <h2 className="font-medium text-lg">{item.title}</h2>
                )}
                
                
                <ul className={`flex flex-col ${isEditing ? 'gap-2' : 'gap-0'}`}>
                {/*display tasks by mapping values in tasks array*/}
                {(isEditing ? editTasks : item.tasks).map((task, index) => (
                        <li
                            className={`flex items-start font-normal ${isEditing ? 'bg-white' : ''} rounded-md ${isEditing ? 'py-2': 'py-1'} px-4 `}
                            key={task.id || index}
                        >
                            
                            {isEditing ? (
                                <div className="w-full flex items-center gap-2">
                                    <div className="flex w-full items-start">
                                        <button
                                            type="button"
                                            className="mr-2 p-0 border-0 bg-transparent -text--secondary shrink-0 cursor-pointer"
                                            onClick={() => toggleIcon(index)}
                                            aria-pressed={isChecked[index]}
                                            aria-label={`${isChecked[index] ? 'Mark incomplete' : 'Mark complete'}: ${task.task || `task ${index + 1}`}`}
                                        >
                                            <FontAwesomeIcon icon={isChecked[index] ? checked : unchecked} aria-hidden="true" size="32"/>
                                        </button>
                                        <textarea
                                            aria-label={`Edit task ${index + 1}`}
                                            className={`w-full min-h-10 resize-none border-0 rounded-sm focus:border-transparent focus:ring-0 focus:outline-none focus-visible:outline-none ${isChecked[index] ? '-text--secondary line-through' : ''}`}
                                            value={task.task}
                                            onChange={(event) => handleTaskChange(index, event.target.value)}
                                            placeholder="Enter Task"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="button-icon"
                                        onClick={() => setPendingEditTaskDeleteId(task.id)}
                                        aria-label={`Delete task ${index + 1}`}
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="mr-2 p-0 border-0 bg-transparent -text--secondary shrink-0 cursor-pointer"
                                        onClick={() => toggleIcon(index)}
                                        aria-pressed={isChecked[index]}
                                        aria-label={`${isChecked[index] ? 'Mark incomplete' : 'Mark complete'}: ${task.task || `task ${index + 1}`}`}
                                    >
                                        <FontAwesomeIcon icon={isChecked[index] ? checked : unchecked} aria-hidden="true" size="32"/>
                                    </button>
                                    <span className={`${isChecked[index] ? '-text--secondary line-through' : ''}`}>{task.task}</span>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
                {isEditing &&
                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            className="button button-tertiary rounded-sm mt-2 w-full"
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
            <ConfirmationModal
                isOpen={Boolean(pendingEditTaskDeleteId)}
                title="Delete Task"
                message="Delete this task from the to-do item?"
                onConfirm={confirmDeleteEditTask}
                onCancel={() => setPendingEditTaskDeleteId(null)}
            />
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
            if (currSort === "Title") {
                if (a.title > b.title)
                    return 1;
                else if (a.title === b.title)
                    return 0;
                else
                    return -1;
            }
            else if (currSort === "Due Date") {
                return compareDueDates(a, b);
            } else {
                if (a.date > b.date)
                    return 1;
                else if (a.date === b.date)
                    return 0;
                else
                    return -1;
            }

        })

}

function compareDueDates(a, b) {
    const aDueDate = getDueDateEndTime(a.dueDate);
    const bDueDate = getDueDateEndTime(b.dueDate);

    if (!aDueDate && !bDueDate) {
        return a.date - b.date;
    }

    if (!aDueDate) {
        return 1;
    }

    if (!bDueDate) {
        return -1;
    }

    const now = Date.now();
    const aIsOverdue = aDueDate.getTime() < now;
    const bIsOverdue = bDueDate.getTime() < now;

    if (aIsOverdue && bIsOverdue) {
        return bDueDate.getTime() - aDueDate.getTime();
    }

    if (aIsOverdue) {
        return -1;
    }

    if (bIsOverdue) {
        return 1;
    }

    return aDueDate.getTime() - bDueDate.getTime();
}

function createTaskDrafts(tasks) {
    return tasks.map((task) => ({
        id: task.id || uuidv4(),
        task: task.task,
        completed: Boolean(task.completed),
    }));
}

function getCheckedTasks(tasks) {
    return tasks.map((task) => Boolean(task.completed));
}

function getDueDateStatus(dueDate, checkedTasks) {
    if (checkedTasks.length > 0 && checkedTasks.every(Boolean)) {
        return {
            colorClass: 'bg-green-500',
            label: 'Completed',
        };
    }

    const dueAt = getDueDateEndTime(dueDate);

    if (!dueAt) {
        return {
            colorClass: 'bg-gray-400',
            label: 'No due date',
        };
    }

    const timeRemaining = dueAt.getTime() - Date.now();

    if (timeRemaining < 0) {
        return {
            colorClass: 'bg-red-500',
            label: 'Past due',
        };
    }

    if (timeRemaining < 24 * 60 * 60 * 1000) {
        return {
            colorClass: 'bg-yellow-400',
            label: 'Less than 1 day left',
        };
    }

    return {
        colorClass: 'bg-gray-400',
        label: 'Due later',
    };
}

function getDueDateEndTime(dueDate) {
    if (!dueDate) {
        return null;
    }

    const [year, month, day] = dueDate.split('-').map(Number);

    if (!year || !month || !day) {
        return null;
    }

    return new Date(year, month - 1, day, 23, 59, 59, 999);
}

function retDueDateString(dueDate) {
    const dueAt = getDueDateEndTime(dueDate);

    if (!dueAt) {
        return 'No due date';
    }

    return dueAt.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}


