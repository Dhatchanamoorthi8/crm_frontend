import React from 'react'
import {
  AddIcon,
  Button,
  ButtonText,
  AlertCircleIcon,
  Icon,
  Menu,
  MenuItem,
  MenuItemLabel,
  View
} from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'

const Menus = ({ placement, offset, disabledKeys, trigger, menuitemsShow }) => {
  const nav = useNavigation() // Get the navigation object from useNavigation()

  // Function to navigate to different screens with dynamic params
  const navigateto = (navto, params = {}) => {
    nav.navigate(navto, params) // Navigate with dynamic params (e.g., headerTitle)
  }

  return (
    <View>
      <Menu
        placement={placement}
        offset={offset}
        disabledKeys={disabledKeys}
        trigger={({ ...triggerProps }) => {
          return trigger ? (
            trigger(triggerProps) // Using the passed trigger
          ) : (
            <Button {...triggerProps}>
              <ButtonText>Menu</ButtonText>
            </Button>
          )
        }}
      >
        {menuitemsShow === 2 ? (
          <>
            <MenuItem
              key='Add account'
              textValue='Add account'
              onPress={() =>
                navigateto('EnquiryReports', {
                  headerTitle: 'New Enquiry Details'
                })
              }
            >
              <Icon as={AlertCircleIcon} size='sm' mr='$2' />
              <MenuItemLabel size='sm' px='$1'>
                View Details
              </MenuItemLabel>
            </MenuItem>
          </>
        ) : (
          <MenuItem
            key='View Details'
            textValue='View Details'
            onPress={() =>
              navigateto('EnquiryReports', {
                headerTitle: 'Followup Details'
              })
            }
          >
            <Icon as={AlertCircleIcon} size='sm' mr='$2' />
            <MenuItemLabel size='sm' px='$1'>
              View Details
            </MenuItemLabel>
          </MenuItem>
        )}
      </Menu>
    </View>
  )
}

export default Menus
