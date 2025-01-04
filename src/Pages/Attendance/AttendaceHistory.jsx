import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { store } from '../../../Store/store'
import api from '@/src/Services/axiosConfig'
import Spinner from 'react-native-loading-spinner-overlay'
import { Card, View, Text, Center } from '@gluestack-ui/themed'
import Pagination from '../../Components/Pagination'
import { RefreshControl } from 'react-native-gesture-handler'

const AttendaceHistory = () => {
  const state = store.getState()
  const userid = state.user.userData.user.userid

  const [HistoryData, SetHistoryData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0) // Total number of items
  const [loader, setLoader] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const fetchHistoryData = async (page = 1) => {
    setLoader(true)
    try {
      const response = await api.get(
        `attendance/attendanceHistory/${userid}?page=${page}&limit=10` // Correct limit
      )
      if (response.data) {
        SetHistoryData(response.data.data)
        setTotalPages(response.data.totalPages)
        setTotalItems(response.data.total) // Set the total number of items from the response
        setCurrentPage(response.data.currentPage)
      }
    } catch (error) {
      console.error('Error fetching attendance history:', error)
    } finally {
      setLoader(false)
    }
  }

  useEffect(() => {
    fetchHistoryData() // Load initial data
  }, [])

  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchHistoryData(currentPage + 1) // Fetch next page
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchHistoryData(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchHistoryData(currentPage + 1)
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setLoader(true)
    fetchHistoryData()
    setTimeout(() => {
      setRefreshing(false)
      setLoader(false)
    }, 1000)
  }, [])

  return (
    <ScrollView
      style={{ backgroundColor: '#F4F9FD' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.cardWrapper} mb='$2'>
        {HistoryData && HistoryData.length > 0 ? (
          HistoryData.map((item, index) => (
            <Card
              variant='elevated'
              style={styles.card}
              key={index}
              // backgroundColor='black'
            >
              <View
                display='flex'
                flexDirection='row'
                justifyContent='space-between'
                alignItems='center'
              >
                <Text fontFamily='MonaSans_Bold'>{item.attendance_date}</Text>
              </View>

              <View
                display='flex'
                flexDirection='row'
                justifyContent='space-between'
                mt='$4'
                borderRightWidth={2}
                bg='#F4F9FD'
                borderCurve='continuous'
                className='p-6 rounded-lg'
              >
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={styles.text} className='mb-4'>
                    Intime
                  </Text>
                  <Text
                    style={{ fontSize: 16 }}
                    fontFamily='MonaSans_400Regular'
                    color='$green700'
                  >
                    {item.intime}
                  </Text>
                </View>

                {/* Divider */}
                <View
                  style={{
                    width: 1,
                    backgroundColor: '#E4E6E8',
                    marginHorizontal: 10,
                    height: '120%'
                  }}
                />

                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={styles.text} className='mb-4'>
                    Outime
                  </Text>
                  <Text
                    style={{ fontSize: 16 }}
                    fontFamily='MonaSans_400Regular'
                    color='$red600'
                  >
                    {item.outime ? item.outime : 'null'}
                  </Text>
                </View>

                {/* Divider */}
                <View
                  style={{
                    width: 1,
                    backgroundColor: '#E4E6E8',
                    marginHorizontal: 10,
                    height: '120%'
                  }}
                />

                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={styles.text} className='mb-4'>
                    Total Hours
                  </Text>
                  <Text
                    style={{ fontSize: 16 }}
                    fontFamily='MonaSans_400Regular'
                    color='#3F8CFF'
                  >
                    {item.total_hours ? `${item.total_hours} hr` : 'null'}
                  </Text>
                </View>
              </View>

              <View
                display='flex'
                flexDirection='row'
                justifyContent='space-between'
                mt={'$5'}
              >
                <View>
                  <Text style={styles.text} color='#000'>
                    Location
                  </Text>
                  <Text style={styles.text} color='#91929E' mt={'$2'}>
                    {item.location_name}
                  </Text>
                </View>
              </View>
            </Card>
          ))
        ) : (
          <>
            <Center>
              <Spinner size={'large'} visible={loader} />
            </Center>
            <Text textAlign='center' mt='$4'>
              No results found.
            </Text>
          </>
        )}
      </View>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems} // Pass total items count
        onPrev={handlePrevPage}
        onNext={handleNextPage}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    paddingHorizontal: 5,
    paddingVertical: 10
  },
  card: {
    backgroundColor: '#FFFF', // White background for card
    borderRadius: 13, // Rounded corners
    shadowColor: '#000', // Black shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow offset
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20
  },
  text: {
    fontSize: 14,
    fontFamily: 'MonaSans_400Regular',
    color: 'black'
  }
})

export default AttendaceHistory
