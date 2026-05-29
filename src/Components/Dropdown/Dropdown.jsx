import { useEffect, useId, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function Dropdown({
    id,
    name,
    label,
    options,
    value,
    onChange,
}) {
    const listboxId = useId();
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((option) => option.value === value) || options[0];

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (!dropdownRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleDocumentClick);

        return () => {
            document.removeEventListener("mousedown", handleDocumentClick);
        };
    }, []);

    const selectOption = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const handleKeyDown = (event) => {
        const currentIndex = options.findIndex((option) => option.value === value);

        if (event.key === "Escape") {
            setIsOpen(false);
            return;
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsOpen((currentValue) => !currentValue);
            return;
        }

        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
            return;
        }

        event.preventDefault();
        setIsOpen(true);

        const nextIndex = event.key === "ArrowDown"
            ? Math.min(currentIndex + 1, options.length - 1)
            : Math.max(currentIndex - 1, 0);

        selectOption(options[nextIndex].value);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <input type="hidden" id={id} name={name} value={value}/>
            <button
                type="button"
                className="flex w-full items-center justify-between rounded-md bg-white py-2 px-4 text-left -text--main-font-color hover:-border--outline focus:ring-0 focus:outline-none focus-visible:outline-none"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={listboxId}
                aria-label={label}
                onClick={() => setIsOpen((currentValue) => !currentValue)}
                onKeyDown={handleKeyDown}
            >
                <span>{selectedOption.label}</span>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`ml-3 text-sm -text--icon-grey transition-transform ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                />
            </button>
            {isOpen &&
                <ul
                    id={listboxId}
                    className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-auto rounded-md -border--outline-variation bg-white py-1 shadow-lg"
                    role="listbox"
                    aria-label={label}
                >
                    {options.map((option) => {
                        const isSelected = option.value === value;

                        return (
                            <li
                                key={option.value}
                                className={`cursor-pointer px-4 py-2 text-sm ${isSelected ? "-bg--primary-container -text--on-primary-container font-medium" : "-text--main-font-color hover:-bg--surface-container"}`}
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => selectOption(option.value)}
                            >
                                {option.label}
                            </li>
                        );
                    })}
                </ul>
            }
        </div>
    );
}
