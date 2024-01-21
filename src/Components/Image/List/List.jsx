import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ImageItems from "../Items/Items";

export default function ImageList({ searchTerm }) {
  const [textVal, setTextVal] = useState('');
  const [items, setItems] = useState([]);
  const [titleVal, setTitleVal] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [categoryVal, setCategoryVal] = useState('Personal');

  //get data from localstorage
  useEffect(() => {
    const storedData = localStorage.getItem('image_data');
    // console.log(storedData);

    if (storedData !== null) {
      setItems(JSON.parse(storedData));
    }
  }, []);

  //save data to localstorage whenver items updated
  useEffect(() => {
    localStorage.setItem('image_data', JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (titleVal !== '') {
      const newItem = {
        id: uuidv4(),
        title: titleVal,
        path: imagePath,
        note: textVal,
        category: categoryVal,
        date: Date.now(),
      };

      setItems([...items, newItem]);

      // reset input valuse after adding to the local storage
      setTitleVal('');
      setTextVal('');
      setImagePath('');
    }
  };

  const deleteItem = (key) => {
    let filteredItems = items.filter((item) => {
      return item.id !== key;
    });

    setItems(filteredItems);
  };

  return (
    <div className="w-full mt-8 lg:mt-11">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-4">
          <h1 className="text-3xl my-4">Image</h1>
          <div className="h-min p-4 rounded-md -bg--surface-container">
            <div className="flex flex-col gap-2">
              <select
                className="w-full py-2 px-4 border-none rounded-sm focus: outline-0"
                value={categoryVal}
                onChange={(event) => {
                  setCategoryVal(event.target.value);
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
                  placeholder="Enter Title"
                />
              </div>
              <div className="flex flex-col justify-center min-h-24 items-center bg-white rounded-sm">
                {!!imagePath && <img src={imagePath} className=" w-3/5 object-center object-cover" alt={titleVal} />}
                <input 
                  name="input-box" 
                  value={imagePath} 
                  hidden
                />
                <input
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
              <div className="flex items-center bg-white rounded-sm">
                <input
                  className="w-full mx-2 py-2 px-2 border-none focus: outline-0"
                  value={textVal}
                  onChange={(event) => {
                    setTextVal(event.target.value);
                  }}
                  placeholder="Enter Note"
                />
              </div>
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
          />
        </div>
      </div>
    </div>
  );
}
