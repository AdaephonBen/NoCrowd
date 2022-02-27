import React, { useState, useEffect } from "react";
import axios from "axios";
import hero from "../images/hero.png";
import {
  Container,
  Stack,
  Heading,
  Text,
  Button,
  Flex,
  Image,
} from "@chakra-ui/react";

export default function Done() {
  return (
    <Container>
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          Payment completed
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"}>
          Collect your order from the caterer
        </Text>
        <Flex w={"full"} justifyContent="center" paddingTop="20px">
          <Image src={hero} align="center" />
        </Flex>
      </Stack>
    </Container>
  );
}
