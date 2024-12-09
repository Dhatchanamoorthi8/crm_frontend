import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  Badge,
  BadgeIcon,
  BadgeText,
  Card,
  Heading,
  InputField,
  InputIcon,
  InputSlot,
  PhoneIcon,
  ScrollView,
  SearchIcon,
  SettingsIcon,
  Text,
  View,
  VStack
} from '@gluestack-ui/themed'
import React, { useEffect, useState } from 'react'
import api from '../Services/axiosConfig'
import { HStack } from '@gluestack-ui/themed'
import store from '../../Store/store'
import { Input } from '@gluestack-ui/themed'
import { ColorCodes } from '../Components/ColorCodes'

const EnquiryReports = ({ route }) => {
  const state = store.getState()

  const user_id = state.user.userData.user.userid

  const [NewEnquiryData, setNewEnquiryData] = useState([]) 

  const [filteredData, setFilteredData] = useState([]) 
  
  const [searchQuery, setSearchQuery] = useState('') 

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await api.get(`client-vist/newClientView/${user_id}`)
      if (response.status === 200) {
        setNewEnquiryData(response.data.newClient)
        setFilteredData(response.data.newClient) // Set initial filtered data
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (route.params.headerTitle === 'New Enquiry Details') {
      fetchData()
    }
  }, [])

  // Search functionality
  const handleSearch = text => {
    setSearchQuery(text)

    // Filter the data based on the search query
    if (text.trim() === '') {
      setFilteredData(NewEnquiryData) // Reset to original data if search is empty
    } else {
      const filtered = NewEnquiryData.filter(
        item => item.company_name.toLowerCase().includes(text.toLowerCase()) // Match by company name
      )
      setFilteredData(filtered)
    }
  }

  return (
    <ScrollView>
      
      <View p={'$2'}>
        <Input>
          <InputSlot pl='$3'>
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField
            placeholder='Search Company Name'
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </Input>
      </View>

      
      <View p={'$2'}>
        {filteredData && filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <Card key={index} variant='elevated' mb={'$4'}>
              <View>
                <VStack space='2xl'>
                  <HStack space='md'>
                    <Avatar bg={ColorCodes(item.company_name)}>
                      <AvatarFallbackText >
                        {item.company_name.charAt(0)}
                      </AvatarFallbackText>
                      <AvatarBadge />
                    </Avatar>
                    <VStack>
                      <Heading size='sm' textTransform='capitalize'>
                        {item.company_name}
                      </Heading>
                      <Text size='sm' textTransform='capitalize'>
                        {item.client_name}
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              </View>

              <View my={'$3'} mx={'$1'}>
                <View display='flex'>
                  <Badge
                    size='md'
                    variant='outline'
                    action='success'
                    display='flex'
                    rounded={'$3xl'}
                  >
                    <BadgeIcon as={SettingsIcon} />
                    <BadgeText ml={'$2'}>{item.servicename}</BadgeText>

                    <BadgeIcon as={PhoneIcon} ml={'auto'} />
                    <BadgeText ml={'$2'}>{item.contact}</BadgeText>
                  </Badge>
                </View>
              </View>
            </Card>
          ))
        ) : (
          <Text textAlign='center' mt='$4'>
            No results found.
          </Text>
        )}
      </View>
    </ScrollView>
  )
}

export default EnquiryReports
