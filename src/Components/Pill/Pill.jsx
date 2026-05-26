const CATEGORY_STYLES = {
    personal: "-bg--accent-pink -text--on-accent-pink",
    work: "-bg--accent-blue -text--on-accent-blue",
    school: "-bg--accent-amber -text--on-accent-amber",
};

const CATEGORY_LABELS = {
    personal: "Personal",
    work: "Work",
    school: "School",
};

export default function Pill({ category }) {
    const normalizedCategory = String(category || '').trim().toLowerCase();
    const pillStyle = CATEGORY_STYLES[normalizedCategory] || "-bg--surface-container-highest -text--main-font-color";
    const label = CATEGORY_LABELS[normalizedCategory] || category || "Uncategorized";

    return (
        <span className={`inline-block py-1 px-4 text-xs rounded-full font-normal ${pillStyle}`}>
            {label}
        </span>
    );
}
