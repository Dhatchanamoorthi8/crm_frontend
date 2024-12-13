import { LeftArrowSvg, RightArrowSvg } from '@/assets/Icons/SvgIcons'
import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'

import { Text, View } from '@gluestack-ui/themed'
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  onNext,
  onPrev
}) => {
  // Calculate the range of items to display (e.g., 1-10, 11-20)
  const startItem = (currentPage - 1) * 10 + 1
  const endItem = Math.min(currentPage * 10, totalItems)

  return (
    <View style={styles.paginationContainer}>
      <View style={styles.paginationBox}>
        <View style={styles.paginationInfo}>
          <Text style={styles.pageInfoText}>
            {startItem}-{endItem} of {totalItems}
          </Text>
        </View>

        <View style={styles.paginationControls}>
          <TouchableOpacity
            onPress={onPrev}
            style={[
              styles.pageButton,
              currentPage === 1 && styles.disabledButton
            ]}
            disabled={currentPage === 1}
          >
            <Text style={styles.pageButtonText}>
              <LeftArrowSvg
                bgcolor={currentPage > totalPages && styles.activeButton}
              />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onNext}
            style={[
              styles.pageButton,
              currentPage === totalPages && styles.disabledButton
            ]}
            disabled={currentPage === totalPages}
          >
            <Text
              style={[
                styles.pageButtonText,
                currentPage < totalPages && styles.activeText
              ]}
            >
              <RightArrowSvg
                bgcolor={currentPage < totalPages && styles.activeButton}
              />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  paginationContainer: {
    marginTop: 30,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align pagination to the right side
    alignItems: 'center',
    width: '60%', // Ensure it takes the full width of the screen
    paddingHorizontal: 10, // Add padding if needed on the sides
    marginLeft: 'auto'
  },
  paginationBox: {
    backgroundColor: '#FFFFFF', // Background color for the box
    borderRadius: 14, // Rounded corners for the box
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  paginationInfo: {
    flex: 1,
    alignItems: 'flex-start'
  },
  pageInfoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0A1629'
  },
  paginationControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  pageButton: {
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pageButtonText: {
    fontSize: 18,
    color: '#0A1629'
  },
  disabledButton: {
    backgroundColor: '#E1E3E8'
  },
  activeButton: {
    backgroundColor: '#3F8CFF' // Active background for next button
  },
  activeText: {
    color: '#FFFFFF' // Active text color for next button
  }
})

export default Pagination
