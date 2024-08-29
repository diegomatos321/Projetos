import { useState } from "@wordpress/element";
import { useDispatch, useSelect } from '@wordpress/data';
import { Button, Modal } from '@wordpress/components';
import { store as coreDataStore } from "@wordpress/core-data";
import { Form } from "./components/form";
 
export default function CreatePageButton() {
    const [isOpen, setOpen] = useState( false );
    const openModal = () => setOpen( true );
    const closeModal = () => setOpen( false );
    return (
        <>
            <Button onClick={ openModal } variant="primary">
                Create a new Page
            </Button>
            { isOpen && (
                <Modal onRequestClose={ closeModal } title="Create a new page">
                    <CreatePageForm
                        onCancel={ closeModal }
                        onSaveFinished={ closeModal }
                    />
                </Modal>
            ) }
        </>
    );
}
 
export function CreatePageForm( { onCancel, onSaveFinished } ) {
    const [title, setTitle] = useState();

    const { saveEntityRecord } = useDispatch( coreDataStore );
    const handleSave = async () => {
        const savedRecord = await saveEntityRecord(
            'postType',
            'page',
            { title, status: 'publish' }
        );
        if ( savedRecord ) {
            onSaveFinished();
        }
    };

    const { lastError, isSaving } = useSelect(
        ( select ) => ( {
            // Notice the missing pageId argument:
            lastError: select( coreDataStore )
                .getLastEntitySaveError( 'postType', 'page' ),
            // Notice the missing pageId argument
            isSaving: select( coreDataStore )
                .isSavingEntityRecord( 'postType', 'page' ),
        } ),
        []
    );
    
    return (
        <Form
            title={ title }
            onChangeTitle={ setTitle }
            hasEdits={ !!title }
            onSave={ handleSave }
            onCancel={ onCancel }
            lastError={ lastError }
            isSaving={ isSaving }
        />
    );
}