import { useState } from "react";
import ButtonGroup from "../../ButtonGroup/ButtonGroup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faSquareCheck as checked }from '@fortawesome/free-solid-svg-icons';
import { faSquare as unchecked} from '@fortawesome/free-regular-svg-icons';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";

export default function ToDoItems({ entries, delRef }){
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
                    />
                </div>
                <div className="mb-2">
                    <ButtonGroup 
                        validList={sortList} 
                        currentState={currSort}
                        callBackState={setCurrSort}
                    />
                </div>
            </div>
            <ul className="my-grid">
                {fEntries.length > 0 ? fEntries.map((item) => (<Task key={item.id} item={item} onRequestDelete={setPendingDeleteId} />)) : <li className="col-span-12 w-full py-4 px-6 rounded-md -bg--surface-bright">No items to display</li>}
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

function Task({ item, onRequestDelete }){
    //set each item isChecked to false (unchecked)
    const [isChecked, setIsChecked] = useState(item.tasks.map(() => false));;

    //update isChecked to opposite = first click will change to checked box
    //get index and run setIsChecked only for the item that has the index
    const toggleIcon = (index) => {
        const updatedIsChecked = [...isChecked];
        updatedIsChecked[index] = !updatedIsChecked[index];
        setIsChecked(updatedIsChecked);
        // console.log(index);
    };


    return(
        <li className="col-span-12 lg:col-span-6 flex flex-col gap-4 w-full py-4 px-4 rounded-md -bg--surface-bright" key={item.id}>
            <div>
                <div className="flex justify-between items-center">
                    <p className="text-xs">
                        {retDateString(item.date)}
                    </p>
                    <button
                            type="button"
                            className="p-1 border-0 bg-transparent cursor-pointer"
                            onClick={() => onRequestDelete(item.id)}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                </div>
                <p className="inline-block py-1 px-4 text-xs rounded-full -text--on-primary-container -bg--primary-container">{item.category}</p>
            </div>
            <div>
                <h2 className="font-medium text-lg">{item.title}</h2>
                <ul>
                {/*display tasks by mapping values in tasks array*/} 
                {item.tasks.map((task, index) => (
                        <li 
                        className="py-1 font-normal"
                        key={index}>
                            <FontAwesomeIcon
                                icon={isChecked[index] ? checked : unchecked}
                                onClick={()=>toggleIcon(index)}
                                className="mr-2 -text--secondary"
                            />
                            {task.task}
                        </li>
                    ))}
                </ul>
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
            return cItem.category === currFilter || currFilter === 'All';
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

function retDateString(timestamp) {

    const cDate = new Date(timestamp);
    return cDate.toDateString() + ' at ' + cDate.getHours() + ':' + cDate.getMinutes() + ':' + cDate.getSeconds();

}