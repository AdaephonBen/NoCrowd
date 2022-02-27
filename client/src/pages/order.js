import React, { useState, useEffect } from "react";
import axios from "axios";
import GoogleLogin from "react-google-login";
import {
  Flex,
  Container,
  Box,
  Heading,
  Table,
  Thead,
  Tr,
  Tbody,
  Td,
  Th,
  Badge,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Input,
  Button,
} from "@chakra-ui/react";

export default function Order({ setOrderid, sgr }) {
  const [googleResponse, setGoogleResponse] = useState({});
  if (Object.keys(googleResponse).length === 0) {
    return (
      <GoogleLogin
        clientId="1088298445038-r77cabomgatt7t9nubrdpfc9oggqnkah.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={(response) => setGoogleResponse(response)}
        onFailure={setGoogleResponse}
        cookiePolicy={"single_host_origin"}
      />
    );
  } else {
    sgr(googleResponse);
    localStorage.setItem("google", JSON.stringify(googleResponse));
    return <OrderComponent google={googleResponse} setOrderid={setOrderid} />;
  }
}

const OrderComponent = ({ setOrderid, google }) => {
  const googleResponse = google;
  const [items, setItems] = useState([]);
  console.log(items);
  useEffect(() => {
    async function fetchData() {
      const result = await axios.post("http://localhost:8000/items", {
        idToken: googleResponse.tokenId,
      });
      setItems(result.data);
    }
    fetchData();
  }, []);
  const caterers = ["Prism", "Tibb's Frankies", "Nescafe"];
  const [order, setOrder] = useState({});
  const handleOnChange = (e) => {
    console.log(e.target.name);
    const { value, name } = e.target;
    let currentOrder = order;
    currentOrder[name] = value;
    console.log(currentOrder);
    setOrder(currentOrder);
  };
  const placeOrder = async () => {
    const response = await axios.post("http://localhost:8000/order", {
      order: order,
      idToken: googleResponse.tokenId,
    });
    console.log(response.data);
    setOrderid(response.data);
    localStorage.setItem("order", JSON.stringify(response.data));
    window.location.href = "http://localhost:3000/confirm";
  };
  return (
    <Container maxWidth="120ch" paddingTop={10}>
      <Tabs>
        <TabList>
          {caterers.map((caterer) => (
            <Tab>{caterer}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {caterers.map((caterer) => (
            <TabPanel padding="0">
              <Flex direction="column">
                <Box paddingY="20px">
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Item</Th>
                        <Th>Price</Th>
                        <Th>Rating</Th>
                        <Th>Order</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {items.map((item) => {
                        if (item.caterer_name === caterer) {
                          return (
                            <Tr>
                              <Td>{item.name}</Td>
                              <Td>{item.price}</Td>
                              <Td>
                                <Badge colorScheme="green">
                                  {item.rating} / 5
                                </Badge>
                              </Td>
                              <Td>
                                <Input
                                  placeholder="Amount"
                                  name={item.id}
                                  maxW={20}
                                  size="sm"
                                  onChange={handleOnChange}
                                />
                              </Td>
                            </Tr>
                          );
                        }
                      })}
                    </Tbody>
                  </Table>
                </Box>
                <Button
                  marginTop="20px"
                  size="lg"
                  colorScheme="orange"
                  alignSelf="center"
                  onClick={placeOrder}
                >
                  Order
                </Button>
              </Flex>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
};
