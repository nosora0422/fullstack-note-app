import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ImageItems from "../Items/Items";
import { getLegacyStorageKey, migrateLegacyData, readStorageItems, useScopedStorageKey } from "../../../utils/storage";
import { addUserItem, deleteUserItem, getUserItems, updateUserItem } from "../../../services/firestoreService";
import Dropdown from "../../Dropdown/Dropdown";

const CATEGORY_OPTIONS = [
  { value: "Personal", label: "Personal" },
  { value: "School", label: "School" },
  { value: "Work", label: "Work" },
];

export default function ImageList({ searchTerm }) {
  const [textVal, setTextVal] = useState('');
  const [items, setItems] = useState([]);
  const [titleVal, setTitleVal] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [categoryVal, setCategoryVal] = useState('Personal');
  const { key: storageKey, isReady, mode, user } = useScopedStorageKey("images");
  const [loadedStorageKey, setLoadedStorageKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const isCreateDisabled =
    titleVal.trim() === '' && textVal.trim() === '' && imagePath.trim() === '';

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
                migrateLegacyData(getLegacyStorageKey("images"), storageKey);
                setItems(readStorageItems(storageKey));
                setLoadedStorageKey(storageKey);
                return;
            }

            if (mode === "user" && user) {
                const firestoreItems = await getUserItems(user.uid, "images");
                setItems(firestoreItems);
                setLoadedStorageKey(storageKey);
            }
        } catch (error) {
            console.error("Failed to load images:", error);
            setLoadError("Could not load images. Please try refreshing the page.");
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
    if (titleVal !== '') {
      const newItem = {
        id: uuidv4(),
        title: titleVal,
        path: imagePath,
        note: textVal,
        category: categoryVal,
        date: Date.now(),
      };

      if (mode === "user" && user) {
        try {
          await addUserItem(user.uid, "images", newItem);
        } catch (error) {
          console.error("Failed to add image:", error);
          return;
        }
      }

      setItems([...items, newItem]);

      // reset input valuse after adding to the local storage
      setTitleVal('');
      setTextVal('');
      setImagePath('');
    }
  };

  const deleteItem = async (key) => {
    if (mode === "user" && user) {
      try {
        await deleteUserItem(user.uid, "images", key);
      } catch (error) {
        console.error("Failed to delete image:", error);
        return;
      }
    }

    setItems((currentItems) => currentItems.filter((item) => {
      return item.id !== key;
    }));
  };

  const updateItem = async (updatedItem) => {
    if (mode === "user" && user) {
      try {
        await updateUserItem(user.uid, "images", updatedItem);
      } catch (error) {
        console.error("Failed to update image:", error);
        return;
      }
    }

    setItems((currentItems) => currentItems.map((item) => {
      return item.id === updatedItem.id ? updatedItem : item;
    }));
  };

  return (
    <div className="w-full mt-8 lg:mt-11">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-4">
          <h1 className="text-3xl my-4">Image</h1>
          <div className="h-min p-4 rounded-md -bg--surface-container">
            <div className="flex flex-col gap-2">
              <Dropdown
                id="image-category"
                name="category"
                label="Image category"
                options={CATEGORY_OPTIONS}
                value={categoryVal}
                onChange={setCategoryVal}
              />
              <div className="flex items-center bg-white rounded-sm">
                <input
                  id="image-title"
                  aria-label="Image title"
                  className="w-full mx-2 py-2 px-2 border-none focus:ring-0 focus:outline-none focus-visible:outline-none"
                  value={titleVal}
                  onChange={(event) => {
                    setTitleVal(event.target.value);
                  }}
                  placeholder="Enter Title"
                />
              </div>
              <div className="flex items-center bg-white rounded-sm">
                <input
                  id="image-note"
                  aria-label="Image note"
                  className="w-full mx-2 py-2 px-2 border-none focus:ring-0 focus:outline-none focus-visible:outline-none"
                  value={textVal}
                  onChange={(event) => {
                    setTextVal(event.target.value);
                  }}
                  placeholder="Enter Note"
                />
              </div>
              <div className="flex flex-col justify-center min-h-24 items-center bg-white rounded-sm">
                {!!imagePath && <img src={imagePath} className=" w-3/5 object-center object-cover" alt={titleVal} />}
                <input
                  id="image-file"
                  aria-label="Upload image"
                  className="mx-auto px-4"
                  type="file"
                  accept="image/png, image/jpg, image/webp, image/jpeg, image/gif, image/svg"
                  onChange={(event) => {
                    // Get base64 from event image input
                    const reader = new FileReader();
                    const _files = event.target.files;
                    if (_files && _files.length > 0) {
                      reader.readAsDataURL(_files[0]);
                      reader.onload = () => {
                        setImagePath(reader.result);
                        // console.log("result", reader.result);
                      };
                    }
                    // console.log(event.target.value);
                    setImagePath(event.target.value);
                  }}
                  placeholder="Enter Image Path"
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
            <p className="w-full py-4 px-6 rounded-md -bg--surface-bright">Loading images...</p>
          ) : loadError ? (
            <p className="w-full py-4 px-6 rounded-md -bg--surface-bright">{loadError}</p>
          ) : (
            <ImageItems
              entries={items.filter((item) => {
                const searchResult = searchTerm.toLowerCase();
                // Check if searchText is in title or any task text
                return (
                  (item.title &&
                    item.title.toLowerCase().includes(searchResult)) ||
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
  );
}
