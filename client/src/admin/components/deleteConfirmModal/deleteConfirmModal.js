import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'white',
    borderRadius: '24px',
    outline: 'none !important',
    border: '2px solid #000',
    boxShadow: 2,
    p: 5,
};

export default function DeleteConfirmModal(props) {


    return (

        <Modal
            disablebackdropclick="true"
            open={props.open}
            onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                    props.handleClose();
                }
            }}
            aria-labelledby="modal-modal-title"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Are you sure you want to delete the selected items?
                </Typography>
                <div style={{ float: 'right' }}>
                    <Button disabled={props.loading} style={{ marginRight: '1rem' }} className="my-button" onClick={async () => { await props.yesButtonPressed(); }} >
                        <div>Yes</div>
                    </Button>
                    <Button disabled={props.loading} className="my-button" onClick={() => { props.handleClose(); }} >
                        <div>No</div>
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}
