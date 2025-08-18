import React from "react";
import PropTypes from "prop-types";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Button,
} from "@chakra-ui/react";

function EditModal({ isOpen, onClose, title, fields, onSubmit }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        {fields.map((field, index) => (
                            <div key={index}>
                                <FormLabel>{field.label}:</FormLabel>
                                <Input
                                    variant="flushed"
                                    placeholder={field.placeholder}
                                    value={field.value}
                                    type={field.type || "text"}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    mb={4}
                                />
                            </div>
                        ))}
                        <Button
                            type="submit"
                            colorScheme="blue"
                            mt={4}
                            onClick={onSubmit}
                        >
                            Salvar
                        </Button>
                    </FormControl>
                </ModalBody>
                <ModalFooter />
            </ModalContent>
        </Modal>
    );
}

EditModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            onChange: PropTypes.func.isRequired,
        })
    ).isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default EditModal;