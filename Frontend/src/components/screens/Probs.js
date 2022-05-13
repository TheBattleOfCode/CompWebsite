import React, { useState } from 'react';
import { Modal } from "react-bootstrap";
import probService from '../../services/prob.service';

export default function Prob({ prob }) {
    const [quantity, setQuantity] = useState(1)
    const [varient, setVarient] = useState('small')
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (
        <div style={{ margin: '40px' }} className="shadow-lg p-3 mb-5 bg-white rounded">
            <div onClick={handleShow} >
                <h1>{prob.title}</h1>

            </div>

            <div className="flex-container">

                <div className='w-100 m-1'>
                    <p>score :{prob.score} </p>

                </div>

                <div className='w-100 m-1'>
                    <p>type : {prob.type} </p>



                </div>

                <div className='w-100 m-1'>
                    <button className="btn btn-outline-primary" onClick={handleShow}>
                        View
                    </button>
                </div>



            </div>






            <Modal show={show} onHide={handleClose}>
                <Modal.Header >
                    <Modal.Title>{prob.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Score : {prob.score}</p>
                    <hr/>
                    <p>Description : {prob.description}</p>
                </Modal.Body>

                <Modal.Footer>
                    <button className="btn" onClick={handleClose}>Close</button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}
