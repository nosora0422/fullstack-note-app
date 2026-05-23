export default function ButtonGroup({validList, currentState, callBackState}){
    const drawGroup = (item) => {
        return(
            <button
                key={item}
                className={`px-3 md:px-4 md:py-1 mr-2 border border-solid rounded-full md:text-md ${currentState === item ? '-border--tertiary font-medium -bg--tertiary -text--on-primary' : ' -bg--white -text--outline'}`}
                onClick={ ()=>{ callBackState(item) }}
            >{item}</button>
        );
    }

    return(
        <>
            {validList.map(drawGroup)}
        </>
    )
}