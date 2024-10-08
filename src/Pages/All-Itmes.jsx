import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetch from '../Hooks/useFetchData';
import { FaAngleRight, FaChevronLeft } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  StackDivider,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { setItem } from '../Store/itemSlice';

function AllItems() {
  const location = useLocation();
  const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(10);
  const [items, setItems] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const isLargeScreen = useBreakpointValue({ base: false, sm: false, md: true });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const category = useSelector((state) => state.category.category);
  let bestSeller = location.state?.bestSellers || false;

  useEffect(() => {
    !isLargeScreen && setLimit(5);
  }, [isLargeScreen, category]);

  useEffect(() => {
    bestSeller = false;
  }, [category]);

  const url = useCallback(() => {
    return bestSeller
      ? `https://dummyjson.com/products?limit=${limit}&sortBy=rating&skip=${skip}&order=desc`
      : `https://dummyjson.com/products/category/${category?.slug}?limit=${limit}&sortBy=rating&skip=${skip}&order=desc`;
  }, [bestSeller, category, limit, skip]);

  const { data, loading, error } = useFetch(url());

  useEffect(() => {
    if (data) {
      setTotal(data.total);
    }
    if (data && data.products && data.products.length > 0) {
      setItems(data.products);
    }
  }, [data]);

  const lastPageNumber =
    total > limit
      ? total % limit === 0
        ? Math.round(total / limit) + 1
        : Math.round(total / limit)
      : 1;

  return (
    <div className="dark:bg-gray-800 min-h-screen">
      {items &&
        items.map((item) => (
          <VStack
            key={item.id}
            divider={<StackDivider borderColor="gray.200" />}
            spacing={6}
            align="stretch"
            p={4}
            className="bg-white dark:bg-gray-700 rounded-lg shadow-md"
          >
            <Card
              direction={{ base: 'column', sm: 'row' }}
              overflow="hidden"
              variant="outline"
              shadow="sm"
              rounded="lg"
              transition="transform 0.3s, box-shadow 0.3s"
              _hover={{
                transform: 'scale(1.02)',
                shadow: 'lg',
              }}
              sx={{
                backgroundColor: 'white', 
                _dark: {
                  backgroundColor: 'black',
                },
              }}


            onClick={() => {
              dispatch(setItem({ data: item }));
              navigate('/item-page');
            }}
            >
            <Image
              objectFit="cover"
              maxW={{ base: '100%', sm: '300px' }}
              w="full"
              h="auto"
              src={item.thumbnail}
              alt={item.title}
            />

            <Stack flex="1" p={4}>
              <CardBody>
                <Heading size="md" mb={2} className="text-blue-600 dark:text-blue-400">
                  {item.title}
                </Heading>

                <Text py={2} fontSize="sm" className="text-gray-700 dark:text-gray-300">
                  {item.description || 'Description not available'}
                </Text>

                <Box mt={4}>
                  <Text fontWeight="bold" className="text-blue-500 dark:text-blue-300">
                    Price: ${item.price?.toFixed(2) || 'N/A'}
                  </Text>
                  <Text
                    fontWeight="bold"
                    className={
                      item.rating > 3.8
                        ? 'text-green-500 dark:text-green-300'
                        : item.rating > 2.5
                          ? 'text-yellow-500 dark:text-yellow-300'
                          : 'text-red-500 dark:text-red-300'
                    }
                  >
                    Rating: {item.rating?.toFixed(1) || 'No rating'}
                  </Text>
                  <Text fontWeight="bold" className={item.stock > 0 ? 'text-green-500 dark:text-green-300' : 'text-red-500 dark:text-red-300'}>
                    Stock: {item.stock > 0 ? `${item.stock} available` : 'Out of stock'}
                  </Text>
                  <Text fontWeight="bold" className="text-teal-600 dark:text-teal-400">
                    Shipment: {item.shippingInformation || 'Not available'}
                  </Text>
                  <NumberInput
                    size="sm"
                    maxW={20}
                    defaultValue={item.quantity || item.minimumOrderQuantity}
                    min={item.minimumOrderQuantity}
                    max={item.stock > 0 ? Math.round(item.stock / 2) - item.minimumOrderQuantity * 2 : item.minimumOrderQuantity}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Box>
              </CardBody>

              <CardFooter>
              <Button
                  variant="solid"
                  colorScheme="blue"
                  size="sm"
                  borderRadius="full"
                  isDisabled={item.stock === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/cart', { state: { item: item, add: true } });
                  }}
                >
                  {item.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              </CardFooter>
            </Stack>
          </Card>
          </VStack>
  ))
}

{/* Pagination Starts here*/ }

<div className="flex items-center justify-between border-t border-gray-200 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6">
  <div className="flex flex-1 justify-between sm:hidden">
    <a
      href="#"
      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
    >
      Previous
    </a>
    <a
      href="#"
      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
    >
      Next
    </a>
  </div>
  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
    <div>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Showing <span className="font-medium">{skip + 1}</span> to <span className="font-medium">{skip + 10 > total ? total : skip + 10}</span> of{' '}
        <span className="font-medium">{total}</span> results
      </p>
    </div>
    <div>
      <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
        <a
          href="#"
          className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:z-20 focus:outline-offset-0 ${pageNumber <= 1 ? 'hidden' : 'flex'
            }`}
          onClick={() => {
            const page = pageNumber;
            setPageNumber(page - 1);
            setSkip(page * limit);
          }}
        >
          <span className="sr-only">Previous</span>
          <FaChevronLeft />
        </a>

        <a
          href="#"
          aria-current="page"
          className="relative z-10 inline-flex items-center bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {pageNumber}
        </a>
        <a
          href="#"
          className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:z-20 focus:outline-offset-0 ${pageNumber >= lastPageNumber ? 'hidden' : 'flex'
            }`}
          onClick={() => {
            const page = pageNumber;
            setPageNumber(page + 1);
            setSkip(page * limit);
          }}
        >
          <span className="sr-only">Next</span>
          <FaAngleRight />
        </a>
      </nav>
    </div>
  </div>
</div>
{/* Pagination ends here*/ }
    </div >
  );
}

export default AllItems;
