import { socket } from '../../services/backend/socket';


export default function ConnectionManager(){

    function connect(){
        socket.connect();
    }

    function disconnect(){
        socket.disconnect();
    }

    return(
        <>
            
        </>
    )

}