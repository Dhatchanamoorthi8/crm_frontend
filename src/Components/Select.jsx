import React, { useEffect, useState } from 'react'
import api from '../Services/axiosConfig'
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
  ChevronDownIcon
} from '@gluestack-ui/themed'
import { useIsFocused } from '@react-navigation/native'

const Selects = ({ selectype, onChangeText, refreshData, color, page }) => {
  console.log(selectype, onChangeText, refreshData, color, page)

  const focus = useIsFocused()
  const [selectedValue, setSelectedValue] = useState('')
  const [DropDownData, SetDropDownData] = useState([])

  const [DesginationDropDown, setDesginationDropDown] = useState([])

  const handleSelectChange = value => {
    setSelectedValue(value)
    if (onChangeText) {
      onChangeText(value)
    }
  }

  useEffect(() => {
    if (refreshData) {
      setSelectedValue('')
    }
  }, [refreshData])

  const fetchData = async () => {
    try {
      const response = await api.get('services-offer')

      const response2 = await api.get('userdesgination')

      SetDropDownData(response.data)

      setDesginationDropDown(response2.data)
    } catch (error) {
      console.log(error)
    }
  }

  const renderSelectItems = () => {
    switch (selectype) {
      case 'Visittype':
        return (
          <>
            <SelectItem label='Live Visit' value='LiveVisit' />
            <SelectItem label='TeleCall' value='TeleCall' />
          </>
        )
      case 'FollowupType':
        return (
          <>
            <SelectItem
              label='Client Approval'
              value='ClientApproval'
              display={page === 'NewEnquiry' ? 'none' : 'flex'}
            />
            <SelectItem label='Follow Up' value='Followup' />
            <SelectItem label='Close' value='Close' />
          </>
        )
      case 'Services':
        return DropDownData.map((data, index) => (
          <SelectItem label={data.servicename} value={data.s_id} key={index} />
        ))

      case 'CallStatus':
        return (
          <>
            <SelectItem label='Call Answer' value='CallAnswer' />
            <SelectItem label='Call Not Answer' value='CallNotAnswer' />
          </>
        )

      case 'Position':
        return DesginationDropDown.map((data, index) => (
          <SelectItem
            label={data.DesginationName}
            value={data.Des_id}
            key={data.Des_id}
          />
        ))


      default:
        return <SelectItem label='No Options Available' value='' />
    }
  }

  useEffect(() => {
    fetchData()
  }, [refreshData]) // Fetches data only when refreshData changes

  return (
    <Select
      value={selectedValue}
      onValueChange={handleSelectChange}
      key={refreshData}
    >
      <SelectTrigger variant='outline' size='md' rounded={'$xl'}>
        <SelectInput
          placeholder='Select option'
          fontFamily='MonaSans_400Regular'
        />
        <SelectIcon mr={'$3'} as={ChevronDownIcon} />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>{renderSelectItems()}</SelectContent>
      </SelectPortal>
    </Select>
  )
}

export default Selects
