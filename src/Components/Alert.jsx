import { View } from '@gluestack-ui/themed'
import React from 'react'
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification'

const Alerts = ({ alertType, content, renderType, onClose, visible }) => {
  const handleClose = () => {
    onClose(false)
  }

  React.useEffect(() => {
    if (visible) {
      const alertTypeMapping = {
        Success: ALERT_TYPE.SUCCESS,
        Warning: ALERT_TYPE.WARNING,
        Error: ALERT_TYPE.DANGER,
        Info: ALERT_TYPE.INFO
      }
      const resolvedAlertType =
        alertTypeMapping[alertType] || ALERT_TYPE.DEFAULT

      if (renderType === 'toast') {
        Toast.show({
          type: resolvedAlertType,
          title: alertType,

          textBody: content,
          titleStyle: {
            fontWeight: 'bold',
            color: '#000',
            fontFamily: 'MonaSans_400Regular'
          },
          textBodyStyle: { fontSize: 14, fontFamily: 'MonaSans_400Regular' },
          duration: 4000 // Auto-dismiss after 4 seconds
        })
        handleClose() // Hide after showing toast
      } else {
        Dialog.show({
          type: resolvedAlertType,
          title: alertType,
          textBody: content,
          titleStyle: {
            fontWeight: 'bold',
            color: '#000',
            fontFamily: 'MonaSans_400Regular'
          },
          textBodyStyle: { fontSize: 20, fontFamily: 'MonaSans_400Regular' },
          button: 'Close',
          onClose: handleClose
        })

        Dialog.hide()
      }
    }
  }, [alertType, content, renderType, visible])

  return <View  />
}
 
export default Alerts
