import {
  Flex,
  Container,
  Heading,
  Stack,
  Text,
  Button,
  Image,
} from "@chakra-ui/react";

import hero from "../images/hero.png";

export default function CallToActionWithIllustration() {
  return (
    <Container maxW={"5xl"}>
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
          Be ahead of{" "}
          <Text as={"span"} color={"orange.400"}>
            the crowd
          </Text>
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"}>
          A multi-faceted website that will help regulate the crowdflow in IITH.
          As proof of concept, this version allows users to remotely order food
          from the canteen as well as check the status of the crowdflow in the
          badminton court.
        </Text>
        <Stack spacing={6} direction={"row"}>
          <Button
            rounded={"full"}
            px={6}
            colorScheme={"orange"}
            bg={"orange.400"}
            _hover={{ bg: "orange.500" }}
            onClick={() => {
              window.location.href = "http://localhost:3000/order";
            }}
          >
            Get started
          </Button>
        </Stack>
        <Flex w={"full"} justifyContent="center" paddingTop="20px">
          <Image src={hero} align="center" />
        </Flex>
      </Stack>
    </Container>
  );
}
