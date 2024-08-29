import { useState } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import { Button, Modal } from '@wordpress/components';
import { Form } from "./components/form";

export default function PageEditButton({ pageId }) {
    const [isOpen, setOpen] = useState(false);
    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);
    return (
        <>
            <Button
                onClick={openModal}
                variant="primary"
            >
                Edit
            </Button>
            {isOpen && (
                <Modal onRequestClose={closeModal} title="Edit page">
                    <EditPageForm
                        pageId={pageId}
                        onCancel={closeModal}
                        onSaveFinished={closeModal}
                    />
                </Modal>
            )}
        </>
    )
}

function EditPageForm({ pageId, onCancel, onSaveFinished }) {
    const { isSaving, hasEdits, lastError, page } = useSelect(
        select => ({
            page: select(coreDataStore).getEditedEntityRecord('postType', 'page', pageId),
            lastError: select(coreDataStore).getLastEntitySaveError('postType', 'page', pageId),
            isSaving: select(coreDataStore).isSavingEntityRecord('postType', 'page', pageId),
            hasEdits: select(coreDataStore).hasEditsForEntityRecord('postType', 'page', pageId),
        }),
        [pageId]
    )

    const { editEntityRecord } = useDispatch(coreDataStore);
    const { saveEditedEntityRecord } = useDispatch(coreDataStore);

    const handleChange = (title) => editEntityRecord('postType', 'page', pageId, { title });
    const handleSave = async () => {
        const updatedRecord = await saveEditedEntityRecord('postType', 'page', pageId);
        if (updatedRecord) {
            onSaveFinished();
        }
    }

    return (
        <Form
            title={page.title}
            onChangeTitle={handleChange}
            hasEdits={hasEdits}
            lastError={lastError}
            isSaving={isSaving}
            onCancel={onCancel}
            onSave={handleSave}
        />
    );
}