import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  Badge,
  Input,
  Container,
  Button,
  Flex,
} from "@chakra-ui/react";
import useRazorpay from "react-razorpay";

export default function Confirm({ googleResponse }) {
  const Razorpay = useRazorpay();
  const intervalRef = useRef();
  const orderid = JSON.parse(localStorage.getItem("order"));
  const obj = JSON.parse(localStorage.getItem("google"));
  console.log(obj);
  const tokenId = obj.tokenId;
  console.log(tokenId);
  const [statusInfo, setStatusInfo] = useState([]);
  const [rid, setRid] = useState(0);
  useEffect(() => {
    const getStatus = async () => {
      console.log(orderid);
      const result = await axios.post("http://localhost:8000/status", {
        idToken: tokenId,
        orderids: orderid,
      });
      setStatusInfo(result.data.orderstatus);
      if (result.data.rid) {
        setRid(result.data.rid);
        clearInterval(intervalRef.current);
      }
    };
    getStatus();
    intervalRef.current = setInterval(getStatus, 5000);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);
  const [paymentDone, setPaymentDone] = useState(false);
  const initiatePayment = () => {
    let amount = 0;
    statusInfo.forEach((order) => {
      console.log(order);
      amount += 50 * order.quantity;
    });
    console.log(amount);
    const options = {
      key: "rzp_test_Qb1YzJI1e6Wg6n", // Enter the Key ID generated from the Dashboard
      amount: amount,
      currency: "INR",
      name: "Prism Caterers",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: rid,
      handler: function (response) {
        setPaymentDone(true);
        const oldStatus = statusInfo;
        oldStatus.map((order) => {
          order.status = "Payment Received";
        });
        setStatusInfo(oldStatus);
        window.location.href = "http://localhost:3000/done";
      },
      prefill: {
        name: "Piyush Garg",
        email: "youremail@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new Razorpay(options);

    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });

    rzp1.open();
  };
  useEffect(() => {
    const setStatus = async () => {
      statusInfo.map(async (order) => {
        console.log(order);
        await axios.post("http://localhost:8000/setstatus", {
          idToken: tokenId,
          order_id: order.orderid,
        });
      });
    };
    if (paymentDone) setStatus();
  }, [paymentDone]);
  console.log(statusInfo);
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
            </Tr>
          </Thead>
          <Tbody>
            {statusInfo.map((item) => {
              console.log(item);
              return (
                <Tr>
                  <Td>{item.item}</Td>
                  <Td>{item.quantity}</Td>
                  <Td>
                    <Badge colorScheme="green">{item.status}</Badge>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <Button
          marginTop="50px"
          colorScheme="teal"
          size="lg"
          isDisabled={rid === 0}
          maxW="100px"
          onClick={initiatePayment}
        >
          Pay
        </Button>
      </Flex>
    </Container>
  );
}
