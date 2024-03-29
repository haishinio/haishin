const Alert = (): React.JSX.Element => (
  <div
    className='border-2 border-sky-200 bg-sky-100 rounded text-center p-4 my-6'
    role='alert'
  >
    <p>If you have recieved this link from Thomas then great!</p>
    <p>
      Thank you for trying out the website and I hope it does everthing you
      want.
    </p>
    <p className='font-medium'>
      <span>Please note:</span> We currently have a cap of 5 streams at a single
      time for the moment and while I do have payment caps in place your usage
      does charge me so please do not use it for long streams if possible at
      this current stage, so we can all use it throughout the month 🙇‍♂️
    </p>
  </div>
)

export default Alert
