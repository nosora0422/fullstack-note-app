export default function ButtonGroup({validList, currentState, callBackState, label = "Options"}){
    const drawGroup = (item) => {
        return(
            <button
                type="button"
                key={item}
                className={`px-3 md:px-4 md:py-1 mr-2 border border-solid rounded-full md:text-md ${currentState === item ? '-border--tertiary font-medium -bg--tertiary -text--on-primary' : ' -bg--white -text--main-font-color'}`}
                aria-pressed={currentState === item}
                onClick={ ()=>{ callBackState(item) }}
            >{item}</button>
        );
    }

    return(
        <div role="group" aria-label={label}>
            {validList.map(drawGroup)}
        </div>
    )
}
