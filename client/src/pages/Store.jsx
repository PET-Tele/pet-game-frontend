import React, { useEffect, useState } from "react";
import { Badge, Button, Container, FormControl, FormLabel, Heading, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import * as GamesService from "../../middleware/GameService";
import * as InventoryService from "../../middleware/InventoryService";
import * as ItemService from "../../middleware/ItemService";
import EditModal from "../components/EditModal";

const Store = (props) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure()
    let gamesPlayed = [];
    const [userCoins, setUserCoins] = useState(0);

    const [itemsList, setItemsList] = useState([]);

    const [itemToEdit, setItemToEdit] = useState(null);
    const [itemWithEdit, setItemWithEdit] = useState(null);

    const [isCreatingNewItem, setIsCreatingNewItem] = useState(false);

    const setItemsAvailableList = async () => {
        try {
            const items = await ItemService.getAllItems(); // Fetch all items
            const userInventory = await fetchUserInventory(); // Fetch the user's inventory

            // console.log("Fetched items:", items);
            // console.log("Fetched user inventory:", userInventory);

            if (userInventory && userInventory.items?.length > 0) {
                // User has an inventory, filter out items already owned
                setUserCoins(userInventory.coins); // Set user's coins
                setItemsList(
                    Array.isArray(items)
                        ? items.filter(
                            (item) =>
                                !userInventory.items.some(
                                    (invItem) => invItem._id.toString() === item._id.toString()
                                )
                        )
                        : []
                );
            } else {
                // User has no inventory, show all items and set coins to 0

                setUserCoins(userInventory.coins);
                setItemsList(items); // Show all items
            }
        } catch (error) {
            console.error("Error in setItemsAvailableList:", error);
        }
    };

    const setPlayedGamesData = async () => {
        gamesPlayed = await GamesService.getGameProgressesByUserId(props.userData.id);

        let coins = 0;
        gamesPlayed.forEach((game) => {
            coins += game.userScore;
        });

        return coins;
    };

    const fetchUserInventory = async () => {
        try {
            const inventory = await InventoryService.getInventoryItemsByUserId(props.userData.id);
            return inventory;
        } catch (error) {
            if (error.message.includes("Not Found")) {
                console.warn("User inventory not found. Creating empty inventory with accumulated coins...");

                const userCoins = await setPlayedGamesData(); // Fetch accumulated coins
                const newInventory = await createNewInventory([], userCoins); // Create a new inventory with accumulated coins
                return newInventory; // Return the newly created inventory
            }
            throw error; // Re-throw other errors
        }
    };

    const createNewInventory = async (items, coins) => {
        const requestBody = {
            items: items.map((item) => item._id?.toString() || ""), // Ensure items are strings
            user_id: props.userData.id, // User ID
            coins: coins || 0, // Default to 0 if coins is undefined
        };

        return await InventoryService.postNewInventory(requestBody);
    };

    const updateExistingInventory = async (userInventory, item, remainingCoins) => {
        const updatedInventory = {
            user_id: props.userData.id, // User ID
            items: [
                ...userInventory.items.map((invItem) => invItem._id.toString()), // Ensure all items are strings
                item._id.toString(),
            ],
            coins: remainingCoins, // Deduct the item's price from the user's coins
        };
        return await InventoryService.updateInventory(userInventory._id, updatedInventory);
    };

    const handleBuyItem = async (item) => {
        const remainingCoins = userCoins - item.price;

        // Fetch the user's inventory
        let userInventory = await fetchUserInventory();

        if (!userInventory || userInventory.length === 0) {
            console.log("No inventory found. Creating a new one...");
            if (remainingCoins > 0) {
                await createNewInventory(item, remainingCoins);
                console.log("New inventory created:", userInventory);
            } else {
                console.log("New inventory created:", userInventory);
                await createNewInventory([], remainingCoins);
                console.warn("Not enough coins to buy the item.");
                return;
            }
        } else {
            // Check if the item is already in the inventory
            const isItemAlreadyBought = userInventory.items.some(
                (invItem) => invItem._id.toString() === item._id.toString()
            );

            if (isItemAlreadyBought) {
                console.warn("Item is already in the inventory. Cannot buy it again.");
                return;
            }

            // Update the existing inventory
            await updateExistingInventory(userInventory, item, remainingCoins);
        }

        // Deduct coins and update the UI
        setUserCoins(remainingCoins);
        setItemsList((prevItems) => prevItems.filter((i) => i._id !== item._id));
    };

    const buyItem = async (itemName, itemId) => {
        let errorDescription = "";

        return toast.promise(
            new Promise(async (resolve, reject) => {
                const item = itemsList.find((item) => item._id === itemId);
                if (item && userCoins >= item.price) {
                    try {
                        await handleBuyItem(item);
                        resolve(); // Resolve the promise if the item is successfully bought
                    } catch (error) {
                        console.error("Failed to buy item:", error);
                        errorDescription = "Ocorreu um erro ao tentar comprar o item. Tente novamente mais tarde."; // Reject with a custom error message
                        reject(errorDescription); // Reject with a custom error message
                    }
                } else if (!item) {
                    console.warn("Item not found.");
                    errorDescription = "O item selecionado não foi encontrado."; // Reject with a custom error message for missing item
                    reject(errorDescription); // Reject with a custom error message for missing item
                } else if (userCoins < item.price) {
                    console.warn("Not enough coins.");
                    errorDescription = `Você não tem moedas suficientes para comprar ${itemName}.`; // Reject with a custom error message for insufficient coins
                    reject(errorDescription); // Reject with a custom error message for insufficient coins
                }
            }),
            {
                success: {
                    title: "Compra realizada",
                    description: `${itemName} adquirido! Confira seu perfil`,
                    isClosable: true,
                    position: 'bottom-right',
                    variant: 'left-accent'
                },
                error: {
                    title: "Erro na compra",
                    description: errorDescription,
                    isClosable: true,
                    position: 'bottom-right',
                    variant: 'left-accent'
                },
                loading: {
                    title: "Compra em progresso",
                    description: "Aguarde...",
                    isClosable: true,
                    position: 'bottom-right',
                    variant: 'left-accent'
                },
            }
        );
    };

    const editItem = async () => {
        // console.log("Item to edit:", itemWithEdit);
        let errorDescription = "";
    
        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    // Ensure all fields have the correct data types
                    const updatedItem = {
                        category: itemWithEdit.category,
                        description: itemWithEdit.description,
                        image: itemWithEdit.image,
                        name: itemWithEdit.name,
                        price: parseFloat(itemWithEdit.price), // Convert price to a number
                    };
    
                    // console.log("Updating item with data:", updatedItem);
    
                    const response = await ItemService.updateItem(itemToEdit._id, updatedItem);
    
                    if (response && response.ok) {
                        console.log("Item updated successfully:", response);
                        onClose();
                        resolve(); // Resolve the promise if the item is successfully updated
                    } else {
                        throw new Error("Failed to update item");
                    }
                } catch (error) {
                    console.error("Failed to edit item:", error);
                    errorDescription = "Ocorreu um erro ao tentar editar o item. Tente novamente mais tarde."; // Custom error message
                    reject(errorDescription); // Reject with the error message
                }
            }),
            {
                success: {
                    title: "Edição realizada",
                    description: `${itemWithEdit.name} foi atualizado com sucesso!`,
                    isClosable: true,
                    position: "bottom-right",
                    variant: "left-accent",
                },
                error: {
                    title: "Erro na edição",
                    description: errorDescription,
                    isClosable: true,
                    position: "bottom-right",
                    variant: "left-accent",
                },
                loading: {
                    title: "Edição em progresso",
                    description: "Aguarde...",
                    isClosable: true,
                    position: "bottom-right",
                    variant: "left-accent",
                },
            }
        );
    };

    const addNewItem = async () => {
        let errorDescription = "";
        
        const optimisticItem = { ...itemWithEdit, _id: "temp_" + Date.now() }; // Fake ID for UI
        
        // add new item to list optimistically
        setItemsList(prev => [...prev, optimisticItem]); // Show immediately

        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    // Validate input fields
                    if (!itemWithEdit.name || !itemWithEdit.description || !itemWithEdit.image || !itemWithEdit.category || !itemWithEdit.price) {
                        throw new Error("Todos os campos são obrigatórios.");
                    }
    
                    if (parseFloat(itemWithEdit.price) <= 0) {
                        throw new Error("O preço deve ser maior que zero.");
                    }
    
                    // Check for duplicate name
                    const existingItems = await ItemService.getAllItems();
                    if (existingItems.some((item) => item.name === itemWithEdit.name.trim())) {
                        throw new Error("Já existe um item com este nome.");
                    }
    
                    // Ensure all fields have the correct data types
                    const newItem = {
                        category: itemWithEdit.category.trim(),
                        description: itemWithEdit.description.trim(),
                        image: itemWithEdit.image.trim(),
                        name: itemWithEdit.name.trim(),
                        price: parseFloat(itemWithEdit.price), // Convert price to a number
                    };
    
                    console.log("Adding new item with data:", newItem);
    
                    const response = await ItemService.postNewItem(newItem);
                    
                    if (response) {
                        console.log("Item added successfully:", response);
                        setItemsList(prev => prev.map(item => 
                            item._id === optimisticItem._id ? response : item
                        ));
    
                        onClose();
                        resolve(); // Resolve the promise if the item is successfully added
                    } else {
                        throw new Error("Failed to add new item");
                    }
                } catch (error) {
                    console.error("Failed to add new item:", error);
                    errorDescription = error.message || "Ocorreu um erro ao tentar adicionar o novo item. Tente novamente mais tarde."; // Custom error message
                    setItemsList(prev => prev.filter(item => item._id !== optimisticItem._id));
                    reject(errorDescription); // Reject with the error message
                }
            }),
            {
                success: {
                    title: "Item adicionado",
                    description: `${itemWithEdit.name} foi adicionado com sucesso!`,
                    isClosable: true,
                    position: "bottom-right",
                    variant: "left-accent",
                },
                error: {
                    title: "Erro ao adicionar item",
                    description: errorDescription,
                    isClosable: true,
                    position: "bottom-right",
                    variant: "left-accent",
                },
                loading: {
                    title: "Adicionando item",
                    description: "Aguarde...",
                    isClosable: true,
                    position: "bottom-right",
                    variant: "left-accent",
                },
            }
        );
    };

    useEffect(() => {
        if (props.userData?.id) {
            setItemsAvailableList();
        }
    }, [props.userData]);

    return (
        <Container
            minW={"900px"}
            mt="12"
            borderRadius={20}
            boxShadow="0 1px 2px #ccc"
            bg="white"
            padding={"40px 20px 40px 20px"}
            align="center"
            justify="center"
            overflowY={"none"}
        >
            <HStack justifyContent="space-between" width={"700px"}>
                <Heading>Loja</Heading>
                <Badge variant={'solid'} style={{ padding: "4px", backgroundColor: "#efbf04", display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <i className="fa fa-coins"></i>
                    <p style={{ fontSize: "15px" }}>{userCoins} moedas</p>
                </Badge>
            </HStack>
            <VStack mt="12" gap="40px" overflowY={"auto"} height={"300px"}>
                <HStack gap={"40px"} wrap={"wrap"} width={"52vw"}>
                    {Array.isArray(itemsList) && itemsList.map((item) => {
                        if (props.userData.isAdmin) {
                            return (
                                <div key={item._id} className="store-rect" onClick={() => {
                                    setItemToEdit(item);
                                    setItemWithEdit(item);
                                    setIsCreatingNewItem(false);
                                    onOpen();
                                }}>
                                    <span className="edit-btn" ><i className="fa fa-pencil"></i></span>
                                    <picture><img src={"../../images/" + item.image + ".png"} alt="" /></picture>
                                    <span className={"store-item-name"} id={item._id}><p>{item.name}</p></span>
                                </div>
                            );
                        } else {
                            return (
                                <div key={item._id} className="store-rect" onClick={() => buyItem(item.name, item._id)}>
                                    <span className="store-price"><i className="fa fa-coins"></i> {item.price}</span>
                                    <picture><img src={"../../images/" + item.image + ".png"} alt="" /></picture>
                                    <span className={"store-item-name"} id={item._id}><p>{item.name}</p></span>
                                </div>
                            );
                        }
                    })}
                    {(props.userData.isAdmin) &&
                        (
                            <div key="novo" className="store-rect" onClick={() => {
                                setIsCreatingNewItem(true);
                                setItemToEdit(null);
                                setItemWithEdit(null);
                                onOpen();
                            }}>
                                <picture style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <i className="fa fa-plus" style={{ fontSize: "50px", color: "#efbf04" }}></i>
                                </picture>
                            </div>
                        )
                    }
                </HStack>
            </VStack>

            <EditModal
                isOpen={isOpen}
                onClose={onClose}
                title={itemToEdit? "Editar "+itemToEdit?.name : "Adicionar novo item"}
                fields={[
                    {
                        label: "Nome",
                        placeholder: itemToEdit?.name,
                        value: itemWithEdit?.name || "",
                        onChange: (value) => setItemWithEdit({ ...itemWithEdit, name: value }),
                    },
                    {
                        label: "Preço",
                        placeholder: itemToEdit?.price,
                        value: itemWithEdit?.price || "",
                        type: "number",
                        onChange: (value) => setItemWithEdit({ ...itemWithEdit, price: value }),
                    },
                    {
                        label: "Descrição",
                        placeholder: itemToEdit?.description,
                        value: itemWithEdit?.description || "",
                        onChange: (value) => setItemWithEdit({ ...itemWithEdit, description: value }),
                    },
                    {
                        label: "Imagem",
                        placeholder: itemToEdit?.image,
                        value: itemWithEdit?.image || "",
                        onChange: (value) => setItemWithEdit({ ...itemWithEdit, image: value }),
                    },
                    {
                        label: "Categoria",
                        placeholder: itemToEdit?.category,
                        value: itemWithEdit?.category || "",
                        onChange: (value) => setItemWithEdit({ ...itemWithEdit, category: value }),
                    },
                ]}
                onSubmit={isCreatingNewItem ? addNewItem : editItem}
            />
        </Container>
    );
};

export default Store;
