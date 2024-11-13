function MessageBlock({message}){
    return(
        <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
            <p>{message}</p>
        </div>
    );
}

export default MessageBlock;