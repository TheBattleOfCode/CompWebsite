//test to create modal for test gen prob
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Modal } from "react-bootstrap";
const TestGenProbModal = () => {



    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div style={{ margin: '40px' }} className="shadow-lg p-3 mb-5 bg-white rounded">
            <div onClick={handleShow} >
                <h1>TestGenProbModal</h1>

            </div>

            <div className="flex-container">

                <div className='w-100 m-1'>
                    <p>score : 100</p>

                </div>

                <div className='w-100 m-1'>
                    <p>type : NumberGen</p>



                </div>

                <div className='w-100 m-1'>
                    <button className="btn btn-outline-primary" >
                        <a href="/ProbNumberGen/627ec7ff13603a13d16be928">GO To test</a>
                    </button>
                </div>



            </div>






            <Modal show={show} onHide={handleClose}>
                <Modal.Header >
                    <Modal.Title>hi</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Score : </p>
                    <hr />
                    <p>Description : </p>
                </Modal.Body>

                <Modal.Footer>
                    <button className="btn" onClick={handleClose}>Close</button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}
export default TestGenProbModal;
