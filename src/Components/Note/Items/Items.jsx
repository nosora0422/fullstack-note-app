import { useState } from "react";
import ButtonGroup from "../../ButtonGroup/ButtonGroup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import Pill from "../../Pill/Pill";

export default function NoteItems({ entries, delRef, updateRef }){
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
                        label="Filter notes by category"
                    />
                </div>
                <div className="mb-2">
                    <ButtonGroup
                        validList={sortList}
                        currentState={currSort}
                        callBackState={setCurrSort}
                        label="Sort notes"
                    />
                </div>
            </div>
            <ul className="masonry-grid">
                {fEntries.length > 0 ? fEntries.map((item) => (<Note key={item.id} item={item} onRequestDelete={setPendingDeleteId} onSaveItem={updateRef} />)) : <li className="w-full py-4 px-6 rounded-md -bg--surface-bright">No items to display</li>}
            </ul>
            <ConfirmationModal
                isOpen={Boolean(pendingDeleteId)}
                message="Delete this note?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setPendingDeleteId(null)}
            />
        </div>

    );
}

function Note({ item, onRequestDelete, onSaveItem }){
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(item.title);
    const [editNote, setEditNote] = useState(item.note);

    const startEditing = () => {
        setEditTitle(item.title);
        setEditNote(item.note);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setEditTitle(item.title);
        setEditNote(item.note);
        setIsEditing(false);
    };

    const saveEditing = () => {
        const trimmedTitle = editTitle.trim();

        if (trimmedTitle === '') {
            return;
        }

        onSaveItem({
            ...item,
            title: trimmedTitle,
            note: editNote,
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
                                aria-label="Edit note"
                            >
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                        }
                        <button
                            type="button"
                            className="p-1 border-0 bg-transparent cursor-pointer"
                            onClick={() => onRequestDelete(item.id)}
                            aria-label="Delete note"
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <Pill category={item.category} />
            </div>
            <div>
                {isEditing ? (
                    <>
                        <input
                            aria-label="Edit note title"
                            className="w-full mb-2 py-2 px-2 border-0 rounded-sm focus:border-transparent focus:ring-0 focus:outline-none focus-visible:outline-none"
                            value={editTitle}
                            onChange={(event) => setEditTitle(event.target.value)}
                            placeholder="Enter Title"
                        />
                        <textarea
                            aria-label="Edit note text"
                            className="w-full min-h-32 py-2 px-2 border-0 rounded-sm focus:border-transparent focus:ring-0 focus:outline-none focus-visible:outline-none font-Roboto"
                            value={editNote}
                            onChange={(event) => setEditNote(event.target.value)}
                            placeholder="Enter Note"
                        />
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="button button-secondary"
                                onClick={cancelEditing}
                                aria-label="Cancel editing note"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="button button-primary"
                                onClick={saveEditing}
                                aria-label="Save note"
                            >
                                Save
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="font-medium text-lg">{item.title}</h2>
                        <p className="font-normal whitespace-pre-wrap">{item.note}</p>
                    </>
                )}
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

function retDateString(timestamp) {

    const cDate = new Date(timestamp);
    return cDate.toDateString() + ' at ' + cDate.getHours() + ':' + cDate.getMinutes() + ':' + cDate.getSeconds();

}
