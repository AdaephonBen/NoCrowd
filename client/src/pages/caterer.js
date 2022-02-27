import React, { useState, useRef, useEffect } from "react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import axios from "axios";
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

function Caterer() {
  const [orders, setOrders] = useState([]);
  const intervalRef = useRef();
  const getInfo = async () => {
    const res = await axios.post("http://localhost:8000/caterer", {
      idToken: JSON.parse(localStorage.getItem("google")).tokenId,
    });
    setOrders(res.data);
  };

  useEffect(() => {
    const getInfo = async () => {
      const res = await axios.post("http://localhost:8000/caterer", {
        idToken: JSON.parse(localStorage.getItem("google")).tokenId,
      });
      setOrders(res.data);
    };

    getInfo();
    intervalRef.current = setInterval(getInfo, 5000);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);
  const handleAccept = async (id) => {
    await axios.post("http://localhost:8000/confirm", {
      idToken: JSON.parse(localStorage.getItem("google")).tokenId,
      order_id: id,
    });
    await getInfo();
  };
  const handleReject = async (id) => {
    await axios.post("http://localhost:8000/cancel", {
      idToken: JSON.parse(localStorage.getItem("google")).tokenId,
      order_id: id,
    });
    await getInfo();
  };

  return (
    <Container>
      <Flex
        paddingTop="20px"
        flexDirection="column"
        maxW="lg"
        alignItems="center"
      >
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Item</Th>
              <Th>Quantity</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((item) => {
              return (
                <Tr>
                  <Td>{item.name}</Td>
                  <Td>{item.quantity}</Td>
                  <Td>
                    <Badge colorScheme="green">{item.status}</Badge>
                  </Td>
                  <Td
                    style={item.status !== "ordered" ? { display: "none" } : {}}
                  >
                    <IconButton
                      colorScheme="green"
                      aria-label="Search database"
                      icon={<CheckIcon />}
                      size="sm"
                      onClick={() => {
                        handleAccept(item.id);
                      }}
                    />{" "}
                    <IconButton
                      colorScheme="red"
                      aria-label="Search database"
                      icon={<CloseIcon />}
                      size="sm"
                      onClick={() => {
                        handleReject(item.id);
                      }}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Flex>
    </Container>
  );
}

export default Caterer;

