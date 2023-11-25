import noT from '../assets/noT.png'
function NoTransactions(){
    return(
        <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'column',
            marginBottom: '2rem',
        }}
        >  
           <img src={noT} style={{width: '300px', margin: '3rem'}}/>
           <p style={{fontSize: '1.5rem',textAlign: 'center'}}>
            You Have No Transactions Currently
           </p>
        </div>
    );
}


export default NoTransactions;