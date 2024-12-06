// ColorCodes.js
import React from 'react'

// Function to determine badge color based on client name
export const ColorCodes = clientName => {
  console.log(clientName, '999999999999999999')

  const firstLetter = clientName.charAt(0).toLowerCase()

  // Return color based on the first letter of the name
  switch (firstLetter) {
    case 'a':
      return '#2F3C7E,' // Orange
    case 'b':
      return '#101820' // Orange
    case 'c':
      return '#F96167' // Orange
    case 'd':
      return '#990011' // Orange
    case 'e':
      return '#8AAAE5' // Orange
    case 'f':
      return '#00246B' // Orange
    case 'g':
      return '#CADCFC' // Orange
    case 'h':
      return '#89ABE3' // Orange
    case 'i':
      return '#EA738D' // Teal
    case 'j':
      return '#CC313D' // Teal
    case 'k':
      return '#F7C5CC' // Teal
    case 'l':
      return '#2C5F2D' // Orange
    case 'm':
      return '#A1BE95' // Teal
    case 'n':
      return '#F98866' // Teal
    case 'o':
      return '#735DA5' // Teal
    case 'p':
      return '#D3C5E5' // Purple
    case 'q':
      return '#F98866' // Teal
    case 'r':
      return '#FFBB00' // Teal
    case 's':
      return '#C4DFE6' // Yellow
    case 't':
      return '#66A5AD' // Teal
    case 'u':
      return '#20948B' // Teal
    case 'v':
      return '#6AB187' // Teal
    case 'w':
      return '#F52549' // Gray
    case 'x':
      return '#FA6775' // Teal
    case 'y':
      return '#375E97' // Teal
    case 'z':
      return '#FB6542' // Teal
    default:
      return '#00BF62' // Default green
  }
}
