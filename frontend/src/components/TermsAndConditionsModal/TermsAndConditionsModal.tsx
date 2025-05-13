import React, { useState } from 'react'
import { Stack, Dialog, DialogFooter, DialogType, PrimaryButton, Checkbox, Text } from '@fluentui/react'
import { Icon } from '@fluentui/react/lib/Icon'

interface TermsAndConditionsModalProps {
  hidden: boolean
  onSubmit: () => void
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({ hidden, onSubmit }) => {
  const [isChecked, setIsChecked] = useState(false)

  const dialogContentProps = {
    type: DialogType.largeHeader,
    title: 'Terms and Conditions'
  }

  const modalProps = {
    isBlocking: true
  }

  const handleCheckboxChange: (event?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => void = (
    _,
    checked
  ) => {
    setIsChecked(!!checked)
  }

  const points = [
    { text: 'I provide general People (previously known as HR) information and guidance.', iconName: 'CheckMark' },
    { text: 'I don’t replace People professionals or give legal advice', iconName: 'Cancel' },
    {
      text: 'Your chats are confidential, but will be stored and analysed so please avoid sharing sensitive personal data.',
      iconName: 'Lock'
    },
    {
      text: 'For complex or personal issues, please visit the A-Z on Sharepoint and/or contact your People team directly.',
      iconName: 'Phone'
    },
    {
      text: (
        <>
          We would love to hear your feedback! Please email
          <a href="mailto:engineering-ai@mhra.gov.uk">engineering-ai@mhra.gov.uk</a>with your comments.
        </>
      ),
      iconName: 'Mail'
    }
  ]

  return (
    <Dialog
      hidden={hidden}
      onDismiss={onSubmit}
      modalProps={modalProps}
      dialogContentProps={dialogContentProps}
      minWidth={600}>
      <div id="welcome-message">
        <Text>
          Welcome to the MHRA People Chatbot!
          <span>
            {' '}
            <Icon iconName={'Robot'} styles={{ root: { fontSize: 16, color: '#0078D4' } }} />
          </span>
        </Text>
      </div>
      <br />
      <div>
        <Stack tokens={{ childrenGap: 10 }}>
          {points.map((point, index) => (
            <Stack horizontal verticalAlign="center" key={index} tokens={{ childrenGap: 10 }} id={`terms-point-${index}`}>
              <Icon iconName={point.iconName} styles={{ root: { fontSize: 16, color: '#0078D4' } }} />
              <Text>{point.text}</Text>
            </Stack>
          ))}
        </Stack>
      </div>
      <br />
      <br />
      <Checkbox id="terms-checkbox" label="I agree to the terms and conditions" checked={isChecked} onChange={handleCheckboxChange} />
      <DialogFooter data-testid="dialog-footer">
        <PrimaryButton id="submit-button" onClick={onSubmit} text="Submit" disabled={!isChecked} />
      </DialogFooter>
    </Dialog>
  )
}

export default TermsAndConditionsModal
