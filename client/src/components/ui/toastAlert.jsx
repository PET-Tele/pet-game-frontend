import { createStandaloneToast } from "@chakra-ui/react";

export function toastAlert(title, description, status) {
    const { toast } = createStandaloneToast();
    toast({
        title: title,
        description: description,
        status: status,
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
    });
}