import { useState } from "react";
import ButtonGroup from "../../ButtonGroup/ButtonGroup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import Pill from "../../Pill/Pill";
import Dropdown from "../../Dropdown/Dropdown";

const SORT_OPTIONS = [
    { value: "Creation Date", label: "Creation Date" },
    { value: "Title", label: "Title" },
];

const CATEGORY_OPTIONS = [
    { value: "Personal", label: "Personal" },
    { value: "School", label: "School" },
    { value: "Work", label: "Work" },
];

export default function ImageItems({ entries, delRef, updateRef }){
    const [currFilter, setCurrFilter] = useState('All');
    const filterList = ['All', 'School', 'Work', 'Personal'];

    const [currSort, setCurrSort] = useState('Creation Date');
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
                        label="Filter images by category"
                    />
                </div>
                <div className="mb-2 w-full sm:w-48">
                    <Dropdown
                        id="image-sort"
                        name="image-sort"
                        label="Sort images"
                        options={SORT_OPTIONS}
                        value={currSort}
                        onChange={setCurrSort}
                        type="secondary"
                    />
                </div>
            </div>
            <ul className="masonry-grid">
                {fEntries.length > 0 ? fEntries.map((item) => (<DrawImage key={item.id} item={item} onRequestDelete={setPendingDeleteId} onSaveItem={updateRef} />)) : <li className="w-full py-4 px-6 rounded-md -bg--surface-bright">No items to display</li>}
            </ul>
            <ConfirmationModal
                isOpen={Boolean(pendingDeleteId)}
                message="Delete this image entry?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setPendingDeleteId(null)}
            />
        </div>

    );
}

function DrawImage({ item, onRequestDelete, onSaveItem }){
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(item.title);
    const [editCategory, setEditCategory] = useState(item.category || 'Personal');
    const [editPath, setEditPath] = useState(item.path);
    const [editNote, setEditNote] = useState(item.note);

    const startEditing = () => {
        setEditTitle(item.title);
        setEditCategory(item.category || 'Personal');
        setEditPath(item.path);
        setEditNote(item.note);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setEditTitle(item.title);
        setEditCategory(item.category || 'Personal');
        setEditPath(item.path);
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
            category: editCategory,
            path: editPath,
            note: editNote,
        });
        setIsEditing(false);
    };

    const handleEditImageChange = (event) => {
        const files = event.target.files;

        if (!files || files.length === 0) {
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
            setEditPath(reader.result);
        };
    };

    return(
        <li className="masonry-grid-item gap-2 py-4 px-4 rounded-md -bg--surface-container" key={item.id}>
            <div>
                <div className="flex justify-between items-center">
                    <Pill category={item.category}/>
                    <div className="flex items-center gap-1">
                        {!isEditing &&
                            <button
                                type="button"
                                className="button-icon"
                                onClick={startEditing}
                                aria-label="Edit image entry"
                            >
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                        }
                        <button
                            type="button"
                            className="button-icon"
                            onClick={() => onRequestDelete(item.id)}
                            aria-label="Delete image entry"
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
            </div>
            <div>
                {isEditing ? (
                    <div className="flex flex-col gap-2">
                        <input
                            aria-label="Edit image title"
                            className="w-full py-2 px-2 border-0 rounded-sm focus:border-transparent focus:ring-0 focus:outline-none focus-visible:outline-none"
                            value={editTitle}
                            onChange={(event) => setEditTitle(event.target.value)}
                            placeholder="Enter Title"
                        />
                        <Dropdown
                            id={`image-category-${item.id}`}
                            name="category"
                            label="Edit image category"
                            options={CATEGORY_OPTIONS}
                            value={editCategory}
                            onChange={setEditCategory}
                        />
                        <input
                            aria-label="Edit image note"
                            className="w-full py-2 px-2 border-0 rounded-sm focus:border-transparent focus:ring-0 focus:outline-none focus-visible:outline-none"
                            value={editNote}
                            onChange={(event) => setEditNote(event.target.value)}
                            placeholder="Enter Note"
                        />
                        <div className="flex flex-col justify-center min-h-24 items-center bg-white rounded-sm">
                            {!!editPath && <img className="w-full max-w-96 mx-auto rounded-sm object-cover" src={editPath} alt={editTitle} />}
                            <input
                                aria-label="Replace image"
                                className="mx-auto px-4 py-2"
                                type="file"
                                accept="image/png, image/jpg, image/webp, image/jpeg, image/gif, image/svg"
                                onChange={handleEditImageChange}
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="button button-secondary"
                                onClick={cancelEditing}
                                aria-label="Cancel editing image entry"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="button button-primary"
                                onClick={saveEditing}
                                aria-label="Save image entry"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <h2 className="font-medium text-lg">{item.title}</h2>
                            <p className="font-normal">{item.note}</p>
                        </div>
                        <img className="w-full max-w-96 mx-auto rounded-sm object-cover" src={item.path} alt={item.title} />
                        
                    </div>
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
            if (currSort === "Title") {
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
