import { useState } from "react";
import ButtonGroup from "../../ButtonGroup/ButtonGroup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faSquareCheck as checked }from '@fortawesome/free-solid-svg-icons';
import { faSquare as unchecked} from '@fortawesome/free-regular-svg-icons';

export default function ToDoItems({ entries, delRef }){
    const [currFilter, setCurrFilter] = useState('all');
    const filterList = ['all', 'school', 'work', 'personal'];

    const [currSort, setCurrSort] = useState('Date');
    const sortList = ['date', 'text'];

    const fEntries = sortAndFilterList(entries, currFilter, currSort);

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
                {fEntries.length > 0 ? fEntries.map((item) => (<Task key={item.id} item={item} delRef={delRef} />)) : <li className="col-span-12 w-full py-4 px-6 rounded-md -bg--surface-bright">No items to display</li>}
            </ul>
        </div>

    );
}

function Task({ item, delRef }){
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
        <li className="col-span-12 lg:col-span-6 flex flex-col gap-3 w-full py-4 px-6 rounded-md -bg--surface-bright" key={item.id}>
            <div className="text-xs">
                {retDateString(item.date)}
            </div>
            <div className="flex justify-between items-center">
                <p className="inlint-block py-2 px-4 text-xs rounded-full -text--on-primary-container -bg--primary-container">{item.category}</p>
                <button
                    type="button"
                    className="p-2 border-0 bg-transparent cursor-pointer"
                    onClick={() => delRef(item.id)}
                >
                <FontAwesomeIcon icon={faTrashCan} />
                </button>
            </div>
            <h2 className="font-medium text-xl">{item.title}</h2>
            <ul>
            {/*display tasks by mapping values in tasks array*/} 
            {item.tasks.map((task, index) => (
                    <li 
                    className="py-1 font-light"
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
        </li>
    )
}

function sortAndFilterList(entries, currFilter, currSort) {
    // console.log('Entries:', entries);
    // console.log('Current Filter:', currFilter);
    // console.log('Current Sort:', currSort);
    return entries
        .filter((cItem) => {
            return cItem.category === currFilter || currFilter === 'all';
        })
        .sort((a, b) => {
            if (currSort === "text") {
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