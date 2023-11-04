import {Button, Form, FormControl, InputGroup} from "react-bootstrap";
import {useState} from "react";

const AddConversation = ({ sendMessage }) => {
    const [message, setMessage] = useState('');
    const [destination, setDestination] = useState('');


    return <Form onSubmit={e =>{
        e.preventDefault()
        sendMessage(message, destination)
        setMessage('')
    }}>
        <InputGroup>
            <FormControl placeholder='message...' onChange={e => setMessage(e.target.value)} value={message} />
            <FormControl placeholder='nouvelle destination' onChange={e => setDestination(e.target.value)} value={destination} />
            <InputGroup>
                <Button variant='primary' type='submit' disabled={!message || !destination}>Send</Button>
            </InputGroup>
        </InputGroup>
    </Form>
}

export default AddConversation;