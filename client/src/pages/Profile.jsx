import { Container, Heading, HStack, Image, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as InventoryService from "../../middleware/InventoryService";

function Profile(props) {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [userCoins, setUserCoins] = useState(0);

    const getInventoryItems = async () => {
        try {
            const userInventoryResponse = await InventoryService.getInventoryItemsByUserId(props.userData.id);
            console.log("Raw user inventory response:", userInventoryResponse);

            // Ensure userInventory is an array
            const userInventory = Array.isArray(userInventoryResponse) ? userInventoryResponse[0] : userInventoryResponse;
            console.log("Processed user inventory:", userInventory);

            if (userInventory?.coins) {
                setUserCoins(userInventory.coins);
            }

            // Check if userInventory.items exists and is an array
            if (Array.isArray(userInventory?.items)) {
                setInventoryItems(userInventory.items);
            } else {
                console.warn("No items found in user inventory.");
                setInventoryItems([]);
            }
        } catch (error) {
            console.error("Error in getInventoryItems:", error);
        }
    };

    useEffect(() => {
        if (props.userData?.id) {
            const fetchInventoryItems = async () => {
                await getInventoryItems();
            };
            fetchInventoryItems();
        }
    }, [props.userData]);

    return (
        <Container
            minW={"900px"}
            mt="12"
            borderRadius={20}
            boxShadow="0 1px 2px #ccc"
            bg="#fff"
            padding={"40px 20px 40px 20px"}
        >
            {props.userData.gender === "Feminino" ? (
                <Image h={"180px"} src={"../../images/girl.PNG"} />
            ) : (
                <Image h={"180px"} src={"../../images/boy.PNG"} />
            )}
            <Heading>{props.userData.nickname}</Heading>

            <VStack align={"start"} mt="8">
                <Heading size={"md"}>Inventário</Heading>
                <HStack>
                    {Array.isArray(inventoryItems) &&
                        inventoryItems.map((item) => (
                            <div key={item._id} className="store-rect">
                                <picture><img src={"../../images/" + item.image + ".png"} alt="" /></picture>
                                <span className={"store-item-name"} id={item._id}><p>{item.name}</p></span>
                            </div>
                        ))}
                </HStack>
            </VStack>
        </Container>
    );
}

export default Profile;