export default function ButtonGroup({validList, currentState, callBackState}){
    const drawGroup = (item) => {
        return(
            <button
                key={item}
                className={(currentState === item) ? 'px-4 py-1 mr-2 border border-solid -border--tertiary rounded-full -bg--tertiary -text--on-primary' : 'px-4 py-1 mr-2 border border-solid rounded-full -bg--white -text--outline'}
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